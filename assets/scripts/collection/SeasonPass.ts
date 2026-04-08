import { _decorator, Component } from 'cc';
import { DataManager } from '../core/DataManager';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';

const { ccclass } = _decorator;

/**
 * 赛季通行证奖励配置
 */
export interface SeasonPassReward {
    level: number;
    expRequired: number;
    freeReward: {
        coins: number;
        item?: string;
    };
    premiumReward?: {
        coins: number;
        item?: string;
        decoration?: string;
    };
}

/**
 * 赛季数据
 */
export interface SeasonData {
    seasonId: string;
    startTime: number;
    endTime: number;
    currentLevel: number;
    currentExp: number;
    claimedRewards: number[];
    isPremium: boolean;
}

/**
 * 赛季通行证
 * 管理赛季进度和奖励
 */
@ccclass('SeasonPass')
export class SeasonPass extends Component {
    private static _instance: SeasonPass;

    static get instance(): SeasonPass {
        if (!this._instance) {
            this._instance = new SeasonPass();
        }
        return this._instance;
    }

    // 存储key
    private static readonly STORAGE_KEY = 'tidy_master_season_pass';
    private static readonly SEASON_CONFIG_KEY = 'tidy_master_season_config';

    // 赛季配置
    private _seasonData: SeasonData | null = null;

    // 赛季通行证等级配置 (共50级)
    private _levelConfig: SeasonPassReward[] = [];

    // 当前赛季ID
    private _currentSeasonId: string = 'season_1';

    // 赛季持续时间 (毫秒) - 30天
    private readonly SEASON_DURATION = 30 * 24 * 60 * 60 * 1000;

    private constructor() {
        super();
        this.initLevelConfig();
        this.loadData();
    }

    onLoad() {
        this.loadData();
    }

    // ==================== 初始化 ====================

    /**
     * 初始化等级配置
     */
    private initLevelConfig(): void {
        // 50级赛季通行证配置
        const expPerLevel = 100; // 每级所需经验

        for (let level = 1; level <= 50; level++) {
            const config: SeasonPassReward = {
                level: level,
                expRequired: level * expPerLevel,
                freeReward: {
                    coins: level * 10,
                },
            };

            // 高级奖励 (每5级有额外奖励)
            if (level % 5 === 0) {
                config.premiumReward = {
                    coins: level * 20,
                    decoration: `season_decoration_${level}`,
                };
            } else {
                config.premiumReward = {
                    coins: level * 15,
                };
            }

            this._levelConfig.push(config);
        }
    }

    // ==================== 数据加载/保存 ====================

    /**
     * 加载赛季数据
     */
    private loadData(): void {
        try {
            const data = localStorage.getItem(SeasonPass.STORAGE_KEY);
            if (data) {
                this._seasonData = JSON.parse(data);

                // 检查赛季是否过期
                if (this._seasonData && this.isSeasonExpired()) {
                    this.startNewSeason();
                }
            } else {
                this.startNewSeason();
            }
        } catch (e) {
            console.error('[SeasonPass] 加载数据失败:', e);
            this.startNewSeason();
        }
    }

    /**
     * 保存赛季数据
     */
    private saveData(): void {
        try {
            if (this._seasonData) {
                localStorage.setItem(SeasonPass.STORAGE_KEY, JSON.stringify(this._seasonData));
            }
        } catch (e) {
            console.error('[SeasonPass] 保存数据失败:', e);
        }
    }

    // ==================== 赛季管理 ====================

    /**
     * 开始新赛季
     */
    private startNewSeason(): void {
        const now = Date.now();

        // 生成新的赛季ID
        this._currentSeasonId = `season_${Math.floor(now / this.SEASON_DURATION)}`;

        this._seasonData = {
            seasonId: this._currentSeasonId,
            startTime: now,
            endTime: now + this.SEASON_DURATION,
            currentLevel: 1,
            currentExp: 0,
            claimedRewards: [],
            isPremium: false,
        };

        this.saveData();
        console.log(`[SeasonPass] 开始新赛季: ${this._currentSeasonId}`);
    }

    /**
     * 检查赛季是否过期
     */
    private isSeasonExpired(): boolean {
        if (!this._seasonData) return true;
        return Date.now() > this._seasonData.endTime;
    }

    /**
     * 获取当前赛季数据
     */
    getSeasonData(): SeasonData | null {
        return this._seasonData;
    }

    /**
     * 获取当前赛季剩余时间 (毫秒)
     */
    getRemainingTime(): number {
        if (!this._seasonData) return 0;
        const remaining = this._seasonData.endTime - Date.now();
        return Math.max(0, remaining);
    }

    /**
     * 获取当前等级
     */
    getCurrentLevel(): number {
        return this._seasonData?.currentLevel || 1;
    }

    /**
     * 获取当前经验
     */
    getCurrentExp(): number {
        return this._seasonData?.currentExp || 0;
    }

    /**
     * 是否是高级通行证
     */
    isPremium(): boolean {
        return this._seasonData?.isPremium || false;
    }

    // ==================== 经验系统 ====================

