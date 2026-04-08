import { _decorator, Component, Node, Label, Sprite } from 'cc';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';
import { AlbumManager } from '../collection/AlbumManager';
import { AchievementManager } from '../collection/AchievementManager';
import { SeasonPass } from '../collection/SeasonPass';
import { AchievementType } from '../../data/AchievementData';
import { DataManager } from '../core/DataManager';
import { getLevelConfig } from '../data/levels';
import type { LevelCompletePayload, LevelFailedPayload } from '../core/eventPayloads';

const { ccclass, property } = _decorator;

function assertLevelCompletePayload(payload: LevelCompletePayload): void {
    if (typeof payload.levelId !== 'number') {
        throw new Error('LEVEL_COMPLETE.levelId 必须为 number');
    }
    if (typeof payload.stars !== 'number') {
        throw new Error('LEVEL_COMPLETE.stars 必须为 number');
    }
    if (typeof payload.rewardCoins !== 'number') {
        throw new Error('LEVEL_COMPLETE.rewardCoins 必须为 number');
    }
    if (payload.nextLevelId !== undefined && typeof payload.nextLevelId !== 'number') {
        throw new Error('LEVEL_COMPLETE.nextLevelId 必须为 number | undefined');
    }
}

/**
 * 结算场景
 * 显示关卡完成评分、奖励、前后对比等
 * 监听 LEVEL_COMPLETE 和 LEVEL_FAILED 事件
 */
@ccclass('ResultScene')
export class ResultScene extends Component {
    @property({ type: Label, tooltip: '结果标题标签' })
    titleLabel: Label | null = null;

    @property({ type: Label, tooltip: '星级评价标签' })
    starsLabel: Label | null = null;

    @property({ type: Node, tooltip: '成功面板' })
    successPanel: Node | null = null;

    @property({ type: Node, tooltip: '失败面板' })
    failPanel: Node | null = null;

    @property({ type: Label, tooltip: '描述文本' })
    descLabel: Label | null = null;

    private _eventManager: EventManager | null = null;
    private _lastStars: number = 0;
    private _lastLevelId: number | undefined;
    private _lastRewardCoins: number = 0;
    private _nextLevelId: number | undefined;
    private _boundLevelComplete = (payload?: LevelCompletePayload) => this.onLevelComplete(payload);
    private _boundLevelFailed = (payload?: LevelFailedPayload) => this.onLevelFailed(payload);

    onLoad(): void {
        this._eventManager = EventManager.getInstance();
        
        // 隐藏成功/失败面板
        if (this.successPanel) {
            this.successPanel.active = false;
        }
        if (this.failPanel) {
            this.failPanel.active = false;
        }
    }

    start(): void {
        this.registerEvents();
    }

    /**
     * 注册事件监听
     */
    private registerEvents(): void {
        if (!this._eventManager) {
            return;
        }

        // 监听关卡完成事件
        this._eventManager.on<LevelCompletePayload>(
            GAME_EVENTS.LEVEL_COMPLETE, 
            this._boundLevelComplete
        );

        // 监听关卡失败事件
        this._eventManager.on<LevelFailedPayload>(
            GAME_EVENTS.LEVEL_FAILED, 
            this._boundLevelFailed
        );

        console.log('[ResultScene] 已注册 LEVEL_COMPLETE 和 LEVEL_FAILED 事件监听');
    }

    /**
     * 注销事件监听
     */
    private unregisterEvents(): void {
        if (!this._eventManager) {
            return;
        }

        this._eventManager.off(GAME_EVENTS.LEVEL_COMPLETE, this._boundLevelComplete);
        this._eventManager.off(GAME_EVENTS.LEVEL_FAILED, this._boundLevelFailed);
    }

    /**
     * 处理关卡完成事件
     */
    private onLevelComplete(data?: LevelCompletePayload): void {
        if (!data) {
            return;
        }

        assertLevelCompletePayload(data);
        this._lastStars = data.stars;
        this._lastLevelId = data.levelId;
        this._lastRewardCoins = data.rewardCoins;
        this._nextLevelId = data.nextLevelId;

        console.log(`[ResultScene] 收到 LEVEL_COMPLETE 事件，levelId: ${data.levelId}, stars: ${data.stars}`);

        // 显示成功面板
        this.showSuccess(data.stars, data.levelId, data.sceneDisplayName);

        // 播放成功音效（如果有AudioManager）
        this.playSuccessSound();

        // 集成收集和养成系统
        this.integrateCollectionAndProgression(data);
    }

