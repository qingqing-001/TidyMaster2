/**
 * 新手引导系统
 * 为前3关提供可视化引导（箭头提示、高亮、操作提示等）
 */

import { _decorator, Component, Node, Sprite, Label, UITransform, Vec3, v3, Color } from 'cc';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';
import { getLevelConfig } from '../data/levels';
import { OperationType } from '../data/LevelData';
import type { LevelCompletePayload } from '../core/eventPayloads';

const { ccclass, property } = _decorator;

export enum TutorialStep {
    NONE = 0,
    DRAG_ITEM = 1,        // 拖拽物品提示
    TARGET_SLOT = 2,      // 目标槽位提示
    OPERATION_TYPE = 3,   // 操作类型提示
    COMPLETE = 4          // 引导完成
}

@ccclass('TutorialGuide')
export class TutorialGuide extends Component {
    @property({ type: Node, tooltip: '箭头指示节点' })
    private arrowNode: Node | null = null;

    @property({ type: Node, tooltip: '提示文字节点' })
    private tipLabelNode: Node | null = null;

    @property({ type: Node, tooltip: '高亮框节点' })
    private highlightNode: Node | null = null;

    @property({ type: Node, tooltip: '引导遮罩' })
    private maskNode: Node | null = null;

    private eventManager = EventManager.getInstance();
    private currentStep: TutorialStep = TutorialStep.NONE;
    private currentLevelId: number = 0;
    private isTutorialEnabled: boolean = true;
    private tutorialCompletedLevels: Set<number> = new Set();
    private animationTime: number = 0;

    onLoad() {
        this.registerEvents();
    }

    start() {
        // 初始隐藏引导元素
        this.hideAllTutorialElements();
    }

    update(deltaTime: number) {
        // 简单的箭头浮动动画
        if (this.arrowNode && this.arrowNode.active) {
            this.animationTime += deltaTime;
            const offsetY = Math.sin(this.animationTime * 2) * 10;
            const basePos = this.arrowNode.position;
            this.arrowNode.setPosition(basePos.x, basePos.y + offsetY * 0.05, basePos.z);
        }
    }

    private registerEvents(): void {
        this.eventManager.on(GAME_EVENTS.LEVEL_START, this.onLevelLoaded as any);
        this.eventManager.on(GAME_EVENTS.LEVEL_COMPLETE, this.onLevelComplete as any);
    }

    private unregisterEvents(): void {
        this.eventManager.off(GAME_EVENTS.LEVEL_START, this.onLevelLoaded as any);
        this.eventManager.off(GAME_EVENTS.LEVEL_COMPLETE, this.onLevelComplete as any);
    }

    /**
     * 关卡加载时触发
     */
    private onLevelLoaded(levelData: { id: string; name?: string }): void {
        // 从level id中提取关卡数字
        const levelIdMatch = levelData.id.match(/(\d+)/);
        if (levelIdMatch) {
            this.currentLevelId = parseInt(levelIdMatch[1], 10);
            
            // 如果是前3关且未完成过引导，显示引导
            if (this.currentLevelId <= 3 && this.isTutorialEnabled && !this.tutorialCompletedLevels.has(this.currentLevelId)) {
                this.startTutorial();
            }
        } else if (levelData.name) {
            // 尝试从name中提取
            console.log(`[TutorialGuide] 关卡名称: ${levelData.name}`);
        }
    }

    /**
     * 关卡完成时触发
     */
    private onLevelComplete(data: LevelCompletePayload): void {
        // 标记该关卡的引导已完成
        if (this.currentLevelId <= 3) {
            this.tutorialCompletedLevels.add(this.currentLevelId);
        }
        this.hideAllTutorialElements();
    }

    /**
     * 启动新手引导
     */
    public startTutorial(): void {
        const levelConfig = getLevelConfig(this.currentLevelId);
        
        if (!levelConfig) {
            console.log(`[TutorialGuide] 关卡 ${this.currentLevelId} 无配置，跳过引导`);
            return;
        }

        console.log(`[TutorialGuide] 启动关卡 ${this.currentLevelId} 的新手引导`);

        // 根据关卡显示不同引导
        switch (this.currentLevelId) {
            case 1:
                this.showDragTutorial(levelConfig);
                break;
            case 2:
                this.showSlotTutorial(levelConfig);
                break;
            case 3:
                this.showOperationTutorial(levelConfig);
                break;
            default:
                console.log(`[TutorialGuide] 关卡 ${this.currentLevelId} 无需引导`);
        }
    }

