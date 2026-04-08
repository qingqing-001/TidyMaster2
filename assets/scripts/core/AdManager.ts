import { _decorator, Component } from 'cc';
import { isWx, createRewardedVideoAd, saveData, loadData } from '../utils/WxUtil';

const { ccclass } = _decorator;

// 存储键名常量
const STORAGE_KEYS = {
    LAST_AD_TIME: 'ad_last_time',
    CLOSE_COUNT: 'ad_close_count',
    CLOSE_DATE: 'ad_close_date',
    TOTAL_LEVELS_PLAYED: 'total_levels_played',
};

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

    // 冷却时间常量（毫秒）
    private static readonly COOLDOWN_MS = 120 * 1000; // 120秒

    // 新手保护期关卡数
    private static readonly NEWBIE_PROTECTION_LEVELS = 5;

    // 最大连续关闭次数
    private static readonly MAX_CLOSE_COUNT = 3;

    // 内部状态
    private _lastAdTime: number = 0;
    private _closeCount: number = 0;
    private _closeDate: string = '';
    private _totalLevelsPlayed: number = 0;

    // 广告实例缓存
    private _reviveAd: any = null;
    private _rewardAd: any = null;

    // 当前正在显示的广告类型
    private _currentAdType: 'revive' | 'reward' | 'daily' | 'season' | null = null;
    private _currentCallback: ((success: boolean) => void) | null = null;

    private constructor() {
        super();
        this._loadPersistedData();
    }

    /**
     * 加载持久化数据
     */
    private _loadPersistedData(): void {
        this._lastAdTime = loadData<number>(STORAGE_KEYS.LAST_AD_TIME, 0);
        this._closeCount = loadData<number>(STORAGE_KEYS.CLOSE_COUNT, 0);
        this._closeDate = loadData<string>(STORAGE_KEYS.CLOSE_DATE, '');
        this._totalLevelsPlayed = loadData<number>(STORAGE_KEYS.TOTAL_LEVELS_PLAYED, 0);

        // 检查是否跨天，重置关闭次数
        const today = this._getTodayString();
        if (this._closeDate !== today) {
            this._closeCount = 0;
            this._closeDate = today;
            this._saveCloseData();
        }

        console.log('[AdManager] 加载持久化数据: lastAdTime=' + this._lastAdTime + 
            ', closeCount=' + this._closeCount + 
            ', totalLevelsPlayed=' + this._totalLevelsPlayed);
    }

    /**
     * 保存关闭次数数据
     */
    private _saveCloseData(): void {
        saveData(STORAGE_KEYS.CLOSE_COUNT, this._closeCount);
        saveData(STORAGE_KEYS.CLOSE_DATE, this._closeDate);
    }

    /**
     * 保存最后广告时间
     */
    private _saveLastAdTime(): void {
        this._lastAdTime = Date.now();
        saveData(STORAGE_KEYS.LAST_AD_TIME, this._lastAdTime);
    }

    /**
     * 获取今日日期字符串
     */
    private _getTodayString(): string {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    }

    /**
     * 获取当前关卡数（从已完成的关卡数推断）
     */
    getCurrentLevelNumber(): number {
        // 新手保护期基于已完成的关卡数
        return this._totalLevelsPlayed + 1;
    }

    /**
     * 记录关卡完成，用于追踪新手保护期
     */
    onLevelCompleted(): void {
        this._totalLevelsPlayed++;
        saveData(STORAGE_KEYS.TOTAL_LEVELS_PLAYED, this._totalLevelsPlayed);
        console.log('[AdManager] 关卡完成，累计完成关卡数: ' + this._totalLevelsPlayed);
    }

    /**
     * 获取冷却剩余时间（秒）
     */
    getCooldownRemaining(): number {
        const now = Date.now();
        const elapsed = now - this._lastAdTime;
        const remaining = Math.max(0, Math.ceil((AdManager.COOLDOWN_MS - elapsed) / 1000));
        return remaining;
    }

    /**
     * 是否在冷却期内
     */
    isInCooldown(): boolean {
        return this.getCooldownRemaining() > 0;
    }

    /**
     * 获取关闭次数
     */
    getCloseCount(): number {
        return this._closeCount;
    }

    /**
     * 是否被禁用（连续关闭3次）
     */
    isBlockedByCloseCount(): boolean {
        return this._closeCount >= AdManager.MAX_CLOSE_COUNT;
    }

    /**
     * 检查是否在新手保护期内（前5关无广告）
     */
    isInNewbieProtection(): boolean {
        return this._totalLevelsPlayed < AdManager.NEWBIE_PROTECTION_LEVELS;
    }

    /**
     * 检查是否可以展示广告
     * @param adType 广告类型（可选，用于更精细的控制）
     */
    canShowAd(adType?: 'revive' | 'reward' | 'daily' | 'season'): boolean {
        // 1. 检查新手保护期
        if (this.isInNewbieProtection()) {
            console.log('[AdManager] 新手保护期，不展示广告 (已完成为: ' + this._totalLevelsPlayed + '关)');
            return false;
        }

        // 2. 检查冷却时间
        if (this.isInCooldown()) {
            const remaining = this.getCooldownRemaining();
            console.log('[AdManager] 冷却中，剩余 ' + remaining + ' 秒');
            return false;
        }

        // 3. 检查连续关闭次数
        if (this.isBlockedByCloseCount()) {
            console.log('[AdManager] 已连续关闭 ' + this._closeCount + ' 次，今日不再弹出');
            return false;
        }

        // 4. 检查微信环境
        if (!isWx()) {
            console.log('[AdManager] 非微信环境');
            return false;
        }

        console.log('[AdManager] 可以展示广告');
        return true;
    }

    /**
     * 获取或创建激励视频广告实例
     */
    private _getOrCreateAd(adUnitId: string): any {
        if (!isWx()) {
            console.log('[AdManager] 非微信环境，无法创建广告');
            return null;
        }

        try {
            const ad = createRewardedVideoAd(adUnitId);
            if (ad) {
                // 设置错误监听
                ad.onError((err: any) => {
                    console.log('[AdManager] 广告加载错误:', err);
                });
            }
            return ad;
        } catch (e) {
            console.log('[AdManager] 创建广告失败:', e);
            return null;
        }
    }

    /**
     * 获取续命广告实例
     */
    private _getReviveAd(): any {
        if (!this._reviveAd) {
            this._reviveAd = this._getOrCreateAd(AdManager.AD_UNIT_REVIVE);
        }
        return this._reviveAd;
    }

    /**
     * 获取奖励翻倍广告实例
     */
    private _getRewardAd(): any {
        if (!this._rewardAd) {
            this._rewardAd = this._getOrCreateAd(AdManager.AD_UNIT_REWARD);
        }
        return this._rewardAd;
    }

    /**
     * 显示激励视频广告的通用方法
     */
    private _showRewardedVideoAd(
        adUnitId: string, 
        adType: 'revive' | 'reward' | 'daily' | 'season',
        callback: (success: boolean) => void
    ): void {
        if (!this.canShowAd(adType)) {
            console.log('[AdManager] 无法展示广告: ' + adType);
            callback(false);
            return;
        }

        console.log('[AdManager] 准备展示 ' + adType + ' 广告');

        // 获取广告实例
        let ad: any = null;
        if (adType === 'revive') {
            ad = this._getReviveAd();
        } else if (adType === 'reward') {
            ad = this._getRewardAd();
        } else {
            ad = this._getOrCreateAd(adUnitId);
        }

        if (!ad) {
            console.log('[AdManager] 广告实例创建失败');
            callback(false);
            return;
        }

        // 设置当前广告类型和回调
        this._currentAdType = adType;
        this._currentCallback = callback;

        // 设置广告关闭回调
        ad.onClose((res: any) => {
            console.log('[AdManager] 广告关闭, isEnded=' + (res ? res.isEnded : 'undefined'));
            
            if (res && res.isEnded) {
                // 用户观看完成
                console.log('[AdManager] 广告观看成功，发放奖励');
                this._saveLastAdTime();
                this._currentCallback?.(true);
            } else {
                // 用户未观看完成或关闭
                console.log('[AdManager] 广告未观看完成');
                this._incrementCloseCount();
                this._currentCallback?.(false);
            }
            
            // 清理状态
            this._currentAdType = null;
            this._currentCallback = null;
        });

        // 加载并显示广告
        ad.load()
            .then(() => {
                console.log('[AdManager] 广告加载成功，准备显示');
                return ad.show();
            })
            .catch((err: any) => {
                console.log('[AdManager] 广告加载或显示失败:', err);
                this._incrementCloseCount();
                this._currentCallback?.(false);
                this._currentAdType = null;
                this._currentCallback = null;
            });
    }

    /**
     * 增加连续关闭次数
     */
    private _incrementCloseCount(): void {
        const today = this._getTodayString();
        if (this._closeDate !== today) {
            // 新的一天，重置计数
            this._closeCount = 1;
            this._closeDate = today;
        } else {
            this._closeCount++;
        }
        this._saveCloseData();
        console.log('[AdManager] 连续关闭次数: ' + this._closeCount);
    }

    /**
     * 显示续命广告（关卡失败时）
     * @param callback 回调函数，success 表示是否成功观看并获得续命
     */
    showReviveAd(callback: (success: boolean) => void): void {
        console.log('[AdManager] 请求显示续命广告');
        this._showRewardedVideoAd(AdManager.AD_UNIT_REVIVE, 'revive', callback);
    }

    /**
     * 显示奖励翻倍广告（关卡完成时）
     * @param callback 回调函数，success 表示是否成功观看并获得翻倍
     */
    showRewardMultiplierAd(callback: (success: boolean) => void): void {
        console.log('[AdManager] 请求显示奖励翻倍广告');
        this._showRewardedVideoAd(AdManager.AD_UNIT_REWARD, 'reward', callback);
    }

    /**
     * 显示每日宝箱广告
     * @param callback 回调函数
     */
    showDailyChestAd(callback: (success: boolean) => void): void {
        console.log('[AdManager] 请求显示每日宝箱广告');
        this._showRewardedVideoAd(AdManager.AD_UNIT_DAILY, 'daily', callback);
    }

    /**
     * 显示赛季任务加速广告
     * @param callback 回调函数
     */
    showSeasonAccelerateAd(callback: (success: boolean) => void): void {
        console.log('[AdManager] 请求显示赛季加速广告');
        this._showRewardedVideoAd(AdManager.AD_UNIT_SEASON, 'season', callback);
    }

    /**
     * 重置关闭计数（用于测试或用户主动选择观看广告后）
     */
    resetCloseCount(): void {
        this._closeCount = 0;
        this._saveCloseData();
        console.log('[AdManager] 重置连续关闭次数');
    }

    /**
     * 调试用：强制清除冷却（仅用于测试）
     */
    debugClearCooldown(): void {
        this._lastAdTime = 0;
        saveData(STORAGE_KEYS.LAST_AD_TIME, 0);
        console.log('[AdManager] 调试：清除冷却时间');
    }

    /**
     * 调试用：获取当前状态
     */
    getDebugStatus(): any {
        return {
            lastAdTime: this._lastAdTime,
            cooldownRemaining: this.getCooldownRemaining(),
            closeCount: this._closeCount,
            isInCooldown: this.isInCooldown(),
            isBlockedByCloseCount: this.isBlockedByCloseCount(),
            isInNewbieProtection: this.isInNewbieProtection(),
            totalLevelsPlayed: this._totalLevelsPlayed,
            canShowAd: this.canShowAd(),
        };
    }

    /**
     * onDestroy - 清理资源
     */
    onDestroy(): void {
        // 清理广告实例
        if (this._reviveAd) {
            try {
                this._reviveAd.offError();
                this._reviveAd.offClose();
            } catch (e) {
                // 忽略清理错误
            }
            this._reviveAd = null;
        }
        
        if (this._rewardAd) {
            try {
                this._rewardAd.offError();
                this._rewardAd.offClose();
            } catch (e) {
                // 忽略清理错误
            }
            this._rewardAd = null;
        }

        this._currentAdType = null;
        this._currentCallback = null;
        
        console.log('[AdManager] 资源已清理');
    }
}
