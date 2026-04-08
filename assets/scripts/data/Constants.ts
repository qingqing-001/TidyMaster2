/**
 * 全局游戏常量与配置
 */

import { ITEM_TYPES, type AudioConfig, type ChapterConfig, type GameConfig, type SceneConfigMap } from './types';

export { ITEM_TYPES };

export const GAME_CONFIG: GameConfig = {
    appName: 'TidyMaster',
    version: '1.0.0',
    ENABLE_DEBUG_LOG: false,
    targetFrameRate: 60,
    designResolution: {
        width: 750,
        height: 1334,
        fitWidth: true,
        fitHeight: false,
    },
    level: {
        tutorialChapter: 1,
        totalTutorialLevels: 5,
        defaultTimeLimit: 90,
        maxStarsPerLevel: 3,
        scorePerItem: 20,
        comboBonusStep: 5,
    },
    input: {
        dragThreshold: 12,
        wipeSamplingDistance: 18,
        longPressDurationMs: 350,
    },
    save: {
        playerDataKey: 'tidymaster.player',
        settingsKey: 'tidymaster.settings',
        progressKey: 'tidymaster.progress',
    },
};

export const GAME_EVENTS = {
    LEVEL_START: 'level:start',
    LEVEL_LOADED: 'level:loaded',
    LEVEL_COMPLETE: 'level:complete',
    LEVEL_FAIL: 'level:fail',
    LEVEL_FAILED: 'level:fail',
    ITEM_PICKUP: 'item:pickup',
    ITEM_PLACED: 'item:placed',
    ITEM_REMOVED: 'item:removed',
    ITEM_WRONG_DROP: 'item:wrong_drop',
    OPERATION_PROGRESS: 'operation:progress',
    OPERATION_COMPLETE: 'operation:complete',
    TIMER_TICK: 'timer:tick',
    TIMER_COMPLETE: 'timer:complete',
    SETTINGS_CHANGED: 'settings:changed',
    CHANGE_SCENE: 'change-scene',
    OPEN_MERGE_PANEL: 'open-merge-panel',
    COLLECTION_UPDATE: 'collection-update',
} as const;

export const CHAPTER_CONFIG: Record<number, ChapterConfig> = {
    1: {
        id: 1,
        name: 'chapter1',
        displayName: '第一章：新手教学',
        levelRange: [1, 5],
        bossLevels: [5],
        rewardChapter: 1,
    },
    2: {
        id: 2,
        name: 'chapter2',
        displayName: '第二章：熟练挑战',
        levelRange: [201, 205],
        bossLevels: [205],
        rewardChapter: 2,
        unlockRequirement: 10,
    },
};

export const SCENE_CONFIG: SceneConfigMap = {
    desk: {
        id: 'desk',
        name: 'desk',
        displayName: '书桌',
        bgSprite: 'bg_desk',
        ambientSfxKey: 'paper_rustle',
        items: [ITEM_TYPES.BOOK, ITEM_TYPES.PEN, ITEM_TYPES.PENCIL, ITEM_TYPES.NOTEBOOK],
        defaultTimeLimit: 0,
    },
    kitchen: {
        id: 'kitchen',
        name: 'kitchen',
        displayName: '厨房',
        bgSprite: 'bg_kitchen',
        ambientSfxKey: 'kitchen_ambient',
        items: [ITEM_TYPES.PLATE, ITEM_TYPES.CUP, ITEM_TYPES.FORK, ITEM_TYPES.SPOON, ITEM_TYPES.BOTTLE, ITEM_TYPES.BOWL],
        defaultTimeLimit: 90,
    },
    table: {
        id: 'table',
        name: 'table',
        displayName: '餐桌',
        bgSprite: 'bg_table',
        ambientSfxKey: 'wipe_loop',
        items: [ITEM_TYPES.TOWEL, ITEM_TYPES.BOTTLE, ITEM_TYPES.PLATE, ITEM_TYPES.CUP],
        defaultTimeLimit: 90,
    },
    bedroom: {
        id: 'bedroom',
        name: 'bedroom',
        displayName: '卧室',
        bgSprite: 'bg_bedroom',
        ambientSfxKey: 'cloth_rustle',
        items: [ITEM_TYPES.CLOTH, ITEM_TYPES.TOWEL, ITEM_TYPES.SHIRT, ITEM_TYPES.PANTS],
        defaultTimeLimit: 120,
    },
    living_room: {
        id: 'living_room',
        name: 'living_room',
        displayName: '客厅',
        bgSprite: 'bg_living_room',
        ambientSfxKey: 'room_ambient',
        items: [ITEM_TYPES.BOOK, ITEM_TYPES.CUP, ITEM_TYPES.TOWEL, ITEM_TYPES.CLOTH, ITEM_TYPES.TOY],
        defaultTimeLimit: 150,
    },
};

export const AUDIO_CONFIG: AudioConfig = {
    bgm: {
        bgm_tutorial: {
            path: 'audio/bgm/tutorial',
            loop: true,
            volume: 0.7,
        },
        bgm_tutorial_boss: {
            path: 'audio/bgm/tutorial_boss',
            loop: true,
            volume: 0.75,
        },
        bgm_chapter2: {
            path: 'audio/bgm/chapter2',
            loop: true,
            volume: 0.72,
        },
    },
    sfx: {
        item_pickup: {
            path: 'audio/sfx/item_pickup',
            volume: 0.85,
        },
        item_place: {
            path: 'audio/sfx/item_place',
            volume: 0.9,
        },
        wipe_loop: {
            path: 'audio/sfx/wipe_loop',
            volume: 0.65,
        },
        fold_success: {
            path: 'audio/sfx/fold_success',
            volume: 0.88,
        },
        star_reward: {
            path: 'audio/sfx/star_reward',
            volume: 1,
        },
        ui_click: {
            path: 'audio/sfx/ui_click',
            volume: 0.75,
        },
        kitchen_ambient: {
            path: 'audio/sfx/kitchen_ambient',
            volume: 0.4,
        },
        room_ambient: {
            path: 'audio/sfx/room_ambient',
            volume: 0.35,
        },
        paper_rustle: {
            path: 'audio/sfx/paper_rustle',
            volume: 0.45,
        },
        cloth_rustle: {
            path: 'audio/sfx/cloth_rustle',
            volume: 0.45,
        },
    },
};
