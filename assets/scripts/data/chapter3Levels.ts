import { OperationType } from './LevelData';
import { LevelDataConfig, ITEM_TYPES } from './types';

const CLOTH = ITEM_TYPES.CLOTH;
const TOWEL = ITEM_TYPES.TOWEL;

export const LEVEL_3_1: LevelDataConfig = {
    id: 301,
    chapter: 3,
    sceneName: 'closet',
    sceneDisplayName: '衣柜折叠',
    timeLimit: 180,
    items: [
        { id: 'shirt_white_ch3', type: CLOTH, spriteKey: 'item_shirt_tshirt', initialPos: { x: -260, y: -30 }, targetSlotId: 'closet_fold_1', operation: OperationType.FOLD, sortOrder: 1 },
        { id: 'pants_blue_ch3', type: CLOTH, spriteKey: 'item_shirt_pants', initialPos: { x: -120, y: -70 }, targetSlotId: 'closet_fold_2', operation: OperationType.FOLD, sortOrder: 2 },
        { id: 'towel_large_ch3', type: TOWEL, spriteKey: 'item_towel_bath', initialPos: { x: 20, y: -10 }, targetSlotId: 'closet_fold_3', operation: OperationType.FOLD, sortOrder: 3 },
    ],
    slots: [
        { id: 'closet_fold_1', pos: { x: -180, y: 210 }, acceptTypes: [CLOTH], size: { w: 90, h: 110 }, hintSprite: 'hint_fold', label: '折好上衣' },
        { id: 'closet_fold_2', pos: { x: -40, y: 210 }, acceptTypes: [CLOTH], size: { w: 90, h: 110 }, hintSprite: 'hint_fold', label: '折好裤子' },
        { id: 'closet_fold_3', pos: { x: 100, y: 210 }, acceptTypes: [TOWEL], size: { w: 110, h: 110 }, hintSprite: 'hint_fold', label: '折叠浴巾' },
    ],
    starThresholds: [50, 78, 100],
    isBoss: false,
    operations: [OperationType.FOLD],
    bgmKey: 'bgm_chapter3',
    rewards: { baseCoin: 100, toolFragments: 15 },
};

export const LEVEL_3_2: LevelDataConfig = {
    id: 302,
    chapter: 3,
    sceneName: 'closet',
    sceneDisplayName: 'T恤三连折',
    timeLimit: 170,
    items: [
        { id: 'shirt_yellow_302', type: CLOTH, spriteKey: 'item_shirt_tshirt', initialPos: { x: -220, y: -40 }, targetSlotId: 'fold_shirt_a_302', operation: OperationType.FOLD, sortOrder: 1 },
        { id: 'shirt_pink_302', type: CLOTH, spriteKey: 'item_shirt_tshirt', initialPos: { x: -40, y: -50 }, targetSlotId: 'fold_shirt_b_302', operation: OperationType.FOLD, sortOrder: 2 },
        { id: 'shirt_blue_302', type: CLOTH, spriteKey: 'item_shirt_tshirt', initialPos: { x: 150, y: -45 }, targetSlotId: 'fold_shirt_c_302', operation: OperationType.FOLD, sortOrder: 3 },
    ],
    slots: [
        { id: 'fold_shirt_a_302', pos: { x: -170, y: 210 }, acceptTypes: [CLOTH], size: { w: 90, h: 100 }, hintSprite: 'hint_fold', label: '折好短袖1' },
        { id: 'fold_shirt_b_302', pos: { x: 0, y: 210 }, acceptTypes: [CLOTH], size: { w: 90, h: 100 }, hintSprite: 'hint_fold', label: '折好短袖2' },
        { id: 'fold_shirt_c_302', pos: { x: 170, y: 210 }, acceptTypes: [CLOTH], size: { w: 90, h: 100 }, hintSprite: 'hint_fold', label: '折好短袖3' },
    ],
    starThresholds: [52, 80, 100],
    isBoss: false,
    operations: [OperationType.FOLD],
    bgmKey: 'bgm_chapter3',
    rewards: { baseCoin: 105, toolFragments: 15 },
};

export const LEVEL_3_3: LevelDataConfig = {
    id: 303,
    chapter: 3,
    sceneName: 'closet',
    sceneDisplayName: '大件床品整理',
    timeLimit: 180,
    items: [
        { id: 'towel_blue_303', type: TOWEL, spriteKey: 'item_towel_bath', initialPos: { x: -200, y: -30 }, targetSlotId: 'fold_towel_a_303', operation: OperationType.FOLD, sortOrder: 1 },
        { id: 'towel_green_303', type: TOWEL, spriteKey: 'item_towel_bath', initialPos: { x: 0, y: -40 }, targetSlotId: 'fold_towel_b_303', operation: OperationType.FOLD, sortOrder: 2 },
        { id: 'sheet_303', type: CLOTH, spriteKey: 'item_shirt_pants', initialPos: { x: 210, y: -45 }, targetSlotId: 'fold_sheet_303', operation: OperationType.FOLD, sortOrder: 3 },
    ],
    slots: [
        { id: 'fold_towel_a_303', pos: { x: -170, y: 210 }, acceptTypes: [TOWEL], size: { w: 110, h: 110 }, hintSprite: 'hint_fold', label: '浴巾折叠A' },
        { id: 'fold_towel_b_303', pos: { x: 0, y: 210 }, acceptTypes: [TOWEL], size: { w: 110, h: 110 }, hintSprite: 'hint_fold', label: '浴巾折叠B' },
        { id: 'fold_sheet_303', pos: { x: 170, y: 210 }, acceptTypes: [CLOTH], size: { w: 125, h: 125 }, hintSprite: 'hint_fold', label: '折好大件床品' },
    ],
    starThresholds: [54, 82, 100],
    isBoss: false,
    operations: [OperationType.FOLD],
    bgmKey: 'bgm_chapter3',
    rewards: { baseCoin: 110, toolFragments: 16 },
};

