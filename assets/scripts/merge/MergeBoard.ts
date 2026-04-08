import { _decorator, Component, Node, Sprite, SpriteFrame, resources, UITransform, Color, tween, v3, easing, Vec3, UIOpacity } from 'cc';
import { ToolItem } from './ToolItem';
import { MergeLogic } from './MergeLogic';
import { AudioManager } from '../audio/AudioManager';
import { ParticleEffects } from '../effects/ParticleEffects';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS, GAME_CONFIG } from '../../data/constants';

const { ccclass, property } = _decorator;

/**
 * 合成面板
 * 3x4格子的合成棋盘
 */
@ccclass('MergeBoard')
export class MergeBoard extends Component {
    @property()
    readonly BOARD_WIDTH: number = 3;

    @property()
    readonly BOARD_HEIGHT: number = 4;

    @property({ type: Node })
    slotContainer: Node | null = null;

    @property({ type: Node })
    slotPrefab: Node | null = null;

    @property({ type: Node })
    toolPrefab: Node | null = null;

    @property({ type: Sprite })
    emptySlotSprite: Sprite | null = null;

    private _slots: (ToolItem | null)[][] = [];
    private _slotNodes: (Node | null)[][] = [];
    private mergeLogic!: MergeLogic;
    private audioManager!: AudioManager;
    private eventManager!: EventManager;
    private isMerging: boolean = false;

    onLoad() {
        this.mergeLogic = MergeLogic.instance;
        this.audioManager = AudioManager.getInstance();
        this.eventManager = EventManager.getInstance();

        // 初始化数据结构
        this.initSlotData();

        // 初始化合成格子
        this.initSlots();

        // 监听工具拖拽结束事件
        this.eventManager.on(GAME_EVENTS.TOOL_DRAG_END, this.onToolDragEnd as any, this);
    }

