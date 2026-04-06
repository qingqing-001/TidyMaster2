/**
 * 成就数据定义
 */

export interface AchievementData {
    id: string;
    name: string;
    description: string;
    type: AchievementType;
    condition: AchievementCondition;
    reward: AchievementReward;
    unlocked: boolean;
    progress?: number;
    target?: number;
}

export enum AchievementType {
    LEVEL_COUNT = 'level_count',           // 通关数量
    TOTAL_ITEMS = 'total_items',           // 整理物品总数
    STAR_TOTAL = 'star_total',             // 星级总数
    TOOL_LEVEL = 'tool_level',             // 合成高级工具
    COLLECTION_RATE = 'collection_rate',   // 收集率
    COMBO_MAX = 'combo_max',              // 最大连击
    CONTINUOUS_DAYS = 'continuous_days'    // 连续登录天数
}

export interface AchievementCondition {
    type: AchievementType;
    value: number;
}

export interface AchievementReward {
    coins: number;
    toolFragments?: number;
    decoration?: string;
    title?: string;    // 解锁称号
}
