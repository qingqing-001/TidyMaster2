import { _decorator, Component, Node, instantiate, Sprite, UITransform, Label, Color, UIOpacity } from 'cc';
import { LevelManager, LevelDefinition, ItemConfig, SlotConfig } from '../gameplay/LevelManager';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';
import { ItemController, ItemState } from '../gameplay/ItemController';
import { DragHandler } from '../gameplay/DragHandler';
import { SlotController } from '../gameplay/SlotController';
import { TimerController } from '../gameplay/TimerController';
import { AudioManager } from '../audio/AudioManager';
import { getLevelConfig } from '../data/levels';
import { LevelDataConfig, LevelItemConfig, LevelSlotConfig } from '../data/types';
import { OperationType } from '../data/LevelData';
import { WipeHandler } from '../gameplay/WipeHandler';
import { FoldHandler } from '../gameplay/FoldHandler';
import { MergeLogic } from '../merge/MergeLogic';
import { AlbumManager } from '../collection/AlbumManager';
import { AchievementManager } from '../collection/AchievementManager';
import { AchievementType } from '../../data/AchievementData';
import { DataManager } from '../core/DataManager';

const { ccclass, property } = _decorator;

interface OperationProgressPayload {
    levelId?: number;
    itemId?: string;
    slotId?: string;
    operation?: OperationType;
    progress: number;
    completed: boolean;
}

interface OperationCompletePayload {
    levelId?: number;
    itemId?: string;
    slotId?: string;
    operation?: OperationType;
    progress?: number;
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
    private mergeLogic = MergeLogic.instance;
    private currentLevelId = 4;
    private currentLevelConfig: LevelDataConfig | null = null;
    private operationItemMap = new Map<string, LevelItemConfig>();
    private operationSlotMap = new Map<string, LevelSlotConfig>();
    private completedOperationItems = new Set<string>();
    private activeOperationProgress = new Map<string, number>();
    private levelCompleted = false;
    // 装备的工具等级（用于增益效果）
    private equippedToolLevel: number = 1;

    onLoad() {
        this.registerEvents();
        const progress = DataManager.getInstance().getProgress();
        const savedLevelId = parseInt(progress.currentLevelId.replace('level-', ''), 10);
        this.currentLevelId = Number.isFinite(savedLevelId) && savedLevelId > 0 ? savedLevelId : this.currentLevelId;
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
        this.setupOperationTargets(levelConfig);
        this.completedOperationItems.clear();
        this.activeOperationProgress.clear();
        this.clearLevelNodes();

        const levelDefinition = this.levelManager.loadFromConfig(levelConfig);
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
        this.eventManager.on(GAME_EVENTS.OPERATION_PROGRESS, this.handleOperationProgress as any);
        this.eventManager.on(GAME_EVENTS.OPERATION_COMPLETE, this.handleOperationComplete as any);
        this.eventManager.on(GAME_EVENTS.TOOL_UPGRADED, this.handleToolUpgraded as any);
    }

    private unregisterEvents(): void {
        this.eventManager.off(GAME_EVENTS.ITEM_PLACED, this.handleItemPlaced as any);
        this.eventManager.off(GAME_EVENTS.ITEM_REMOVED, this.handleItemRemoved as any);
        this.eventManager.off(GAME_EVENTS.OPERATION_PROGRESS, this.handleOperationProgress as any);
        this.eventManager.off(GAME_EVENTS.OPERATION_COMPLETE, this.handleOperationComplete as any);
        this.eventManager.off(GAME_EVENTS.TOOL_UPGRADED, this.handleToolUpgraded as any);
    }

    /**
     * 处理工具升级事件
     */
    private handleToolUpgraded(data: { level: number, name?: string, fromLevel?: number }): void {
        console.log(`[GameScene] 工具升级到 ${data.level} 级`);
        this.equippedToolLevel = data.level;
        
        // 应用工具增益效果
        this.applyToolBonus();
    }

