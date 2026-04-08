import { _decorator, Component } from 'cc';
import { DataManager } from '../core/DataManager';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';
import { AchievementData, AchievementType, AchievementReward } from '../data/AchievementData';

const { ccclass } = _decorator;

/**
 * 成就管理器
 * 管理成就系统的达成和奖励
 */
@ccclass('AchievementManager')
export class AchievementManager extends Component {
    private static _instance: AchievementManager;

    static get instance(): AchievementManager {
        if (!this._instance) {
            this._instance = new AchievementManager();
        }
        return this._instance;
    }

    // 存储key
    private static readonly STORAGE_KEY = 'tidy_master_achievements';
    private static readonly PROGRESS_KEY = 'tidy_master_achievement_progress';

    // 已解锁的成就ID集合
    private _unlockedAchievements: Set<string> = new Set();

    // 成就进度数据
    private _progressData: Map<string, number> = new Map();

    // 成就配置数据
    private _achievementConfigs: Map<string, AchievementData> = new Map();

    private constructor() {
        super();
        this.initAchievements();
        this.loadData();
    }

    onLoad() {
        this.loadData();
    }

    // ==================== 初始化 ====================

    /**
     * 初始化成就配置
     */
    private initAchievements(): void {
        // 通关类成就
        this.registerAchievement({
            id: 'level_count_10',
            name: '初出茅庐',
            description: '通关10个关卡',
            type: AchievementType.LEVEL_COUNT,
            condition: { type: AchievementType.LEVEL_COUNT, value: 10 },
            reward: { coins: 100, title: '新手房东' },
            unlocked: false,
            target: 10,
        });

        this.registerAchievement({
            id: 'level_count_50',
            name: '小有名气',
            description: '通关50个关卡',
            type: AchievementType.LEVEL_COUNT,
            condition: { type: AchievementType.LEVEL_COUNT, value: 50 },
            reward: { coins: 500, title: '资深房东' },
            unlocked: false,
            target: 50,
        });

        this.registerAchievement({
            id: 'level_count_100',
            name: '声名远扬',
            description: '通关100个关卡',
            type: AchievementType.LEVEL_COUNT,
            condition: { type: AchievementType.LEVEL_COUNT, value: 100 },
            reward: { coins: 1000, title: '金牌房东' },
            unlocked: false,
            target: 100,
        });

        // 整理物品类成就
        this.registerAchievement({
            id: 'total_items_50',
            name: '整理达人',
            description: '整理50件物品',
            type: AchievementType.TOTAL_ITEMS,
            condition: { type: AchievementType.TOTAL_ITEMS, value: 50 },
            reward: { coins: 100 },
            unlocked: false,
            target: 50,
        });

        this.registerAchievement({
            id: 'total_items_200',
            name: '整理大师',
            description: '整理200件物品',
            type: AchievementType.TOTAL_ITEMS,
            condition: { type: AchievementType.TOTAL_ITEMS, value: 200 },
            reward: { coins: 500 },
            unlocked: false,
            target: 200,
        });

        this.registerAchievement({
            id: 'total_items_500',
            name: '整洁如新',
            description: '整理500件物品',
            type: AchievementType.TOTAL_ITEMS,
            condition: { type: AchievementType.TOTAL_ITEMS, value: 500 },
            reward: { coins: 1000 },
            unlocked: false,
            target: 500,
        });

        // 星级类成就
        this.registerAchievement({
            id: 'star_total_50',
            name: '星光璀璨',
            description: '累计获得50颗星星',
            type: AchievementType.STAR_TOTAL,
            condition: { type: AchievementType.STAR_TOTAL, value: 50 },
            reward: { coins: 200 },
            unlocked: false,
            target: 50,
        });

        this.registerAchievement({
            id: 'star_total_150',
            name: '星星之火',
            description: '累计获得150颗星星',
            type: AchievementType.STAR_TOTAL,
            condition: { type: AchievementType.STAR_TOTAL, value: 150 },
            reward: { coins: 500 },
            unlocked: false,
            target: 150,
        });

        this.registerAchievement({
            id: 'star_total_300',
            name: '星耀满屋',
            description: '累计获得300颗星星',
            type: AchievementType.STAR_TOTAL,
            condition: { type: AchievementType.STAR_TOTAL, value: 300 },
            reward: { coins: 1000, title: '收纳大师' },
            unlocked: false,
            target: 300,
        });

        // 合成类成就
        this.registerAchievement({
            id: 'tool_level_5',
            name: '工具升级',
            description: '合成5级工具',
            type: AchievementType.TOOL_LEVEL,
            condition: { type: AchievementType.TOOL_LEVEL, value: 5 },
            reward: { coins: 300, toolFragments: 10 },
            unlocked: false,
            target: 5,
        });

        this.registerAchievement({
            id: 'tool_level_7',
            name: '工具大师',
            description: '合成7级工具',
            type: AchievementType.TOOL_LEVEL,
            condition: { type: AchievementType.TOOL_LEVEL, value: 7 },
            reward: { coins: 500, toolFragments: 20 },
            unlocked: false,
            target: 7,
        });

        // 连击类成就
        this.registerAchievement({
            id: 'combo_10',
            name: '连击达人',
            description: '达成10连击',
            type: AchievementType.COMBO_MAX,
            condition: { type: AchievementType.COMBO_MAX, value: 10 },
            reward: { coins: 100 },
            unlocked: false,
            target: 10,
        });

        this.registerAchievement({
            id: 'combo_20',
            name: '连击高手',
            description: '达成20连击',
            type: AchievementType.COMBO_MAX,
            condition: { type: AchievementType.COMBO_MAX, value: 20 },
            reward: { coins: 300 },
            unlocked: false,
            target: 20,
        });

        // 登录类成就
        this.registerAchievement({
            id: 'continuous_days_7',
            name: '持之以恒',
            description: '连续登录7天',
            type: AchievementType.CONTINUOUS_DAYS,
            condition: { type: AchievementType.CONTINUOUS_DAYS, value: 7 },
            reward: { coins: 200 },
            unlocked: false,
            target: 7,
        });

        this.registerAchievement({
            id: 'continuous_days_30',
            name: '坚持不懈',
            description: '连续登录30天',
            type: AchievementType.CONTINUOUS_DAYS,
            condition: { type: AchievementType.CONTINUOUS_DAYS, value: 30 },
            reward: { coins: 1000, decoration: 'badge_30days' },
            unlocked: false,
            target: 30,
        });
    }

