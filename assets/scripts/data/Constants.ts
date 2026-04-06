/**
 * 全局常量定义
 */

// 游戏配置
export const GAME_CONFIG = {
    VERSION: '1.0.0',
    MAX_LEVEL: 100,
    FIRST_BOSS_LEVEL: 5,
    BOSS_INTERVAL: 5,
} as const;

// 广告配置
export const AD_CONFIG = {
    COOLDOWN_TIME: 120,        // 广告冷却时间（秒）
    MAX_CLOSE_COUNT: 3,        // 连续关闭上限
    NEWBIE_LEVELS: 5,          // 新手保护关卡数
    MAX_DAILY_VIEW: 8,         // 每日最大观看次数
} as const;

// 评分配置
export const SCORE_CONFIG = {
    MIN_STARS: 1,
    MAX_STARS: 3,
} as const;

// 连击配置
export const COMBO_CONFIG = {
    TIME_WINDOW: 2000,         // 连击时间窗口（毫秒）
    MAX_COMBO_DISPLAY: 4,      // 最大显示连击数
} as const;

// 存储键名
export const STORAGE_KEYS = {
    PLAYER_DATA: 'tidy_master_player_data',
    SETTINGS: 'tidy_master_settings',
    DAILY_DATA: 'tidy_master_daily_data',
    ACHIEVEMENTS: 'tidy_master_achievements',
    COLLECTION: 'tidy_master_collection',
    SEASON_PASS: 'tidy_master_season_pass',
} as const;

// 事件名
export const GAME_EVENTS = {
    ITEM_PLACED: 'item-placed',
    LEVEL_COMPLETE: 'level-complete',
    LEVEL_FAILED: 'level-failed',
    COMBO_TRIGGERED: 'combo-triggered',
    AD_REWARD_GRANTED: 'ad-reward-granted',
    SCORE_UPDATED: 'score-updated',
    TIME_WARNING: 'time-warning',
    TOOL_UPGRADED: 'tool-upgraded',
    ACHIEVEMENT_UNLOCKED: 'achievement-unlocked',
    COLLECTION_UPDATE: 'collection-update',
} as const;

// 颜色配置
export const COLORS = {
    PRIMARY: '#FFB347',
    SECONDARY: '#87CEEB',
    ACCENT: '#FFD700',
    BACKGROUND: '#FFF8E7',
    TEXT: '#4A4A4A',
    SUCCESS: '#7BC67E',
    WARNING: '#FF6B6B',
} as const;
