import { _decorator, Component, Node, instantiate, Sprite, UITransform, Label, Color, UIOpacity } from 'cc';
import { LevelManager, LevelDefinition, ItemConfig, SlotConfig } from '../gameplay/LevelManager';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../data/constants';
import { ItemController } from '../gameplay/ItemController';
import { DragHandler } from '../gameplay/DragHandler';
import { SlotController } from '../gameplay/SlotController';
import { TimerController } from '../gameplay/TimerController';
import { AudioManager } from '../audio/AudioManager';
import { getLevelConfig } from '../data/levels';
import { LevelDataConfig, LevelItemConfig, LevelSlotConfig } from '../data/types';
import { OperationType } from '../data/LevelData';
import { WipeHandler } from '../gameplay/WipeHandler';

const { ccclass, property } = _decorator;

interface WipeProgressPayload {
    levelId?: number;
    itemId?: string;
    slotId?: string;
    progress: number;
    completed: boolean;
}

interface WipeCompletePayload {
    levelId?: number;
    itemId?: string;
    slotId?: string;
    progress: number;
}

@ccclass('GameScene')
export class GameScene extends Component {
    @property({ type: Node, tooltip: '物品预制体' })
    private itemPrefab: Node | null = null;

    @property({ type: Node, tooltip: '槽位预制体' })
    private slotPrefab: Node | null = null;

    @property({ type: Node, tooltip: '物品容器节点' })
    private itemContainer: Node | null = null;

    @property({ type: Node, tooltip: '槽位容器节点' })
    private slotContainer: Node | null = null;

    @property({ type: Label, tooltip: '进度显示标签' })
    private progressLabel: Label | null = null;

    @property({ type: TimerController, tooltip: '计时器控制器' })
    private timerController: TimerController | null = null;

    @property({ type: Label, tooltip: '时间显示标签' })
    private timeLabel: Label | null = null;

    private levelManager = new LevelManager();
    private eventManager = EventManager.getInstance();
    private audioManager = AudioManager.getInstance();
    private currentLevelId = 1;
    private currentLevelConfig: LevelDataConfig | null = null;
    private wipeItemMap = new Map<string, LevelItemConfig>();
    private wipeSlotMap = new Map<string, LevelSlotConfig>();
    private completedWipeItems = new Set<string>();
    private levelCompleted = false;

    onLoad() {
        this.registerEvents();
        this.loadLevel(this.currentLevelId);
    }

    public loadLevel(levelId: number): void {
        const levelConfig = getLevelConfig(levelId);

        if (!levelConfig) {
            console.error(`[GameScene] 关卡 ${levelId} 不存在，且未配置可用 fallback，已取消加载`);
            return;
        }

        this.currentLevelId = levelId;
        this.currentLevelConfig = levelConfig;
        this.levelCompleted = false;
        this.setupWipeTargets(levelConfig);
        this.completedWipeItems.clear();
        this.clearLevelNodes();

        const levelDefinition: LevelDefinition = {
            id: `level_${levelId}`,
            name: levelConfig.sceneDisplayName,
            items: levelConfig.items.map((item) => ({
                id: item.id,
                type: item.type,
                position: item.initialPos,
            })),
            slots: levelConfig.slots.map((slot) => ({
                id: slot.id,
                allowedItemTypes: slot.acceptTypes,
                position: slot.pos,
            })),
            requiredItems: levelConfig.items.length,
            timeLimit: levelConfig.timeLimit > 0 ? levelConfig.timeLimit : undefined,
        };

        this.levelManager.loadLevel(levelDefinition);
        this.instantiateLevelObjects(levelDefinition);
        this.updateProgressDisplay();

        if (levelDefinition.timeLimit && this.timerController) {
            this.timerController.startTimer(levelDefinition.timeLimit);
        } else if (levelDefinition.timeLimit && this.timeLabel) {
            const timerNode = this.node.getChildByName('Timer');
            const timer = timerNode?.getComponent(TimerController) ?? null;
            timer?.startTimer(levelDefinition.timeLimit);
        }

        this.eventManager.emit(GAME_EVENTS.LEVEL_LOADED, levelDefinition);
        console.log(`[GameScene] 已加载关卡 ${levelId}: ${levelConfig.sceneDisplayName}`);
    }

    start() {
        this.audioManager.playClick();
    }

    private registerEvents(): void {
        this.eventManager.on(GAME_EVENTS.ITEM_PLACED, this.handleItemPlaced as any);
        this.eventManager.on(GAME_EVENTS.ITEM_REMOVED, this.handleItemRemoved as any);
        this.eventManager.on('wipe-progress', this.handleWipeProgress as any);
        this.eventManager.on('item-wiped', this.handleItemWiped as any);
    }