export const LEVEL_3_4: LevelDataConfig = {
    id: 304,
    chapter: 3,
    sceneName: 'closet',
    sceneDisplayName: '衣橱分区折叠',
    timeLimit: 175,
    items: [
        { id: 'pants_black_304', type: CLOTH, spriteKey: 'item_shirt_pants', initialPos: { x: -260, y: -55 }, targetSlotId: 'fold_pants_a_304', operation: OperationType.FOLD, sortOrder: 1 },
        { id: 'shirt_white_304', type: CLOTH, spriteKey: 'item_shirt_tshirt', initialPos: { x: -80, y: -40 }, targetSlotId: 'fold_shirt_a_304', operation: OperationType.FOLD, sortOrder: 2 },
        { id: 'towel_small_304', type: TOWEL, spriteKey: 'item_towel_bath', initialPos: { x: 90, y: -35 }, targetSlotId: 'fold_towel_a_304', operation: OperationType.FOLD, sortOrder: 3 },
        { id: 'pants_blue_304', type: CLOTH, spriteKey: 'item_shirt_pants', initialPos: { x: 260, y: -45 }, targetSlotId: 'fold_pants_b_304', operation: OperationType.FOLD, sortOrder: 4 },
    ],
    slots: [
        { id: 'fold_pants_a_304', pos: { x: -210, y: 210 }, acceptTypes: [CLOTH], size: { w: 95, h: 105 }, hintSprite: 'hint_fold', label: '长裤折叠A' },
        { id: 'fold_shirt_a_304', pos: { x: -60, y: 210 }, acceptTypes: [CLOTH], size: { w: 95, h: 105 }, hintSprite: 'hint_fold', label: '上衣折叠' },
        { id: 'fold_towel_a_304', pos: { x: 90, y: 210 }, acceptTypes: [TOWEL], size: { w: 110, h: 110 }, hintSprite: 'hint_fold', label: '毛巾折叠' },
        { id: 'fold_pants_b_304', pos: { x: 240, y: 210 }, acceptTypes: [CLOTH], size: { w: 95, h: 105 }, hintSprite: 'hint_fold', label: '长裤折叠B' },
    ],
    starThresholds: [55, 84, 100],
    isBoss: false,
    operations: [OperationType.FOLD],
    bgmKey: 'bgm_chapter3',
    rewards: { baseCoin: 115, toolFragments: 16 },
};

export const LEVEL_3_5: LevelDataConfig = {
    id: 305,
    chapter: 3,
    sceneName: 'closet',
    sceneDisplayName: '收纳达人Boss',
    timeLimit: 200,
    items: [
        { id: 'boss_shirt_305', type: CLOTH, spriteKey: 'item_shirt_tshirt', initialPos: { x: -300, y: -40 }, targetSlotId: 'boss_fold_shirt_305', operation: OperationType.FOLD, sortOrder: 1 },
        { id: 'boss_pants_305', type: CLOTH, spriteKey: 'item_shirt_pants', initialPos: { x: -120, y: -55 }, targetSlotId: 'boss_fold_pants_305', operation: OperationType.FOLD, sortOrder: 2 },
        { id: 'boss_towel_a_305', type: TOWEL, spriteKey: 'item_towel_bath', initialPos: { x: 60, y: -35 }, targetSlotId: 'boss_fold_towel_a_305', operation: OperationType.FOLD, sortOrder: 3 },
        { id: 'boss_towel_b_305', type: TOWEL, spriteKey: 'item_towel_bath', initialPos: { x: 250, y: -45 }, targetSlotId: 'boss_fold_towel_b_305', operation: OperationType.FOLD, sortOrder: 4 },
    ],
    slots: [
        { id: 'boss_fold_shirt_305', pos: { x: -210, y: 220 }, acceptTypes: [CLOTH], size: { w: 100, h: 110 }, hintSprite: 'hint_fold', label: 'Boss上衣折叠' },
        { id: 'boss_fold_pants_305', pos: { x: -50, y: 220 }, acceptTypes: [CLOTH], size: { w: 100, h: 110 }, hintSprite: 'hint_fold', label: 'Boss裤子折叠' },
        { id: 'boss_fold_towel_a_305', pos: { x: 110, y: 220 }, acceptTypes: [TOWEL], size: { w: 120, h: 120 }, hintSprite: 'hint_fold', label: 'Boss浴巾折叠A' },
        { id: 'boss_fold_towel_b_305', pos: { x: 270, y: 220 }, acceptTypes: [TOWEL], size: { w: 120, h: 120 }, hintSprite: 'hint_fold', label: 'Boss浴巾折叠B' },
    ],
    starThresholds: [60, 88, 100],
    isBoss: true,
    operations: [OperationType.FOLD],
    bgmKey: 'bgm_chapter3_boss',
    rewards: { baseCoin: 160, toolFragments: 22 },
};

export const CHAPTER_3_LEVELS: LevelDataConfig[] = [
    LEVEL_3_1,
    LEVEL_3_2,
    LEVEL_3_3,
    LEVEL_3_4,
    LEVEL_3_5,
];
