import { _decorator, Component, Sprite, SpriteFrame, resources, tween, v3, UIOpacity, Color, Node, UITransform, easing, Vec3 } from 'cc';
import { MergeLogic } from './MergeLogic';
import { AudioManager } from '../audio/AudioManager';
import { ParticleEffects } from '../effects/ParticleEffects';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';

const { ccclass, property } = _decorator;

/**
 * 工具物品
 * 合成系统中的可拖拽工具
 */
@ccclass('ToolItem')
export class ToolItem extends Component {
    @property(Sprite)
    toolSprite: Sprite = null!;

    @property() toolLevel: number = 1;

    @property() readonly MAX_LEVEL: number = 7;

    // 工具资源路径映射
    private static readonly TOOL_RESOURCES: Record<number, string> = {
        1: 'tools/tool_level_1',
        2: 'tools/tool_level_2',
        3: 'tools/tool_level_3',
        4: 'tools/tool_level_4',
        5: 'tools/tool_level_5',
        6: 'tools/tool_level_6',
        7: 'tools/tool_level_7'
    };

    // 工具名称映射
    private static readonly TOOL_NAMES: Record<number, string> = {
        1: '基础扫帚',
        2: '进阶扫帚',
        3: '高级扫帚',
        4: '智能吸尘器',
        5: 'AI整理助手',
        6: '超级清洁机器人',
        7: '终极收纳大师'
    };

    private audioManager!: AudioManager;
    private eventManager!: EventManager;
    private isDragging: boolean = false;
    private originalPosition: Vec3 = v3(0, 0, 0);
    private mergeLogic!: MergeLogic;

    onLoad() {
        this.audioManager = AudioManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.mergeLogic = MergeLogic.instance;

        // 初始化拖拽交互
        this.initDragInteraction();

        // 加载工具图标
        this.loadToolIcon();
    }

    /**
     * 初始化拖拽交互
     */
    private initDragInteraction(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    private onTouchStart(event: any): void {
        event.propagationStopped = true;
        this.isDragging = true;
        this.originalPosition = v3(this.node.position.x, this.node.position.y, this.node.position.z);

        // 拖拽开始视觉反馈
        this.node.setScale(1.1, 1.1, 1.1);
        this.audioManager.playSFX('sfx_item_pickup');

        // 提升层级
        this.node.setSiblingIndex(999);
    }

    private onTouchMove(event: any): void {
        if (!this.isDragging) return;

        const uiPos = event.getUILocation();
        this.node.setPosition(uiPos.x, uiPos.y, this.originalPosition.z);
    }

    private onTouchEnd(event: any): void {
        if (!this.isDragging) return;
        this.isDragging = false;

        // 恢复缩放
        this.node.setScale(1.0, 1.0, 1.0);

        // 通知合并系统处理放置
        this.eventManager.emit(GAME_EVENTS.TOOL_DRAG_END, {
            toolItem: this,
            position: this.node.position.clone(),
            level: this.toolLevel
        });
    }

    private onTouchCancel(_event: any): void {
        if (!this.isDragging) return;
        this.isDragging = false;

        // 弹回原位
        tween(this.node)
            .to(0.2, { position: this.originalPosition }, { easing: easing.backOut })
            .start();

        this.node.setScale(1.0, 1.0, 1.0);
    }

    /**
     * 根据等级加载对应的工具图标
     */
    private loadToolIcon(): void {
        const resourcePath = ToolItem.TOOL_RESOURCES[this.toolLevel];
        if (!resourcePath) {
            console.warn(`[ToolItem] No resource for level ${this.toolLevel}`);
            return;
        }

        resources.load(resourcePath, SpriteFrame, (err, asset) => {
            if (err || !asset) {
                console.warn(`[ToolItem] Failed to load tool icon: ${resourcePath}`, err);
                // 使用默认颜色作为占位符
                this.setPlaceholderIcon();
                return;
            }

            if (this.toolSprite) {
                this.toolSprite.spriteFrame = asset as SpriteFrame;
            }
        });
    }

    /**
     * 设置占位图标
     */
    private setPlaceholderIcon(): void {
        if (!this.toolSprite) return;

        // 根据等级设置不同颜色
        const colors: Record<number, Color> = {
            1: new Color(180, 180, 180, 255),
            2: new Color(120, 180, 120, 255),
            3: new Color(120, 120, 200, 255),
            4: new Color(180, 120, 200, 255),
            5: new Color(200, 180, 80, 255),
            6: new Color(255, 140, 80, 255),
            7: new Color(255, 215, 0, 255)
        };

        this.toolSprite.color = colors[this.toolLevel] || new Color(255, 255, 255, 255);
    }

    /**
     * 升级工具
     */
    upgrade(): boolean {
        if (this.toolLevel >= this.MAX_LEVEL) {
            return false;
        }

        this.toolLevel++;

        // 播放升级特效
        this.playUpgradeEffect();

        // 更新工具图标
        this.loadToolIcon();

        // 发送升级事件
        this.eventManager.emit(GAME_EVENTS.TOOL_UPGRADED, {
            level: this.toolLevel,
            name: ToolItem.TOOL_NAMES[this.toolLevel]
        });

        return true;
    }

    /**
     * 播放升级特效
     */
    private playUpgradeEffect(): void {
        // 播放合成音效
        this.audioManager.playSFX('sfx_merge_success');

        // 播放夸张的缩放动画
        const originalScale = this.node.scale.clone();

        // 放大 -> 缩小 -> 正常
        tween(this.node)
            .to(0.15, { scale: v3(1.4, 1.4, 1) }, { easing: easing.backOut })
            .to(0.1, { scale: v3(0.9, 0.9, 1) }, { easing: easing.quadIn })
            .to(0.1, { scale: v3(1.0, 1.0, 1) }, { easing: easing.quadOut })
            .start();

        // 显示成功粒子
        ParticleEffects.showSuccessParticles(this.node.worldPosition);
    }

    /**
     * 是否可以合并
     */
    canMergeWith(other: ToolItem): boolean {
        if (!other) return false;
        return other.toolLevel === this.toolLevel && this.toolLevel < this.MAX_LEVEL;
    }

    /**
     * 获取工具名称
     */
    getToolName(): string {
        return ToolItem.TOOL_NAMES[this.toolLevel] || '未知工具';
    }

    /**
     * 获取工具增益效果
     */
    getToolBonus(): { timeBonus: number, autoSort: boolean, showHint: boolean, oneClickSort: boolean } {
        return this.mergeLogic.getToolBonus(this.toolLevel);
    }

    /**
     * 设置工具等级
     */
    setLevel(level: number): void {
        if (level < 1 || level > this.MAX_LEVEL) return;
        this.toolLevel = level;
        this.loadToolIcon();
    }

    onDestroy(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
}