    private unregisterEvents(): void {
        this.eventManager.off(GAME_EVENTS.ITEM_PLACED, this.handleItemPlaced as any);
        this.eventManager.off(GAME_EVENTS.ITEM_REMOVED, this.handleItemRemoved as any);
        this.eventManager.off('wipe-progress', this.handleWipeProgress as any);
        this.eventManager.off('item-wiped', this.handleItemWiped as any);
    }

    private setupWipeTargets(levelConfig: LevelDataConfig): void {
        this.wipeItemMap.clear();
        this.wipeSlotMap.clear();

        levelConfig.items
            .filter((item) => item.operation === OperationType.WIPE)
            .forEach((item) => {
                this.wipeItemMap.set(item.id, item);
                const slot = levelConfig.slots.find((candidate) => candidate.id === item.targetSlotId);
                if (slot) {
                    this.wipeSlotMap.set(item.id, slot);
                }
            });
    }

    private clearLevelNodes(): void {
        this.itemContainer?.removeAllChildren();
        this.slotContainer?.removeAllChildren();
    }

    private instantiateLevelObjects(level: LevelDefinition): void {
        level.slots.forEach((slotConfig) => this.createSlot(slotConfig));
        level.items.forEach((itemConfig) => this.createItem(itemConfig));
    }

    private createSlot(config: SlotConfig): void {
        if (!this.slotPrefab || !this.slotContainer) {
            return;
        }

        const slotNode = instantiate(this.slotPrefab);
        slotNode.name = `Slot_${config.id}`;
        slotNode.setParent(this.slotContainer);
        slotNode.setPosition(config.position.x, config.position.y, 0);

        const slotController = slotNode.getComponent(SlotController);
        if (slotController) {
            slotController.slotId = config.id;
            slotController['allowedItemTypes'] = config.allowedItemTypes;
        }

        const transform = slotNode.getComponent(UITransform);
        if (transform) {
            const slotData = this.currentLevelConfig?.slots.find((slot) => slot.id === config.id);
            transform.setContentSize({
                width: slotData?.size.w ?? 100,
                height: slotData?.size.h ?? 100,
            });
        }

        const sprite = slotNode.getComponent(Sprite);
        if (sprite) {
            sprite.color = new Color(180, 180, 180, this.isWipeSlot(config.id) ? 150 : 255);
        }
    }

    private createItem(config: ItemConfig): void {
        if (!this.itemPrefab || !this.itemContainer) {
            return;
        }

        const itemNode = instantiate(this.itemPrefab);
        itemNode.name = `Item_${config.id}`;
        itemNode.setParent(this.itemContainer);
        itemNode.setPosition(config.position.x, config.position.y, 0);

        const itemController = itemNode.getComponent(ItemController);
        if (itemController) {
            itemController.setup(config.id, config.type);
        }

        const levelItem = this.currentLevelConfig?.items.find((item) => item.id === config.id) ?? null;
        const isWipeItem = levelItem?.operation === OperationType.WIPE;

        if (isWipeItem) {
            this.setupWipeItem(itemNode, levelItem!);
        } else {
            const dragHandler = itemNode.getComponent(DragHandler);
            if (!dragHandler) {
                itemNode.addComponent(DragHandler);
            }
        }

        const transform = itemNode.getComponent(UITransform);
        if (transform) {
            const targetSlot = levelItem ? this.wipeSlotMap.get(levelItem.id) : null;
            transform.setContentSize({
                width: targetSlot?.size.w ?? 80,
                height: targetSlot?.size.h ?? 80,
            });
        }

        const sprite = itemNode.getComponent(Sprite);
        if (sprite) {
            sprite.color = isWipeItem ? new Color(210, 170, 110, 255) : new Color(100, 200, 100, 255);
        }
    }