    /**
     * 注册成就配置
     */
    private registerAchievement(config: AchievementData): void {
        this._achievementConfigs.set(config.id, config);
    }

    // ==================== 数据加载/保存 ====================

    /**
     * 加载成就数据
     */
    private loadData(): void {
        try {
            const unlockedData = localStorage.getItem(AchievementManager.STORAGE_KEY);
            if (unlockedData) {
                const parsed = JSON.parse(unlockedData);
                this._unlockedAchievements = new Set(parsed || []);
            }

            const progressData = localStorage.getItem(AchievementManager.PROGRESS_KEY);
            if (progressData) {
                const parsed = JSON.parse(progressData);
                this._progressData = new Map(Object.entries(parsed));
            }
        } catch (e) {
            console.error('[AchievementManager] 加载数据失败:', e);
        }
    }

    /**
     * 保存成就数据
     */
    private saveData(): void {
        try {
            localStorage.setItem(
                AchievementManager.STORAGE_KEY,
                JSON.stringify(Array.from(this._unlockedAchievements))
            );
            localStorage.setItem(
                AchievementManager.PROGRESS_KEY,
                JSON.stringify(Object.fromEntries(this._progressData))
            );
        } catch (e) {
            console.error('[AchievementManager] 保存数据失败:', e);
        }
    }

    // ==================== 成就触发 ====================

