/**
 * 全局常量定义
 */

// 物品类型枚举
export const ITEM_TYPES = {
    // 文具类
    BOOK: 'book',
    PEN: 'pen',
    PENCIL: 'pencil',
    ERASER: 'eraser',
    RULER: 'ruler',
    NOTEBOOK: 'notebook',

    // 厨具类
    CUP: 'cup',
    PLATE: 'plate',
    BOWL: 'bowl',
    FORK: 'fork',
    SPOON: 'spoon',
    KNIFE: 'knife',
    BOTTLE: 'bottle',

    // 衣物类
    CLOTH: 'cloth',
    SHIRT: 'shirt',
    PANTS: 'pants',
    SOCK: 'sock',
    TOWEL: 'towel',

    // 玩具类
    TOY: 'toy',
    DOLL: 'doll',
    BALL: 'ball',
    CAR: 'car',

    // 其他
    BAG: 'bag',
    BOX: 'box',
    TRASH: 'trash',
} as const;

// 场景配置
export const SCENE_CONFIG = {
    DESK: {
        id: 'desk',
        name: '书桌',
        displayName: 'Desk',
        bgSprite: 'bg_desk',
        items: [ITEM_TYPES.BOOK, ITEM_TYPES.PEN, ITEM_TYPES.PENCIL],
        defaultTimeLimit: 0,
    },
    KITCHEN: {
        id: 'kitchen',
        name: '厨房',
        displayName: 'Kitchen',
        bgSprite: 'bg_kitchen',
        items: [ITEM_TYPES.CUP, ITEM_TYPES.PLATE, ITEM_TYPES.FORK, ITEM_TYPES.SPOON],
        defaultTimeLimit: 0,
    },
    TABLE: {
        id: 'table',
        name: '餐桌',
        displayName: 'Dining Table',
        bgSprite: 'bg_table',
        items: [ITEM_TYPES.PLATE, ITEM_TYPES.CUP, ITEM_TYPES.BOTTLE, ITEM_TYPES.TOWEL],
        defaultTimeLimit: 90,
    },
    BEDROOM: {
        id: 'bedroom',
        name: '卧室',
        displayName: 'Bedroom',
        bgSprite: 'bg_bedroom',
        items: [ITEM_TYPES.CLOTH, ITEM_TYPES.TOWEL],
        defaultTimeLimit: 120,
    },
    LIVING_ROOM: {
        id: 'living_room',
        name: '客厅',
        displayName: 'Living Room',
        bgSprite: 'bg_livingroom',
        items: [ITEM_TYPES.BOOK, ITEM_TYPES.CUP, ITEM_TYPES.TOWEL, ITEM_TYPES.CLOTH],
        defaultTimeLimit: 150,
    },
    CLOSET: {
        id: 'closet',
        name: '衣柜',
        displayName: 'Closet',
        bgSprite: 'bg_closet',
        items: [ITEM_TYPES.CLOTH, ITEM_TYPES.SHIRT, ITEM_TYPES.PANTS, ITEM_TYPES.SOCK],
        defaultTimeLimit: 180,
    },
    BATHROOM: {
        id: 'bathroom',
        name: '浴室',
        displayName: 'Bathroom',
        bgSprite: 'bg_bathroom',
        items: [ITEM_TYPES.TOWEL, ITEM_TYPES.BOTTLE],
        defaultTimeLimit: 120,
    },
} as const;