    /**
     * 增加经验值
     * @param exp 经验值
     */
    addExp(exp: number): void {
        if (!this._seasonData) return;

        this._seasonData.currentExp += exp;

        // 检查是否升级
        this.checkLevelUp();

        this.saveData();

        // 发送经验获得事件
        const eventManager = EventManager.getInstance();
        eventManager.emit(GAME_EVENTS.SEASON_PASS_EXP_GAINED, {
            exp: exp,
            currentLevel: this._seasonData.currentLevel,
            currentExp: this._seasonData.currentExp,
        });
    }

    /**
     * 检查升级
     */
    private checkLevelUp(): void {
        if (!this._seasonData) return;

        let leveledUp = false;

        while (this._seasonData.currentLevel < 50) {
            const nextLevelExp = this.getExpForLevel(this._seasonData.currentLevel + 1);
            if (this._seasonData.currentExp >= nextLevelExp) {
                this._seasonData.currentLevel++;
                leveledUp = true;

                // 发送升级事件
                const eventManager = EventManager.getInstance();
                eventManager.emit(GAME_EVENTS.SEASON_PASS_LEVEL_UP, {
                    newLevel: this._seasonData.currentLevel,
                });

                console.log(`[SeasonPass] 升级到 ${this._seasonData.currentLevel} 级`);
            } else {
                break;
            }
        }
    }

    /**
     * 获取指定等级所需经验
     */
    getExpForLevel(level: number): number {
        if (level <= 1) return 0;
        if (level > 50) level = 50;

        const config = this._levelConfig[level - 1];
        return config ? config.expRequired : 0;
    }

    // ==================== 奖励系统 ====================

    /**
     * 领取奖励
     * @param level 等级
     * @returns 是否领取成功
     */
    claimReward(level: number): boolean {
        if (!this._seasonData) return false;
        if (level < 1 || level > 50) return false;
        if (this._seasonData.currentLevel < level) return false;
        if (this._seasonData.claimedRewards.includes(level)) return false;

        const config = this._levelConfig[level - 1];
        if (!config) return false;

        // 发放免费奖励
        const dataManager = DataManager.getInstance();
        dataManager.addCoins(config.freeReward.coins);

        // 如果是高级通行证，发放高级奖励
        if (this._seasonData.isPremium && config.premiumReward) {
            dataManager.addCoins(config.premiumReward.coins);

            // TODO: 发放道具/装饰物
            if (config.premiumReward.decoration) {
                console.log(`[SeasonPass] 获得装饰物: ${config.premiumReward.decoration}`);
            }
        }

        // 标记已领取
        this._seasonData.claimedRewards.push(level);
        this.saveData();

        console.log(`[SeasonPass] 领取 ${level} 级奖励成功`);
        return true;
    }

    /**
     * 批量领取奖励
     * @param maxLevel 最大等级
     * @returns 领取的奖励数量
     */
    claimRewardsUpTo(maxLevel: number): number {
        let claimedCount = 0;
        for (let level = 1; level <= maxLevel; level++) {
            if (this.claimReward(level)) {
                claimedCount++;
            }
        }
        return claimedCount;
    }

    /**
     * 检查奖励是否可领取
     */
    canClaimReward(level: number): boolean {
        if (!this._seasonData) return false;
        if (level < 1 || level > 50) return false;
        if (this._seasonData.currentLevel < level) return false;
        return !this._seasonData.claimedRewards.includes(level);
    }

    /**
     * 获取等级配置
     */
    getLevelConfig(level: number): SeasonPassReward | undefined {
        if (level < 1 || level > 50) return undefined;
        return this._levelConfig[level - 1];
    }

    /**
     * 获取进度百分比
     */
    getProgressPercent(): number {
        if (!this._seasonData) return 0;

        const currentLevel = this._seasonData.currentLevel;
        const currentExp = this._seasonData.currentExp;

        if (currentLevel >= 50) return 100;

        const currentLevelExp = this.getExpForLevel(currentLevel);
        const nextLevelExp = this.getExpForLevel(currentLevel + 1);
        const expInLevel = currentExp - currentLevelExp;
        const expNeeded = nextLevelExp - currentLevelExp;

        return Math.floor((expInLevel / expNeeded) * 100);
    }

    // ==================== 高级通行证 ====================

    /**
     * 解锁高级通行证 (通过广告)
     */
    unlockPremium(): void {
        if (!this._seasonData) return;

        this._seasonData.isPremium = true;
        this.saveData();

        console.log('[SeasonPass] 解锁高级通行证');
    }

    /**
     * 购买高级通行证 (付费)
     */
    purchasePremium(): boolean {
        const dataManager = DataManager.getInstance();
        const price = 680; // 价格金币

        if (!dataManager.deductCoins(price)) {
            console.log('[SeasonPass] 金币不足');
            return false;
        }

        if (!this._seasonData) return false;

        this._seasonData.isPremium = true;
        this.saveData();

        console.log('[SeasonPass] 购买高级通行证成功');
        return true;
    }

    // ==================== 重置 ====================

    /**
     * 重置赛季数据
     */
    reset(): void {
        this._seasonData = null;
        localStorage.removeItem(SeasonPass.STORAGE_KEY);
        this.startNewSeason();
    }
}