    /**
     * 触发成就检查
     * @param achievementType 成就类型
     * @param value 当前值
     */
    triggerAchievementCheck(achievementType: AchievementType, value: number): void {
        // 更新进度
        this.updateProgress(achievementType.toString(), value);

        // 检查所有相关成就
        for (const [id, config] of this._achievementConfigs) {
            if (config.type === achievementType && !this._unlockedAchievements.has(id)) {
                if (value >= config.condition.value) {
                    this.unlockAchievement(id);
                }
            }
        }
    }

    /**
     * 解锁成就
     */
    private unlockAchievement(achievementId: string): void {
        if (this._unlockedAchievements.has(achievementId)) {
            return;
        }

        this._unlockedAchievements.add(achievementId);
        this.saveData();

        const config = this._achievementConfigs.get(achievementId);
        if (!config) return;

        // 发放奖励
        this.grantReward(config.reward);

        // 发送事件
        const eventManager = EventManager.getInstance();
        eventManager.emit(GAME_EVENTS.ACHIEVEMENT_UNLOCKED, {
            achievementId: achievementId,
            name: config.name,
            description: config.description,
            reward: config.reward,
        });

        console.log(`[AchievementManager] 解锁成就: ${config.name}`);
    }

    /**
     * 发放奖励
     */
    private grantReward(reward: AchievementReward): void {
        const dataManager = DataManager.getInstance();

        if (reward.coins) {
            dataManager.addCoins(reward.coins);
        }

        // TODO: 发放工具碎片
        if (reward.toolFragments) {
            console.log(`[AchievementManager] 获得工具碎片: ${reward.toolFragments}`);
        }

        // TODO: 发放装饰物
        if (reward.decoration) {
            console.log(`[AchievementManager] 获得装饰物: ${reward.decoration}`);
        }

        // TODO: 解锁称号
        if (reward.title) {
            console.log(`[AchievementManager] 解锁称号: ${reward.title}`);
        }
    }

    /**
     * 更新进度
     */
    updateProgress(achievementId: string, currentValue: number): void {
        const oldValue = this._progressData.get(achievementId) || 0;
        if (currentValue > oldValue) {
            this._progressData.set(achievementId, currentValue);
            this.saveData();

            // 发送进度更新事件
            const eventManager = EventManager.getInstance();
            eventManager.emit(GAME_EVENTS.ACHIEVEMENT_PROGRESS_UPDATE, {
                achievementId: achievementId,
                currentValue: currentValue,
            });
        }
    }

    /**
     * 获取进度
     */
    getProgress(achievementId: string): number {
        return this._progressData.get(achievementId) || 0;
    }

    /**
     * 是否已解锁
     */
    isUnlocked(achievementId: string): boolean {
        return this._unlockedAchievements.has(achievementId);
    }

    /**
     * 获取已解锁成就数量
     */
    getUnlockedCount(): number {
        return this._unlockedAchievements.size;
    }

    /**
     * 获取成就总数
     */
    getTotalCount(): number {
        return this._achievementConfigs.size;
    }

    /**
     * 获取所有成就配置
     */
    getAllAchievements(): AchievementData[] {
        const achievements: AchievementData[] = [];
        for (const [id, config] of this._achievementConfigs) {
            achievements.push({
                ...config,
                unlocked: this._unlockedAchievements.has(id),
                progress: this._progressData.get(id) || 0,
            });
        }
        return achievements;
    }

    /**
     * 获取成就配置
     */
    getAchievementConfig(achievementId: string): AchievementData | undefined {
        const config = this._achievementConfigs.get(achievementId);
        if (!config) return undefined;

        return {
            ...config,
            unlocked: this._unlockedAchievements.has(achievementId),
            progress: this._progressData.get(achievementId) || 0,
        };
    }

    // ==================== 重置 ====================

    /**
     * 重置成就数据
     */
    reset(): void {
        this._unlockedAchievements.clear();
        this._progressData.clear();
        this.saveData();
    }
}