// 音频配置
export const AUDIO_CONFIG = {
    bgm: {
        bgm_tutorial: {
            path: 'audio/bgm/tutorial.mp3',
            loop: true,
            volume: 0.6,
        },
        bgm_tutorial_boss: {
            path: 'audio/bgm/tutorial_boss.mp3',
            loop: true,
            volume: 0.7,
        },
        bgm_chapter1: {
            path: 'audio/bgm/chapter1.mp3',
            loop: true,
            volume: 0.6,
        },
        bgm_chapter2: {
            path: 'audio/bgm/chapter2.mp3',
            loop: true,
            volume: 0.6,
        },
        bgm_chapter3: {
            path: 'audio/bgm/chapter3.mp3',
            loop: true,
            volume: 0.6,
        },
        bgm_boss: {
            path: 'audio/bgm/boss.mp3',
            loop: true,
            volume: 0.8,
        },
    },
    sfx: {
        sfx_item_pickup: {
            path: 'audio/sfx/item_pickup.mp3',
            volume: 0.8,
        },
        sfx_item_place: {
            path: 'audio/sfx/item_place.mp3',
            volume: 0.8,
        },
        sfx_item_wipe: {
            path: 'audio/sfx/item_wipe.mp3',
            volume: 0.7,
        },
        sfx_item_fold: {
            path: 'audio/sfx/item_fold.mp3',
            volume: 0.7,
        },
        sfx_success: {
            path: 'audio/sfx/success.mp3',
            volume: 0.9,
        },
        sfx_star: {
            path: 'audio/sfx/star.mp3',
            volume: 0.9,
        },
        sfx_combo: {
            path: 'audio/sfx/combo.mp3',
            volume: 0.8,
        },
        sfx_fail: {
            path: 'audio/sfx/fail.mp3',
            volume: 0.8,
        },
        sfx_ui_click: {
            path: 'audio/sfx/ui_click.mp3',
            volume: 0.6,
        },
        sfx_reward: {
            path: 'audio/sfx/reward.mp3',
            volume: 0.9,
        },
    },
} as const;

// 游戏配置
export const GAME_CONFIG = {
    VERSION: '1.0.0',
    MAX_LEVEL: 100,
    FIRST_BOSS_LEVEL: 5,
    BOSS_INTERVAL: 5,
    CHAPTER_COUNT: 3,
    LEVELS_PER_CHAPTER: 5,
} as const;

// 章节配置
export const CHAPTER_CONFIG = {
    1: {
        id: 1,
        name: 'chapter1',
        displayName: '第一章：新手教学',
        levelRange: [1, 5] as [number, number],
        bossLevels: [5],
        rewardChapter: 1,
    },
    2: {
        id: 2,
        name: 'chapter2',
        displayName: '第二章：熟练挑战',
        levelRange: [6, 10] as [number, number],
        bossLevels: [10],
        rewardChapter: 2,
        unlockRequirement: 10,  // 需要累计10星解锁
    },
    3: {
        id: 3,
        name: 'chapter3',
        displayName: '第三章：大师挑战',
        levelRange: [11, 15] as [number, number],
        bossLevels: [15],
        rewardChapter: 3,
        unlockRequirement: 25,  // 需要累计25星解锁
    },
} as const;

// 操作配置
export const OPERATION_CONFIG = {
    DRAG: {
        name: 'drag',
        displayName: '拖拽',
        minDistance: 10,
    },
    WIPE: {
        name: 'wipe',
        displayName: '擦洗',
        wipeThreshold: 80,  // 完成擦洗所需的百分比
    },
    FOLD: {
        name: 'fold',
        displayName: '折叠',
        foldSteps: 3,  // 折叠步骤数
    },
    ROTATE: {
        name: 'rotate',
        displayName: '旋转',
        targetAngle: 90,  // 目标旋转角度
    },
} as const;

// 广告配置
export const AD_CONFIG = {
    COOLDOWN_TIME: 120,        // 广告冷却时间（秒）
    MAX_CLOSE_COUNT: 3,        // 连续关闭上限
    NEWBIE_LEVELS: 5,          // 新手保护关卡数
    MAX_DAILY_VIEW: 8,         // 每日最大观看次数
    REWARD_COINS: 50,          // 观看广告奖励金币
    REWARD_TIME: 30,           // 观看广告奖励时间（秒）
} as const;

