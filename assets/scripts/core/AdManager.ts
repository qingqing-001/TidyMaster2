import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 广告管理器
 * 核心原则：
 * 1. 单次游戏流程核心广告点 < 3个
 * 2. 两次广告间隔 >= 120秒
 * 3. 新手保护期（前5关无广告）
 * 4. 连续3次关闭则当日不再主动弹出
 */
@ccclass('AdManager')
export class AdManager extends Component {
    private static _instance: AdManager;

    static get instance(): AdManager {
        if (!this._instance) {
            this._instance = new AdManager();
        }
        return this._instance;
    }

    // 广告位ID常量（需要在微信后台申请后填入）
    static readonly AD_UNIT_REVIVE = 'adunit-revive-xxx';
    static readonly AD_UNIT_REWARD = 'adunit-reward-xxx';
    static readonly AD_UNIT_DAILY = 'adunit-daily-xxx';
    static readonly AD_UNIT_SEASON = 'adunit-season-xxx';

    private _lastAdTime: number = 0;
    private _closeCount: number = 0;
    private _dailyViewCount: number = 0;

    private constructor() {
        super();
    }

    /**
     * 检查是否可以展示广告
     */
    canShowAd(): boolean {
        // TODO: 检查新手保护期、冷却时间、当日关闭次数
        return true;
    }

    /**
     * 显示续命广告（关卡失败时）
     */
    showReviveAd(callback: (success: boolean) => void): void {
        // TODO: 实现续命广告逻辑
    }

    /**
     * 显示奖励翻倍广告（关卡完成时）
     */
    showRewardMultiplierAd(callback: (success: boolean) => void): void {
        // TODO: 实现奖励翻倍广告逻辑
    }

    /**
     * 显示每日宝箱广告
     */
    showDailyChestAd(callback: (success: boolean) => void): void {
        // TODO: 实现每日宝箱广告逻辑
    }
}
