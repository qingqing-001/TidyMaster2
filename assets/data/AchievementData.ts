/**
 * 成就数据类型定义
 */

/**
 * 成就类型
 */
export enum AchievementType {
    LEVEL_COUNT = 'level_count',        // 通关关卡数
    TOTAL_ITEMS = 'total_items',         // 整理物品总数
    STAR_TOTAL = 'star_total',           // 累计星星数
    TOOL_LEVEL = 'tool_level',           // 工具等级
    COMBO_MAX = 'combo_max',             // 最大连击数
    CONTINUOUS_DAYS = 'continuous_days', // 连续登录天数
}

/**
 * 成就奖励
 */
export interface AchievementReward {
    coins?: number;              // 金币奖励
    title?: string;              // 称号
    toolFragments?: number;      // 工具碎片
    decoration?: string;         // 装饰物
}

/**
 * 成就条件
 */
export interface AchievementCondition {
    type: AchievementType;
    value: number;
}

/**
 * 成就数据
 */
export interface AchievementData {
    id: string;
    name: string;
    description: string;
    type: AchievementType;
    condition: AchievementCondition;
    reward: AchievementReward;
    unlocked: boolean;
    target: number;
    progress?: number;
}