// 评分配置
export const SCORE_CONFIG = {
    MIN_STARS: 1,
    MAX_STARS: 3,
    BASE_SCORE: 100,           // 基础分数
    TIME_BONUS_FACTOR: 0.5,    // 时间奖励系数
    COMBO_BONUS_FACTOR: 10,    // 连击奖励系数
    PERFECTION_BONUS: 50,      // 完美通关奖励
} as const;

// 连击配置
export const COMBO_CONFIG = {
    TIME_WINDOW: 2000,         // 连击时间窗口（毫秒）
    MAX_COMBO_DISPLAY: 4,      // 最大显示连击数
    BONUS_MULTIPLIER: [1, 1.2, 1.5, 2.0],  // 连击倍率
} as const;

// 时间警告配置
export const TIME_WARNING_CONFIG = {
    WARNING_THRESHOLD: 30,     // 警告阈值（秒）
    CRITICAL_THRESHOLD: 10,     // 紧急阈值（秒）
    WARNING_COLOR: '#FFA500',  // 警告颜色
    CRITICAL_COLOR: '#FF0000', // 紧急颜色
} as const;

// 存储键名
export const STORAGE_KEYS = {
    PLAYER_DATA: 'tidy_master_player_data',
    SETTINGS: 'tidy_master_settings',
    DAILY_DATA: 'tidy_master_daily_data',
    ACHIEVEMENTS: 'tidy_master_achievements',
    COLLECTION: 'tidy_master_collection',
    SEASON_PASS: 'tidy_master_season_pass',
    LEVEL_PROGRESS: 'tidy_master_level_progress',
} as const;

// 事件名
export const GAME_EVENTS = {
    ITEM_PLACED: 'item-placed',
    ITEM_PICKED: 'item-picked',
    LEVEL_COMPLETE: 'level-complete',
    LEVEL_FAILED: 'level-failed',
    LEVEL_START: 'level-start',
    COMBO_TRIGGERED: 'combo-triggered',
    AD_REWARD_GRANTED: 'ad-reward-granted',
    SCORE_UPDATED: 'score-updated',
    TIME_WARNING: 'time-warning',
    TOOL_UPGRADED: 'tool-upgraded',
    ACHIEVEMENT_UNLOCKED: 'achievement-unlocked',
    COLLECTION_UPDATE: 'collection-update',
    CHAPTER_UNLOCKED: 'chapter-unlocked',
} as const;

// UI 配置
export const UI_CONFIG = {
    TOOLTIP_DURATION: 2000,    // 提示显示时间（毫秒）
    ANIMATION_SPEED: 300,      // 动画速度（毫秒）
    DIALOG_FADE_IN: 200,       // 对话框淡入时间
    DIALOG_FADE_OUT: 150,      // 对话框淡出时间
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
    ERROR: '#E74C3C',
    INFO: '#3498DB',
    DARK: '#2C3E50',
    LIGHT: '#ECF0F1',
} as const;

// 牙刷难度配置
export const DIFFICULTY_CONFIG = {
    EASY: {
        name: 'easy',
        displayName: '简单',
        timeMultiplier: 1.5,
        scoreMultiplier: 0.8,
    },
    NORMAL: {
        name: 'normal',
        displayName: '普通',
        timeMultiplier: 1.0,
        scoreMultiplier: 1.0,
    },
    HARD: {
        name: 'hard',
        displayName: '困难',
        timeMultiplier: 0.8,
        scoreMultiplier: 1.3,
    },
} as const;

// 奖励配置
export const REWARD_CONFIG = {
    COIN_PER_STAR: 20,         // 每星奖励金币
    COIN_PER_LEVEL: 50,        // 每关基础金币
    FRAGMENT_PER_LEVEL: 5,     // 每关碎片
    BOSS_COIN_BONUS: 100,      // BOSS关金币奖励
    BOSS_FRAGMENT_BONUS: 15,   // BOSS关碎片奖励
} as const;
