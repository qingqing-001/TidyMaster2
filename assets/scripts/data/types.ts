/**
 * 游戏配置数据类型定义
 * 此文件定义所有关卡、物品、场景等数据结构的TypeScript类型
 */

import { OperationType } from './LevelData';

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

export type ItemType = typeof ITEM_TYPES[keyof typeof ITEM_TYPES];

// 场景配置接口
export interface SceneConfig {
    id: string;
    name: string;
    displayName: string;
    bgSprite: string;
    items: ItemType[];  // 场景中可出现的物品类型
    defaultTimeLimit: number;
}

// 音频配置接口
export interface AudioConfig {
    bgm: {
        [key: string]: {
            path: string;
            loop: boolean;
            volume: number;
        };
    };
    sfx: {
        [key: string]: {
            path: string;
            volume: number;
        };
    };
}

// 关卡配置接口（扩展 LevelData 中的定义）
export interface LevelDataConfig {
    id: number;
    chapter: number;
    sceneName: string;
    sceneDisplayName: string;
    timeLimit: number;
    items: LevelItemConfig[];
    slots: LevelSlotConfig[];
    starThresholds: [number, number, number];
    isBoss: boolean;
    operations: OperationType[];
    bgmKey: string;
    rewards: {
        baseCoin: number;
        toolFragments: number;
    };
}

// 关卡物品配置
export interface LevelItemConfig {
    id: string;
    type: ItemType;
    spriteKey: string;
    initialPos: { x: number; y: number };
    targetSlotId: string;
    operation: OperationType;
    sortOrder: number;
    scale?: number;
    rotation?: number;
}

// 关卡目标位置配置
export interface LevelSlotConfig {
    id: string;
    pos: { x: number; y: number };
    acceptTypes: ItemType[];
    size: { w: number; h: number };
    hintSprite?: string;
    label?: string;
}

// 章节配置
export interface ChapterConfig {
    id: number;
    name: string;
    displayName: string;
    levelRange: [number, number];
    bossLevels: number[];
    rewardChapter: number;
    unlockRequirement?: number;  // 解锁所需星数
}

// 玩家进度数据
export interface PlayerProgress {
    currentLevel: number;
    unlockedLevels: number[];
    levelStars: {
        [levelId: number]: number;  // 0-3 星
    };
    levelHighScores: {
        [levelId: number]: number;
    };
    completedChapters: number[];
}

// 玩家数据
export interface PlayerData {
    id: string;
    name: string;
    avatar?: string;
    level: number;
    coins: number;
    exp: number;
    progress: PlayerProgress;
    settings: PlayerSettings;
    createdAt: number;
    lastPlayedAt: number;
}

// 玩家设置
export interface PlayerSettings {
    bgmEnabled: boolean;
    sfxEnabled: boolean;
    bgmVolume: number;
    sfxVolume: number;
    language: string;
    hapticEnabled: boolean;
}

// 游戏状态
export interface GameState {
    levelId: number;
    currentScore: number;
    timeRemaining: number;
    itemsPlaced: string[];
    comboCount: number;
    isPaused: boolean;
    isComplete: boolean;
}

// 物品实体状态
export interface ItemEntity {
    id: string;
    type: ItemType;
    spriteKey: string;
    position: { x: number; y: number };
    isPlaced: boolean;
    isDragging: boolean;
    scale: number;
    rotation: number;
}

// 目标位置实体状态
export interface SlotEntity {
    id: string;
    position: { x: number; y: number };
    size: { w: number; h: number };
    occupied: boolean;
    placedItemId?: string;
}