    private setupWipeItem(itemNode: Node, levelItem: LevelItemConfig): void {
        const wipeSlot = this.wipeSlotMap.get(levelItem.id);
        const requiredDistance = Math.max((wipeSlot?.size.w ?? 180) + (wipeSlot?.size.h ?? 120), 180);
        const wipeThreshold = 100;
        const wipeSpeed = 1;
        const wipeHandler = itemNode.getComponent(WipeHandler) ?? itemNode.addComponent(WipeHandler);
        wipeHandler.wipeTarget = itemNode;
        wipeHandler.wipeThreshold = wipeThreshold;
        wipeHandler.wipeSpeed = wipeSpeed;
        wipeHandler.setWipeMetadata({
            levelId: this.currentLevelId,
            itemId: levelItem.id,
            slotId: wipeSlot?.id,
            targetLabel: wipeSlot?.label,
            requiredDistance,
            wipeThreshold,
            wipeSpeed,
        });

        let stainNode = itemNode.getChildByName('StainOverlay');
        if (!stainNode) {
            stainNode = new Node('StainOverlay');
            stainNode.setParent(itemNode);
            stainNode.setPosition(0, 0, 0);
            stainNode.addComponent(UITransform);
            stainNode.addComponent(Sprite);
        }

        const stainTransform = stainNode.getComponent(UITransform);
        if (stainTransform && wipeSlot) {
            stainTransform.setContentSize({ width: wipeSlot.size.w, height: wipeSlot.size.h });
        }

        const stainSprite = stainNode.getComponent(Sprite)!;
        stainSprite.color = new Color(120, 80, 40, 230);
        if (!stainNode.getComponent(UIOpacity)) {
            stainNode.addComponent(UIOpacity);
        }

        wipeHandler.stainSprite = stainSprite;
        wipeHandler.reset();
    }

    private isWipeSlot(slotId: string): boolean {
        for (const slot of this.wipeSlotMap.values()) {
            if (slot.id === slotId) {
                return true;
            }
        }
        return false;
    }

    private handleItemPlaced(data: { itemId: string; slotId: string }): void {
        this.levelManager.markItemPlaced(data.itemId);
        this.updateProgressDisplay();

        if (this.levelManager.isLevelComplete()) {
            this.onLevelComplete(3);
        }
    }

    private handleItemRemoved(data: { itemId: string; slotId: string }): void {
        this.levelManager.removeItem(data.itemId);
        this.completedWipeItems.delete(data.itemId);
        this.updateProgressDisplay();
    }

    private handleWipeProgress(data?: WipeProgressPayload): void {
        if (!data || data.levelId !== this.currentLevelId || !this.progressLabel) {
            return;
        }

        const total = this.levelManager.getCurrentLevel()?.requiredItems || 0;
        const completed = this.levelManager.getPlacedCount();
        this.progressLabel.string = `擦洗 ${Math.round(data.progress)}% · 完成 ${completed}/${total}`;
    }

    private handleItemWiped(data?: WipeCompletePayload): void {
        if (!data || data.levelId !== this.currentLevelId || !data.itemId) {
            return;
        }

        this.completedWipeItems.add(data.itemId);
        this.levelManager.markItemPlaced(data.itemId);
        this.updateProgressDisplay(true, data.itemId);

        if (this.levelManager.isLevelComplete()) {
            this.onLevelComplete(3);
        }
    }

    private updateProgressDisplay(isWipeComplete = false, wipeItemId?: string): void {
        if (!this.progressLabel) {
            return;
        }

        const placed = this.levelManager.getPlacedCount();
        const total = this.levelManager.getCurrentLevel()?.requiredItems || 0;

        if (isWipeComplete && wipeItemId) {
            this.progressLabel.string = `擦洗完成：${wipeItemId} · ${placed}/${total}`;
            return;
        }

        if (this.wipeItemMap.size > 0 && placed < total) {
            this.progressLabel.string = `教学目标 ${placed}/${total} · 擦洗 ${this.completedWipeItems.size}/${this.wipeItemMap.size}`;
            return;
        }

        this.progressLabel.string = `${placed}/${total}`;
    }

    onItemPlaced(itemId: string): void {
        this.levelManager.markItemPlaced(itemId);
        this.updateProgressDisplay();

        if (this.levelManager.isLevelComplete()) {
            this.onLevelComplete(3);
        }
    }

    onLevelComplete(stars: number): void {
        if (this.levelCompleted) {
            return;
        }
        this.levelCompleted = true;

        if (this.timerController) {
            this.timerController.pauseTimer();
        }

        this.audioManager.playClick();
        this.eventManager.emit(GAME_EVENTS.LEVEL_COMPLETE, {
            levelId: this.levelManager.getCurrentLevel()?.id,
            stars,
            sourceLevelId: this.currentLevelId,
            sceneDisplayName: this.currentLevelConfig?.sceneDisplayName,
        });

        if (this.progressLabel) {
            this.progressLabel.string = `关卡完成 · ${stars}星`;
        }

        console.log(`[GameScene] 关卡完成！获得 ${stars} 星评价`);
    }

    onTimeOut(): void {
        this.eventManager.emit(GAME_EVENTS.LEVEL_FAILED, {
            levelId: this.levelManager.getCurrentLevel()?.id,
        });
    }

    onDestroy(): void {
        this.unregisterEvents();
    }
}