    /**
     * 初始化槽位数据结构
     */
    private initSlotData(): void {
        this._slots = [];
        this._slotNodes = [];

        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            this._slots[y] = [];
            this._slotNodes[y] = [];
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                this._slots[y][x] = null;
                this._slotNodes[y][x] = null;
            }
        }
    }

    /**
     * 初始化合成格子（创建3x12个格子节点）
     */
    private initSlots(): void {
        const container = this.slotContainer || this.node;

        // 如果没有预制体，创建简单的格子
        if (!this.slotPrefab) {
            this.createDefaultSlots(container);
        } else {
            this.createSlotsFromPrefab(container);
        }
    }

    /**
     * 创建默认格子
     */
    private createDefaultSlots(container: Node): void {
        const slotSize = 100; // 默认格子大小
        const spacing = 10;   // 间距

        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                const slotNode = new Node(`Slot_${x}_${y}`);
                slotNode.setParent(container);

                // 设置位置（从左上角开始）
                const posX = x * (slotSize + spacing);
                const posY = -y * (slotSize + spacing);
                slotNode.setPosition(posX, posY, 0);

                // 添加UI变换组件
                const transform = slotNode.addComponent(UITransform);
                transform.setContentSize(slotSize, slotSize);

                // 添加背景精灵
                const sprite = slotNode.addComponent(Sprite);
                sprite.color = new Color(200, 200, 200, 100);

                this._slotNodes[y][x] = slotNode;
            }
        }
    }

    /**
     * 从预制体创建格子
     */
    private createSlotsFromPrefab(container: Node): void {
        if (!this.slotPrefab) return;

        const slotSize = this.slotPrefab.getComponent(UITransform)?.contentSize || { width: 100, height: 100 };
        const spacing = 10;

        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                const slotNode = this.slotPrefab.clone();
                slotNode.name = `Slot_${x}_${y}`;
                slotNode.setParent(container);
                slotNode.active = true;

                // 设置位置
                const posX = x * (slotSize.width + spacing);
                const posY = -y * (slotSize.height + spacing);
                slotNode.setPosition(posX, posY, 0);

                this._slotNodes[y][x] = slotNode;
            }
        }
    }

    /**
     * 工具拖拽结束处理
     */
    private onToolDragEnd(data: { toolItem: ToolItem, position: Vec3, level: number }): void {
        if (this.isMerging) return;

        const { toolItem, position } = data;

        // 找到最近的格子
        const slotPos = this.findNearestSlot(position);
        if (!slotPos) {
            // 没有找到合适的格子，弹回原位
            return;
        }

        const { x, y } = slotPos;

        // 检查目标格子是否已有工具
        const existingTool = this._slots[y][x];

        if (existingTool && existingTool !== toolItem) {
            // 尝试合并
            if (toolItem.canMergeWith(existingTool)) {
                this.performMerge(toolItem, existingTool, x, y);
            } else {
                // 交换位置
                this.swapTools(toolItem, existingTool, x, y);
            }
        } else if (!existingTool) {
            // 放置到空格子
            this.placeTool(toolItem, x, y);
        }
    }

    /**
     * 找到最近的格子位置
     */
    private findNearestSlot(worldPos: Vec3): { x: number, y: number } | null {
        const container = this.slotContainer || this.node;
        const containerWorldPos = container.worldPosition;

        // 转换为相对于容器的坐标
        const localX = worldPos.x - containerWorldPos.x;
        const localY = worldPos.y - containerWorldPos.y;

        const slotSize = 100;
        const spacing = 10;
        const cellSize = slotSize + spacing;

        // 计算格子索引
        const gridX = Math.round(localX / cellSize);
        const gridY = Math.round(-localY / cellSize);

        // 检查是否在有效范围内
        if (gridX >= 0 && gridX < this.BOARD_WIDTH && gridY >= 0 && gridY < this.BOARD_HEIGHT) {
            return { x: gridX, y: gridY };
        }

        return null;
    }

    /**
     * 执行合并
     */
    private performMerge(fromTool: ToolItem, toTool: ToolItem, toX: number, toY: number): void {
        this.isMerging = true;

        // 播放合成音效
        this.audioManager.playSFX('sfx_merge_success');

        // 获取新等级
        const newLevel = this.mergeLogic.getMergedLevel(fromTool.toolLevel);

        // 从原格子移除
        this.removeTool(fromTool);

        // 移除目标格子的工具
        if (this._slots[toY][toX]) {
            this._slots[toY][toX]?.node.destroy();
        }

        // 在目标位置创建新工具
        const newTool = this.createToolAt(newLevel, toX, toY);
        if (newTool) {
            // 播放升级特效
            ParticleEffects.showSuccessParticles(this._slotNodes[toY][toX]?.worldPosition || v3(0, 0, 0));

            // 发送合并成功事件
            this.eventManager.emit(GAME_EVENTS.TOOL_UPGRADED, {
                level: newLevel,
                fromLevel: fromTool.toolLevel
            });
        }

        this.isMerging = false;
    }

    /**
     * 交换工具位置
     */
    private swapTools(tool1: ToolItem, tool2: ToolItem, x: number, y: number): void {
        // 找到tool1的位置
        const pos1 = this.findToolPosition(tool1);
        if (!pos1) return;

        // 交换数据
        this._slots[pos1.y][pos1.x] = tool2;
        this._slots[y][x] = tool1;

        // 动画移动
        const slot1Node = this._slotNodes[pos1.y][pos1.x];
        const slot2Node = this._slotNodes[y][x];

        if (slot1Node && slot2Node) {
            const tool1WorldPos = slot1Node.worldPosition;
            const tool2WorldPos = slot2Node.worldPosition;

            tween(tool1.node)
                .to(0.2, { position: tool1WorldPos }, { easing: easing.backOut })
                .start();

            tween(tool2.node)
                .to(0.2, { position: tool2WorldPos }, { easing: easing.backOut })
                .start();
        }
    }

    /**
     * 放置工具到格子
     */
    private placeTool(tool: ToolItem, x: number, y: number): void {
        // 从原位置移除
        this.removeTool(tool);

        // 放置到新位置
        this._slots[y][x] = tool;

        // 动画移动到格子中心
        const slotNode = this._slotNodes[y][x];
        if (slotNode) {
            const slotWorldPos = slotNode.worldPosition;
            tween(tool.node)
                .to(0.2, { position: slotWorldPos }, { easing: easing.backOut })
                .start();
        }
    }

    /**
     * 移除工具
     */
    private removeTool(tool: ToolItem): void {
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this._slots[y][x] === tool) {
                    this._slots[y][x] = null;
                    return;
                }
            }
        }
    }

    /**
     * 找到工具的位置
     */
    private findToolPosition(tool: ToolItem): { x: number, y: number } | null {
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this._slots[y][x] === tool) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    /**
     * 在指定位置创建工具
     */
    private createToolAt(level: number, x: number, y: number): ToolItem | null {
        let toolNode: Node;

        if (this.toolPrefab) {
            toolNode = this.toolPrefab.clone();
            toolNode.active = true;
        } else {
            toolNode = new Node(`Tool_${level}`);
            const transform = toolNode.addComponent(UITransform);
            transform.setContentSize(80, 80);
            const sprite = toolNode.addComponent(Sprite);
            sprite.color = new Color(255, 255, 255, 255);
        }

        const container = this.slotContainer || this.node;
        toolNode.setParent(container);

        const slotNode = this._slotNodes[y][x];
        if (slotNode) {
            toolNode.setPosition(slotNode.position);
        }

        const toolItem = toolNode.getComponent(ToolItem);
        if (!toolItem) {
            toolNode.addComponent(ToolItem);
        }

        const tool = toolNode.getComponent(ToolItem);
        if (tool) {
            tool.setLevel(level);
            this._slots[y][x] = tool;
        }

        return tool;
    }

    /**
     * 尝试合并两个工具
     */
    tryMerge(fromX: number, fromY: number, toX: number, toY: number): boolean {
        // 边界检查
        if (fromX < 0 || fromX >= this.BOARD_WIDTH || fromY < 0 || fromY >= this.BOARD_HEIGHT) {
            return false;
        }
        if (toX < 0 || toX >= this.BOARD_WIDTH || toY < 0 || toY >= this.BOARD_HEIGHT) {
            return false;
        }

        const fromTool = this._slots[fromY][fromX];
        const toTool = this._slots[toY][toX];

        if (!fromTool || !toTool) {
            return false;
        }

        // 检查是否可以合并
        if (!fromTool.canMergeWith(toTool)) {
            return false;
        }

        // 执行合并
        this.performMerge(fromTool, toTool, toX, toY);

        return true;
    }

    /**
     * 获取空格子
     */
    getEmptySlot(): { x: number, y: number } | null {
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this._slots[y][x] === null) {
                    return { x, y };
                }
            }
        }
        return null;
    }

    /**
     * 添加新工具
     */
    addTool(toolLevel: number): boolean {
        const emptySlot = this.getEmptySlot();
        if (!emptySlot) {
            console.warn('[MergeBoard] No empty slot available');
            return false;
        }

        const tool = this.createToolAt(toolLevel, emptySlot.x, emptySlot.y);
        return tool !== null;
    }

    /**
     * 获取指定位置的格子节点
     */
    getSlotNode(x: number, y: number): Node | null {
        if (x < 0 || x >= this.BOARD_WIDTH || y < 0 || y >= this.BOARD_HEIGHT) {
            return null;
        }
        return this._slotNodes[y][x];
    }

    /**
     * 获取指定位置的格子中的工具
     */
    getToolAt(x: number, y: number): ToolItem | null {
        if (x < 0 || x >= this.BOARD_WIDTH || y < 0 || y >= this.BOARD_HEIGHT) {
            return null;
        }
        return this._slots[y][x];
    }

    /**
     * 获取所有工具
     */
    getAllTools(): ToolItem[] {
        const tools: ToolItem[] = [];
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this._slots[y][x]) {
                    tools.push(this._slots[y][x]!);
                }
            }
        }
        return tools;
    }

    /**
     * 检查棋盘是否已满
     */
    isFull(): boolean {
        return this.getEmptySlot() === null;
    }

    /**
     * 获取空格子数量
     */
    getEmptySlotCount(): number {
        let count = 0;
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this._slots[y][x] === null) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * 清理棋盘
     */
    clear(): void {
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this._slots[y][x]) {
                    this._slots[y][x]?.node.destroy();
                    this._slots[y][x] = null;
                }
            }
        }
    }

    onDestroy(): void {
        this.eventManager.off(GAME_EVENTS.TOOL_DRAG_END, this.onToolDragEnd as any, this);
    }
}
