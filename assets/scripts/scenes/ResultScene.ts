import { _decorator, Component, Node, Label, Sprite } from 'cc';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/Constants';

const { ccclass, property } = _decorator;

// 事件payload类型定义
interface LevelCompletePayload {
    levelId?: string;
    stars: number;
}

interface LevelFailedPayload {
    levelId?: string;
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
    private _lastLevelId: string | undefined;

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
            this.onLevelComplete.bind(this)
        );

        // 监听关卡失败事件
        this._eventManager.on<LevelFailedPayload>(
            GAME_EVENTS.LEVEL_FAILED, 
            this.onLevelFailed.bind(this)
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

        this._eventManager.off(GAME_EVENTS.LEVEL_COMPLETE, this.onLevelComplete.bind(this));
        this._eventManager.off(GAME_EVENTS.LEVEL_FAILED, this.onLevelFailed.bind(this));
    }

    /**
     * 处理关卡完成事件
     */
    private onLevelComplete(data?: LevelCompletePayload): void {
        const payload = data || { stars: 0 };
        this._lastStars = payload.stars || 0;
        this._lastLevelId = payload.levelId;

        console.log(`[ResultScene] 收到 LEVEL_COMPLETE 事件，levelId: ${payload.levelId}, stars: ${payload.stars}`);

        // 显示成功面板
        this.showSuccess(payload.stars || 0, payload.levelId);

        // 播放成功音效（如果有AudioManager）
        this.playSuccessSound();
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
    private showSuccess(stars: number, levelId?: string): void {
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
            const levelName = levelId || '当前关卡';
            this.descLabel.string = `恭喜完成 ${levelName}！`;
        }

        // 触发成功特效
        this.playSuccessEffects();
    }

    /**
     * 显示失败面板
     */
    private showFailed(levelId?: string): void {
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
        console.log('[ResultScene] 点击下一关');
        // TODO: 切换到游戏场景，加载下一关
    }

    /**
     * 重新开始
     */
    onRetry(): void {
        console.log('[ResultScene] 点击重新开始');
        // TODO: 重新开始当前关卡
    }

    /**
     * 返回主页
     */
    onBackHome(): void {
        console.log('[ResultScene] 点击返回主页');
        // TODO: 切换到主页场景
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
    getLastLevelId(): string | undefined {
        return this._lastLevelId;
    }

    onDestroy(): void {
        this.unregisterEvents();
    }
}