    /**
     * 第1关：拖拽物品提示
     */
    private showDragTutorial(levelConfig: any): void {
        // 显示提示文字
        this.showTip('拖拽物品到正确位置');
        
        // 在第一个物品位置显示箭头
        if (levelConfig.items && levelConfig.items.length > 0) {
            const firstItem = levelConfig.items[0];
            this.showArrowAt(firstItem.initialPos.x, firstItem.initialPos.y);
        }

        this.currentStep = TutorialStep.DRAG_ITEM;
    }

    /**
     * 第2关：目标槽位提示
     */
    private showSlotTutorial(levelConfig: any): void {
        this.showTip('将物品放入对应槽位');

        // 在第一个槽位显示高亮
        if (levelConfig.slots && levelConfig.slots.length > 0) {
            const firstSlot = levelConfig.slots[0];
            this.showHighlightAt(firstSlot.pos.x, firstSlot.pos.y, firstSlot.size.w, firstSlot.size.h);
        }

        this.currentStep = TutorialStep.TARGET_SLOT;
    }

    /**
     * 第3关：操作类型提示
     */
    private showOperationTutorial(levelConfig: any): void {
        // 获取关卡支持的操作类型
        const operations = levelConfig.operations || [];
        
        if (operations.includes(OperationType.DRAG) && operations.includes(OperationType.WIPE)) {
            this.showTip('本关有两种操作：拖拽 和 擦洗');
        } else if (operations.includes(OperationType.DRAG)) {
            this.showTip('使用拖拽操作整理物品');
        } else if (operations.includes(OperationType.WIPE)) {
            this.showTip('使用擦洗操作清洁物品');
        } else if (operations.includes(OperationType.FOLD)) {
            this.showTip('使用折叠操作整理衣物');
        }

        this.currentStep = TutorialStep.OPERATION_TYPE;
    }

    /**
     * 在指定位置显示箭头
     */
    private showArrowAt(x: number, y: number): void {
        if (!this.arrowNode) {
            console.warn('[TutorialGuide] 箭头节点未设置');
            return;
        }

        this.arrowNode.active = true;
        this.arrowNode.setPosition(x, y + 80, 0);
        this.animationTime = 0;
    }

    /**
     * 在指定位置显示高亮框
     */
    private showHighlightAt(x: number, y: number, width: number, height: number): void {
        if (!this.highlightNode) {
            console.warn('[TutorialGuide] 高亮节点未设置');
            return;
        }

        this.highlightNode.active = true;
        this.highlightNode.setPosition(x, y, 0);

        const transform = this.highlightNode.getComponent(UITransform);
        if (transform) {
            transform.setContentSize({ width: width + 20, height: height + 20 });
        }
    }

    /**
     * 显示提示文字
     */
    private showTip(text: string): void {
        if (!this.tipLabelNode) {
            console.warn('[TutorialGuide] 提示文字节点未设置');
            return;
        }

        this.tipLabelNode.active = true;
        
        const label = this.tipLabelNode.getComponent(Label);
        if (label) {
            label.string = text;
        }

        // 简单的缩放动画效果
        this.tipLabelNode.setScale(0.8, 0.8, 1);
    }

    /**
     * 隐藏所有引导元素
     */
    private hideAllTutorialElements(): void {
        if (this.arrowNode) {
            this.arrowNode.active = false;
        }
        
        if (this.tipLabelNode) {
            this.tipLabelNode.active = false;
        }
        
        if (this.highlightNode) {
            this.highlightNode.active = false;
        }

        if (this.maskNode) {
            this.maskNode.active = false;
        }

        this.currentStep = TutorialStep.NONE;
    }

    /**
     * 跳过当前引导
     */
    public skipTutorial(): void {
        this.hideAllTutorialElements();
        this.tutorialCompletedLevels.add(this.currentLevelId);
    }

    /**
     * 设置引导是否启用
     */
    public setTutorialEnabled(enabled: boolean): void {
        this.isTutorialEnabled = enabled;
    }

    /**
     * 获取当前引导步骤
     */
    public getCurrentStep(): TutorialStep {
        return this.currentStep;
    }

    /**
     * 是否已引导完成
     */
    public isLevelTutored(levelId: number): boolean {
        return this.tutorialCompletedLevels.has(levelId);
    }

    onDestroy(): void {
        this.unregisterEvents();
    }
}