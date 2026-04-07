import { _decorator, Component, Node, instantiate, Sprite, UITransform, Vec3, v3, Label, Color } from 'cc';
import { LevelManager, LevelDefinition, ItemConfig, SlotConfig } from '../gameplay/LevelManager';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS, GAME_CONFIG } from '../../data/Constants';
import { ItemController } from '../gameplay/ItemController';
import { DragHandler } from '../gameplay/DragHandler';
import { SlotController } from '../gameplay/SlotController';
import { TimerController } from '../gameplay/TimerController';
import { AudioManager } from '../audio/AudioManager';
import { ParticleEffects } from '../effects/ParticleEffects';

const { ccclass, property } = _decorator;

/**
 * 游戏关卡场景
 * 负责核心玩法的逻辑控制
 */
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

    onLoad() {
        this.registerEvents();
        this.loadTutorialLevel();
    }

    start() {
        this.audioManager.playClick();
    }

    private registerEvents(): void {
        this.eventManager.on(GAME_EVENTS.ITEM_PLACED, this.handleItemPlaced as any);
        this.eventManager.on(GAME_EVENTS.ITEM_REMOVED, this.handleItemRemoved as any);
    }

    private unregisterEvents(): void {
        this.eventManager.off(GAME_EVENTS.ITEM_PLACED, this.handleItemPlaced as any);
        this.eventManager.off(GAME_EVENTS.ITEM_REMOVED, this.handleItemRemoved as any);
    }

    /**
     * 加载教学关卡
     */
    private loadTutorialLevel(): void {
        const tutorialLevel: LevelDefinition = {
            id: 'tutorial_001',
            name: '教学关',
            items: [
                { id: 'item_001', type: 'apple', position: { x: -200, y: -150 } },
                { id: 'item_002', type: 'book', position: { x: 0, y: -150 } },
                { id: 'item_003', type: 'cup', position: { x: 200, y: -150 } }
            ],
            slots: [
                { id: 'slot_001', allowedItemTypes: ['apple'], position: { x: -200, y: 100 } },
                { id: 'slot_002', allowedItemTypes: ['book'], position: { x: 0, y: 100 } },
                { id: 'slot_003', allowedItemTypes: ['cup'], position: { x: 200, y: 100 } }
            ],
            requiredItems: 3,
            timeLimit: 60
        };

        this.levelManager.loadLevel(tutorialLevel);
        this.instantiateLevelObjects(tutorialLevel);
        this.updateProgressDisplay();

        // 启动计时器
        const timeLimit = tutorialLevel.timeLimit || 60; // 默认60秒
        if (this.timerController) {
            // 如果有独立的 TimerController 组件，使用它
            this.timerController.startTimer(timeLimit);
        } else if (this.timeLabel) {
            // 尝试从子节点获取 TimerController
            const timerNode = this.node.getChildByName('Timer');
            if (timerNode) {
                const timer = timerNode.getComponent(TimerController);
                if (timer) {
                    timer.startTimer(timeLimit);
                }
            }
        }

        this.eventManager.emit(GAME_EVENTS.LEVEL_LOADED, tutorialLevel);
    }

    /**
     * 实例化关卡中的物品和槽位
     */
    private instantiateLevelObjects(level: LevelDefinition): void {
        // 实例化槽位
        level.slots.forEach(slotConfig => {
            this.createSlot(slotConfig);
        });

        // 实例化物品
        level.items.forEach(itemConfig => {
            this.createItem(itemConfig);
        });
    }

    /**
     * 创建槽位
     */
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
            transform.setContentSize({ width: 100, height: 100 });
        }

        const sprite = slotNode.getComponent(Sprite);
        if (sprite) {
            sprite.color = new Color(180, 180, 180, 255);
        }
    }

    /**
     * 创建物品
     */
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

        const dragHandler = itemNode.getComponent(DragHandler);
        if (!dragHandler) {
            itemNode.addComponent(DragHandler);
        }

        const transform = itemNode.getComponent(UITransform);
        if (transform) {
            transform.setContentSize({ width: 80, height: 80 });
        }

        const sprite = itemNode.getComponent(Sprite);
        if (sprite) {
            sprite.color = new Color(100, 200, 100, 255);
        }
    }

    /**
     * 处理物品归位成功事件
     */
    private handleItemPlaced(data: { itemId: string; slotId: string }): void {
        this.levelManager.markItemPlaced(data.itemId);
        this.updateProgressDisplay();

        if (this.levelManager.isLevelComplete()) {
            this.onLevelComplete(3);
        }
    }

    /**
     * 处理物品从槽位移除事件（玩家重新拖拽已放置物品）
     */
    private handleItemRemoved(data: { itemId: string; slotId: string }): void {
        // 物品被移除时，需要从已放置列表中移除
        this.levelManager.removeItem(data.itemId);
        this.updateProgressDisplay();
    }

    /**
     * 更新进度显示
     */
    private updateProgressDisplay(): void {
        if (!this.progressLabel) {
            return;
        }

        const placed = this.levelManager.getPlacedCount();
        const total = this.levelManager.getCurrentLevel()?.requiredItems || 0;
        this.progressLabel.string = `${placed}/${total}`;
    }

    /**
     * 物品归位成功
     */
    onItemPlaced(itemId: string): void {
        this.levelManager.markItemPlaced(itemId);
        this.updateProgressDisplay();

        if (this.levelManager.isLevelComplete()) {
            this.onLevelComplete(3);
        }
    }

    /**
     * 关卡完成
     */
    onLevelComplete(stars: number): void {
        // 停止计时器
        if (this.timerController) {
            this.timerController.pauseTimer();
        }
        
        this.audioManager.playClick();
        this.eventManager.emit(GAME_EVENTS.LEVEL_COMPLETE, {
            levelId: this.levelManager.getCurrentLevel()?.id,
            stars
        });

        console.log(`[GameScene] 关卡完成！获得 ${stars} 星评价`);
    }

    /**
     * 时间耗尽
     */
    onTimeOut(): void {
        this.eventManager.emit(GAME_EVENTS.LEVEL_FAILED, {
            levelId: this.levelManager.getCurrentLevel()?.id
        });
    }

    onDestroy(): void {
        this.unregisterEvents();
    }
}
