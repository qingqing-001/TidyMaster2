/**
 * 游戏配置数据类型定义
 * 此文件定义所有关卡、物品、场景等数据结构的TypeScript类型
 */

import { OperationType } from './LevelData';

export const ITEM_TYPES = {
    // 文具类
    BOOK: 'book',
    BOOKS: 'books',
    PEN: 'pen',
    PENS: 'pens',
    PENCIL: 'pencil',
    ERASER: 'eraser',
    RULER: 'ruler',
    NOTEBOOK: 'notebook',

    // 厨具类
    CUP: 'cup',
    CUPS: 'cups',
    PLATE: 'plate',
    PLATES: 'plates',
    BOWL: 'bowl',
    FORK: 'fork',
    SPOON: 'spoon',
    KNIFE: 'knife',
    BOTTLE: 'bottle',
    BOTTLES: 'bottles',

    // 衣物类
    CLOTH: 'cloth',
    CLOTHES: 'clothes',
    SHIRT: 'shirt',
    PANTS: 'pants',
    SOCK: 'sock',
    TOWEL: 'towel',
    TOWELS: 'towels',

    // 玩具类
    TOY: 'toy',
    TOYS: 'toys',
    DOLL: 'doll',
    BALL: 'ball',
    CAR: 'car',

    // 其他
    BAG: 'bag',
    BOX: 'box',
    TRASH: 'trash',
    SPONGE: 'sponge',
    COUNTER: 'counter',

    // 冰箱物品类（第4章）
    FOOD: 'food',
    VEGETABLE: 'vegetable',
    FRUIT: 'fruit',
    DAIRY: 'dairy',
    MEAT: 'meat',
    DRINK: 'drink',
    LEFTOVER: 'leftover',
    ICE_CREAM: 'ice_cream',
    JAM: 'jam',
    EGG: 'egg',

    // 浴室物品类（第5章）
    SHAMPOO: 'shampoo',
    SOAP: 'soap',
    TOILET_PAPER: 'toilet_paper',
    TOOTHBRUSH: 'toothbrush',
    TOOTHPASTE: 'toothpaste',
    TOWEL_BATH: 'towel_bath',
    RAZOR: 'razor',
    BATH_BOMB: 'bath_bomb',
    FLOSS: 'floss',
    MIRROR: 'mirror',

    // 管道类（第5章）
    PIPE: 'pipe',
    PIPE_ELBOW: 'pipe_elbow',
    PIPE_TEE: 'pipe_tee',
    VALVE: 'valve',
} as const;

export type ItemType = typeof ITEM_TYPES[keyof typeof ITEM_TYPES];

export interface Vector2Like {
    x: number;
    y: number;
}

export interface SizeLike {
    w: number;
    h: number;
}

export interface RewardConfig {
    baseCoin: number;
    toolFragments: number;
}

export interface BgmTrackConfig {
    path: string;
    loop: boolean;
    volume: number;
}

export interface SfxTrackConfig {
    path: string;
    volume: number;
}

export interface GameConfig {
    appName: string;
    version: string;
    ENABLE_DEBUG_LOG: boolean;
    targetFrameRate: number;
    designResolution: {
        width: number;
        height: number;
        fitWidth: boolean;
        fitHeight: boolean;
    };
    level: {
        tutorialChapter: number;
        totalTutorialLevels: number;
        defaultTimeLimit: number;
        maxStarsPerLevel: number;
        scorePerItem: number;
        comboBonusStep: number;
    };
    input: {
        dragThreshold: number;
        wipeSamplingDistance: number;
        longPressDurationMs: number;
    };
    save: {
        playerDataKey: string;
        settingsKey: string;
        progressKey: string;
    };
    DEFAULT_LEVEL_ID: string;
    SLOT_CAPACITY: number;
}

export interface SceneConfig {
    id: string;
    name: string;
    displayName: string;
    bgSprite: string;
    ambientSfxKey?: string;
    items: ItemType[];
    defaultTimeLimit: number;
}

export interface SceneConfigMap {
    [sceneId: string]: SceneConfig;
}

export interface AudioConfig {
    bgm: {
        [key: string]: BgmTrackConfig;
    };
    sfx: {
        [key: string]: SfxTrackConfig;
    };
}

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
    rewards: RewardConfig;
}

export interface LevelItemConfig {
    id: string;
    type: ItemType;
    spriteKey: string;
    initialPos: Vector2Like;
    targetSlotId: string;
    operation: OperationType;
    sortOrder: number;
    scale?: number;
    rotation?: number;
}

export interface LevelSlotConfig {
    id: string;
    pos: Vector2Like;
    acceptTypes: ItemType[];
    size: SizeLike;
    hintSprite?: string;
    label?: string;
}

export interface ChapterConfig {
    id: number;
    name: string;
    displayName: string;
    levelRange: [number, number];
    bossLevels: number[];
    rewardChapter: number;
    unlockRequirement?: number;
}

export interface PlayerProgress {
    currentLevel: number;
    unlockedLevels: number[];
    levelStars: {
        [levelId: number]: number;
    };
    levelHighScores: {
        [levelId: number]: number;
    };
    completedChapters: number[];
}

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

export interface PlayerSettings {
    bgmEnabled: boolean;
    sfxEnabled: boolean;
    bgmVolume: number;
    sfxVolume: number;
    language: string;
    hapticEnabled: boolean;
}

export interface GameState {
    levelId: number;
    currentScore: number;
    placedItems: string[];
    remainingTime: number;
    comboCount: number;
    isPaused: boolean;
    starsEarned: number;
}