    /**
     * 集成收集和养成系统
     * 在关卡完成后调用图鉴、成就、赛季通行证等系统
     */
    private integrateCollectionAndProgression(payload: LevelCompletePayload): void {
        const levelId = payload.levelId;
        const stars = payload.stars;

        // 1. 收集物品到图鉴 (基于关卡ID生成物品ID)
        this.collectItemsToAlbum(levelId);

        // 2. 触发成就检查
        this.checkAchievements(levelId, stars);

        // 3. 赛季通行证增加经验
        this.addSeasonPassExp(stars);
    }

    /**
     * 收集物品到图鉴
     * 根据关卡收集对应的物品
     */
    private collectItemsToAlbum(levelId: number | undefined): void {
        try {
            const albumManager = AlbumManager.instance;
            
            // 根据关卡ID生成物品ID (示例：level-1 -> item_furniture_1, item_stationery_1)
            const levelNum = levelId || 1;
            
            // 为每个关卡生成几个物品ID
            const itemIds: string[] = [];
            
            // 根据关卡类型添加不同物品
            if (levelNum <= 5) {
                // 教学关：基础物品
                itemIds.push('item_stationery_pen');
                itemIds.push('item_stationery_notebook');
            } else if (levelNum <= 15) {
                // 中期关：厨具和衣物
                itemIds.push('item_kitchen_plate');
                itemIds.push('item_kitchen_cup');
                itemIds.push('item_clothes_shirt');
            } else if (levelNum <= 25) {
                // 后期关：浴室用品和更多家具
                itemIds.push('item_bathroom_towel');
                itemIds.push('item_bathroom_toothbrush');
                itemIds.push('item_furniture_chair');
            } else {
                // 高级关：复杂物品
                itemIds.push('item_furniture_table');
                itemIds.push('item_furniture_lamp');
                itemIds.push('item_decoration_vase');
            }

            // 调用图鉴管理器收集物品
            const newCount = albumManager.collectItems(itemIds);
            console.log(`[ResultScene] 图鉴收集了新 ${newCount} 个物品`);

        } catch (e) {
            console.error('[ResultScene] 图鉴收集失败:', e);
        }
    }

    /**
     * 检查成就
     */
    private checkAchievements(levelId: number | undefined, stars: number): void {
        try {
            const achievementManager = AchievementManager.instance;
            const seasonPass = SeasonPass.instance;

            // 获取当前的累计数据
            const totalStars = seasonPass.getCurrentExp() + stars; // 使用经验作为星星计数
            
            // 1. 通关成就检查
            const currentLevel = levelId || 1;
            achievementManager.triggerAchievementCheck(AchievementType.LEVEL_COUNT, currentLevel);

            // 2. 整理物品成就 (每个关卡完成算整理了多个物品)
            const totalItems = currentLevel * 5; // 简化计算
            achievementManager.triggerAchievementCheck(AchievementType.TOTAL_ITEMS, totalItems);

            // 3. 星星成就
            achievementManager.triggerAchievementCheck(AchievementType.STAR_TOTAL, totalStars);

            console.log(`[ResultScene] 成就检查完成，当前关卡: ${currentLevel}, 累计星星: ${totalStars}`);

        } catch (e) {
            console.error('[ResultScene] 成就检查失败:', e);
        }
    }

    /**
     * 增加赛季通行证经验
     */
    private addSeasonPassExp(stars: number): void {
        try {
            const seasonPass = SeasonPass.instance;
            
            // 根据星级给予经验奖励
            // 1星=10经验，2星=20经验，3星=30经验
            const expGain = stars * 10;
            
            seasonPass.addExp(expGain);
            
            console.log(`[ResultScene] 赛季通行证获得 ${expGain} 经验`);

        } catch (e) {
            console.error('[ResultScene] 赛季通行证经验增加失败:', e);
        }
    }

    /**
     * 处理关卡失败事件
     */
    private onLevelFailed(data?: LevelFailedPayload): void {
        const payload = data || {};
        this._lastLevelId = payload.levelId;

        console.log(`[ResultScene] 收到 LEVEL_FAILED 事件，levelId: ${payload.levelId}`);

        // 显示失败面板
        this.showFailed(payload.levelId);

        // 播放失败音效（如果有AudioManager）
        this.playFailSound();
    }