    /**
     * 应用工具增益效果
     */
    private applyToolBonus(): void {
        const bonus = this.mergeLogic.getToolBonus(this.equippedToolLevel);
        console.log(`[GameScene] 应用工具增益:`, bonus);

        // 时间加成 - 延长计时器
        if (bonus.timeBonus > 0 && this.timerController) {
            this.timerController.addTime(bonus.timeBonus);
            console.log(`[GameScene] 时间加成 +${bonus.timeBonus}秒`);
        } else if (bonus.timeBonus > 0 && this.timeLabel) {
            // 如果没有timerController，直接更新显示（简化实现）
            console.log(`[GameScene] 时间加成 +${bonus.timeBonus}秒 (无timerController)`);
        }

        // 可以添加更多增益效果，如自动整理、显示提示等
        // 这里可以触发相应的事件或调用对应的功能
    }

    private setupOperationTargets(levelConfig: LevelDataConfig): void {
        this.operationItemMap.clear();
        this.operationSlotMap.clear();

        levelConfig.items.forEach((item) => {
            this.operationItemMap.set(item.id, item);
            const slot = levelConfig.slots.find((candidate) => candidate.id === item.targetSlotId);
            if (slot) {
                this.operationSlotMap.set(item.id, slot);
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
            slotController.setAllowedItemTypes(config.allowedItemTypes);
        }

        const transform = slotNode.getComponent(UITransform);
        if (transform) {
            const slotData = this.levelManager.getSlotConfig(config.id);
            transform.setContentSize({
                width: slotData?.size.w ?? 100,
                height: slotData?.size.h ?? 100,
            });
        }

        const sprite = slotNode.getComponent(Sprite);
        if (sprite) {
            const hasOperationTarget = Array.from(this.operationSlotMap.values()).some((slot) => slot.id === config.id);
            sprite.color = new Color(180, 180, 180, hasOperationTarget ? 150 : 255);
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

        const itemController = itemNode.getComponent(ItemController) ?? itemNode.addComponent(ItemController);
        itemController.setup(config.id, config.type);
        itemController.setOperation(config.operation, config.targetSlotId);
        itemController.setState(ItemState.IDLE);

        this.setupItemInteraction(itemNode, config.operation);

        const transform = itemNode.getComponent(UITransform);
        if (transform) {
            const targetSlot = this.levelManager.getSlotConfig(config.targetSlotId);
            transform.setContentSize({
                width: targetSlot?.size.w ?? 80,
                height: targetSlot?.size.h ?? 80,
            });
        }

        const sprite = itemNode.getComponent(Sprite);
        if (sprite) {
            sprite.color = this.getItemColorByOperation(config.operation);
        }
    }

    private setupItemInteraction(itemNode: Node, operation: OperationType): void {
        const dragHandler = itemNode.getComponent(DragHandler);
        const wipeHandler = itemNode.getComponent(WipeHandler);
        const foldHandler = itemNode.getComponent(FoldHandler);

        dragHandler && (dragHandler.enabled = false);
        wipeHandler && (wipeHandler.enabled = false);
        foldHandler && (foldHandler.enabled = false);

        switch (operation) {
            case OperationType.WIPE:
                this.setupWipeItem(itemNode);
                break;
            case OperationType.FOLD:
                this.setupFoldItem(itemNode);
                break;
            case OperationType.ROTATE:
                this.setupRotateItem(itemNode);
                break;
            case OperationType.DRAG:
            default:
                (dragHandler ?? itemNode.addComponent(DragHandler)).enabled = true;
                break;
        }
    }

    private setupWipeItem(itemNode: Node): void {
        const itemController = itemNode.getComponent(ItemController);
        const itemId = itemController?.itemId ?? '';
        const wipeSlot = this.operationSlotMap.get(itemId);
        const requiredDistance = Math.max((wipeSlot?.size.w ?? 180) + (wipeSlot?.size.h ?? 120), 180);
        const wipeHandler = itemNode.getComponent(WipeHandler) ?? itemNode.addComponent(WipeHandler);
        wipeHandler.enabled = true;
        wipeHandler.wipeTarget = itemNode;
        wipeHandler.wipeThreshold = 100;
        wipeHandler.wipeSpeed = 1;
        wipeHandler.setWipeMetadata({
            levelId: this.currentLevelId,
            itemId,
            slotId: wipeSlot?.id,
            operation: OperationType.WIPE,
            targetLabel: wipeSlot?.label,
            requiredDistance,
            wipeThreshold: 100,
            wipeSpeed: 1,
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

    private setupFoldItem(itemNode: Node): void {
        const itemController = itemNode.getComponent(ItemController);
        const itemId = itemController?.itemId ?? '';
        const slot = this.operationSlotMap.get(itemId);
        const foldHandler = itemNode.getComponent(FoldHandler) ?? itemNode.addComponent(FoldHandler);
        foldHandler.enabled = true;
        foldHandler.foldItem = itemNode;
        foldHandler.totalFoldSteps = this.resolveFoldStepCount(slot);
        foldHandler.setFoldMetadata({
            levelId: this.currentLevelId,
            itemId,
            slotId: slot?.id,
            operation: OperationType.FOLD,
            targetLabel: slot?.label,
        });
        foldHandler.reset();
    }

    private resolveFoldStepCount(slot?: LevelSlotConfig): number {
        const maxSize = Math.max(slot?.size.w ?? 90, slot?.size.h ?? 90);
        if (maxSize >= 110) {
            return 4;
        }
        return 3;
    }

    private setupRotateItem(itemNode: Node): void {
        const itemController = itemNode.getComponent(ItemController);
        const itemId = itemController?.itemId ?? '';
        const slot = this.operationSlotMap.get(itemId);
        const requiredSteps = this.resolveRotateStepCount(slot);
        const rotationDegrees = requiredSteps * 90;
        itemController?.setRotationState(requiredSteps, rotationDegrees);
        itemController?.setState(ItemState.PLACED);
        this.levelManager.markItemPlaced(itemId);
        this.completedOperationItems.add(itemId);

        itemNode.on(Node.EventType.TOUCH_END, () => {
            const currentStep = itemController?.getRotationStep() ?? 0;
            if (currentStep <= 0) {
                return;
            }
            const nextStep = currentStep - 1;
            const nextDegrees = nextStep * 90;
            itemController?.setRotationState(nextStep, nextDegrees);
            this.activeOperationProgress.set(itemId, Math.round(((requiredSteps - nextStep) / Math.max(requiredSteps, 1)) * 100));
            this.eventManager.emit(nextStep === 0 ? GAME_EVENTS.OPERATION_COMPLETE : GAME_EVENTS.OPERATION_PROGRESS, {
                levelId: this.currentLevelId,
                itemId,
                slotId: slot?.id,
                operation: OperationType.ROTATE,
                progress: Math.round(((requiredSteps - nextStep) / Math.max(requiredSteps, 1)) * 100),
                completed: nextStep === 0,
            });
        }, this);
    }

    private resolveRotateStepCount(slot?: LevelSlotConfig): number {
        const width = slot?.size.w ?? 100;
        const height = slot?.size.h ?? 100;
        if (width >= 120 && height >= 120) {
            return 3;
        }
        if (width >= 100 || height >= 100) {
            return 2;
        }
        return 1;
    }

    private getItemColorByOperation(operation: OperationType): Color {
        switch (operation) {
            case OperationType.WIPE:
                return new Color(210, 170, 110, 255);
            case OperationType.FOLD:
                return new Color(140, 190, 255, 255);
            case OperationType.ROTATE:
                return new Color(255, 175, 120, 255);
            case OperationType.DRAG:
            default:
                return new Color(100, 200, 100, 255);
        }
    }

    private handleItemPlaced(data: { itemId: string; slotId: string }): void {
        this.levelManager.markItemPlaced(data.itemId);
        this.completedOperationItems.add(data.itemId);
        this.activeOperationProgress.delete(data.itemId);
        this.updateProgressDisplay();

        // 收集物品到图鉴
        this.collectItemOnPlace(data.itemId);

        if (this.levelManager.isLevelComplete()) {
            this.onLevelComplete(3);
        }
    }

    /**
     * 物品放置时收集到图鉴
     */
    private collectItemOnPlace(itemId: string): void {
        try {
            const albumManager = AlbumManager.instance;
            // 将物品ID添加到图鉴
            albumManager.collectItem(itemId);

            // 触发整理物品成就
            const achievementManager = AchievementManager.instance;
            // 获取当前已整理的物品总数
            const placedCount = this.levelManager.getPlacedCount();
            achievementManager.triggerAchievementCheck(AchievementType.TOTAL_ITEMS, placedCount);

            console.log(`[GameScene] 物品已收集到图鉴: ${itemId}`);
        } catch (e) {
            console.error('[GameScene] 收集物品到图鉴失败:', e);
        }
    }

    private handleItemRemoved(data: { itemId: string; slotId: string }): void {
        this.levelManager.removeItem(data.itemId);
        this.completedOperationItems.delete(data.itemId);
        this.activeOperationProgress.delete(data.itemId);
        this.updateProgressDisplay();
    }

    private handleOperationProgress(data?: OperationProgressPayload): void {
        if (!data || data.levelId !== this.currentLevelId || !data.itemId) {
            return;
        }

        this.activeOperationProgress.set(data.itemId, data.progress);
        if (data.completed) {
            this.completedOperationItems.add(data.itemId);
        }
        this.updateProgressDisplay();
    }

    private handleOperationComplete(data?: OperationCompletePayload): void {
        if (!data || data.levelId !== this.currentLevelId || !data.itemId) {
            return;
        }

        this.completedOperationItems.add(data.itemId);
        this.activeOperationProgress.delete(data.itemId);
        this.levelManager.markItemPlaced(data.itemId);
        this.updateProgressDisplay();

        if (this.levelManager.isLevelComplete()) {
            this.onLevelComplete(3);
        }
    }

    private updateProgressDisplay(): void {
        if (!this.progressLabel) {
            return;
        }

        const placed = this.levelManager.getPlacedCount();
        const total = this.levelManager.getCurrentLevel()?.requiredItems || 0;
        const activeText = this.buildActiveOperationText();

        this.progressLabel.string = activeText
            ? `教学目标 ${placed}/${total} · ${activeText}`
            : `${placed}/${total}`;
    }

    private buildActiveOperationText(): string {
        const entries: string[] = [];
        this.activeOperationProgress.forEach((progress, itemId) => {
            if (this.completedOperationItems.has(itemId)) {
                return;
            }
            const itemConfig = this.levelManager.getItemConfig(itemId);
            if (!itemConfig) {
                return;
            }
            const label = itemConfig.operation === OperationType.WIPE ? '擦洗' : itemConfig.operation === OperationType.FOLD ? '折叠' : itemConfig.operation === OperationType.ROTATE ? '旋转' : '操作';
            entries.push(`${label}${Math.round(progress)}%`);
        });
        return entries.join(' · ');
    }

    onItemPlaced(itemId: string): void {
        this.levelManager.markItemPlaced(itemId);
        this.completedOperationItems.add(itemId);
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

        const rewardCoins = this.currentLevelConfig?.rewards.baseCoin ?? 0;
        if (rewardCoins > 0) {
            DataManager.getInstance().addCoins(rewardCoins);
        }

        const nextLevelId = this.resolveNextLevelId();
        if (nextLevelId) {
            DataManager.getInstance().setCurrentLevel(`level-${nextLevelId.toString().padStart(3, '0')}`);
        }

        this.audioManager.playClick();
        this.eventManager.emit(GAME_EVENTS.LEVEL_COMPLETE, {
            levelId: this.currentLevelId,
            stars,
            sceneDisplayName: this.currentLevelConfig?.sceneDisplayName,
            rewardCoins,
            nextLevelId,
        });

        this.eventManager.emit(GAME_EVENTS.CHANGE_SCENE, {
            sceneName: 'Result',
        });

        if (this.progressLabel) {
            this.progressLabel.string = `关卡完成 · ${stars}星`;
        }

        console.log(`[GameScene] 关卡完成！获得 ${stars} 星评价`);
    }

    private resolveNextLevelId(): number | undefined {
        const nextLevelId = this.currentLevelId + 1;
        return getLevelConfig(nextLevelId) ? nextLevelId : undefined;
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