    /**
     * 显示成功面板
     */
    private showSuccess(stars: number, levelId?: number, sceneDisplayName?: string): void {
        // 隐藏失败面板
        if (this.failPanel) {
            this.failPanel.active = false;
        }

        // 显示成功面板
        if (this.successPanel) {
            this.successPanel.active = true;
        }

        // 更新标题
        if (this.titleLabel) {
            this.titleLabel.string = '⭐ 关卡完成！ ⭐';
        }

        // 更新星级显示
        if (this.starsLabel) {
            this.starsLabel.string = this.getStarsString(stars);
        }

        // 更新描述
        if (this.descLabel) {
            const levelName = sceneDisplayName || levelId || '当前关卡';
            const rewardText = this._lastRewardCoins > 0 ? `，获得 ${this._lastRewardCoins} 金币` : '';
            this.descLabel.string = `恭喜完成 ${levelName}${rewardText}！`;
        }

        // 触发成功特效
        this.playSuccessEffects();
    }

    /**
     * 显示失败面板
     */
    private showFailed(levelId?: number): void {
        // 隐藏成功面板
        if (this.successPanel) {
            this.successPanel.active = false;
        }

        // 显示失败面板
        if (this.failPanel) {
            this.failPanel.active = true;
        }

        // 更新标题
        if (this.titleLabel) {
            this.titleLabel.string = '⏰ 时间耗尽！ ⏰';
        }

        // 清除星级显示
        if (this.starsLabel) {
            this.starsLabel.string = '';
        }

        // 更新描述
        if (this.descLabel) {
            const levelName = levelId || '当前关卡';
            this.descLabel.string = `${levelName} 未能在规定时间内完成`;
        }
    }

    /**
     * 获取星级字符串
     */
    private getStarsString(stars: number): string {
        const starChar = '★';
        const emptyStarChar = '☆';
        let result = '';
        for (let i = 0; i < 3; i++) {
            result += i < stars ? starChar : emptyStarChar;
        }
        return result;
    }

    /**
     * 播放成功音效
     */
    private playSuccessSound(): void {
        // 尝试获取AudioManager播放音效
        try {
            const { AudioManager } = require('../audio/AudioManager');
            const audioManager = AudioManager.getInstance();
            if (audioManager && typeof audioManager.playSuccess === 'function') {
                audioManager.playSuccess();
            }
        } catch (e) {
            // 忽略音频管理器未就绪的情况
        }
    }

    /**
     * 播放失败音效
     */
    private playFailSound(): void {
        try {
            const { AudioManager } = require('../audio/AudioManager');
            const audioManager = AudioManager.getInstance();
            if (audioManager && typeof audioManager.playFail === 'function') {
                audioManager.playFail();
            }
        } catch (e) {
            // 忽略音频管理器未就绪的情况
        }
    }

    /**
     * 播放成功特效
     */
    private playSuccessEffects(): void {
        // 可以在这里添加粒子特效、动画等
        console.log('[ResultScene] 播放成功特效');
    }

    /**
     * 点击下一关
     */
    onNextLevel(): void {
        const nextLevelId = this._nextLevelId;
        console.log('[ResultScene] 点击下一关', nextLevelId);
        if (!nextLevelId || !getLevelConfig(nextLevelId)) {
            this.onBackHome();
            return;
        }

        DataManager.getInstance().setCurrentLevel(`level-${nextLevelId.toString().padStart(3, '0')}`);
        this._eventManager?.emit(GAME_EVENTS.CHANGE_SCENE, {
            sceneName: 'Game',
            levelId: nextLevelId,
        });
    }

    /**
     * 重新开始
     */
    onRetry(): void {
        const currentLevel = this._lastLevelId;
        console.log('[ResultScene] 点击重新开始', currentLevel);
        if (!currentLevel) {
            return;
        }

        DataManager.getInstance().setCurrentLevel(`level-${currentLevel.toString().padStart(3, '0')}`);
        this._eventManager?.emit(GAME_EVENTS.CHANGE_SCENE, {
            sceneName: 'Game',
            levelId: currentLevel,
        });
    }

    /**
     * 返回主页
     */
    onBackHome(): void {
        console.log('[ResultScene] 点击返回主页');
        this._eventManager?.emit(GAME_EVENTS.CHANGE_SCENE, {
            sceneName: 'Home',
        });
    }

    /**
     * 观看广告翻倍奖励
     */
    onWatchAd(): void {
        console.log('[ResultScene] 点击观看广告');
        // TODO: 显示奖励翻倍广告
    }

    /**
     * 获取上次完成的星级
     */
    getLastStars(): number {
        return this._lastStars;
    }

    /**
     * 获取上次关卡ID
     */
    getLastLevelId(): number | undefined {
        return this._lastLevelId;
    }

    onDestroy(): void {
        this.unregisterEvents();
    }
}