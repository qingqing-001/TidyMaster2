import { OperationType } from './LevelData';
import { LevelDataConfig, ITEM_TYPES } from './types';

const CLOTH = ITEM_TYPES.CLOTH;
const TOWEL = ITEM_TYPES.TOWEL;

// 第3章：衣柜折叠（Chapter 3 - Closet Folding）
export const LEVEL_3_1: LevelDataConfig = {
    id: 301,
    chapter: 3,
    sceneName: 'closet',
    sceneDisplayName: '衣柜折叠',
    timeLimit: 180,
    items: [
        {
            id: 'shirt_white_ch3',
            type: CLOTH,
            spriteKey: 'item_shirt_tshirt',
            initialPos: { x: -260, y: -30 },
            targetSlotId: 'closet_fold_1',
            operation: OperationType.FOLD,
            sortOrder: 1,
        },
        {
            id: 'pants_blue_ch3',
            type: CLOTH,
            spriteKey: 'item_shirt_pants',
            initialPos: { x: -120, y: -70 },
            targetSlotId: 'closet_fold_2',
            operation: OperationType.FOLD,
            sortOrder: 2,
        },
        {
            id: 'towel_large_ch3',
            type: TOWEL,
            spriteKey: 'item_towel_bath',
            initialPos: { x: 20, y: -10 },
            targetSlotId: 'closet_fold_3',
            operation: OperationType.FOLD,
            sortOrder: 3,
        },
    ],
    slots: [
        {
            id: 'closet_fold_1',
            pos: { x: -180, y: 210 },
            acceptTypes: [CLOTH],
            size: { w: 90, h: 110 },
            hintSprite: 'hint_fold',
            label: '折好上衣',
        },
        {
            id: 'closet_fold_2',
            pos: { x: -40, y: 210 },
            acceptTypes: [CLOTH],
            size: { w: 90, h: 110 },
            hintSprite: 'hint_fold',
            label: '折好裤子',
        },
        {
            id: 'closet_fold_3',
            pos: { x: 100, y: 210 },
            acceptTypes: [TOWEL],
            size: { w: 110, h: 110 },
            hintSprite: 'hint_fold',
            label: '折叠浴巾',
        },
    ],
    starThresholds: [50, 78, 100],
    isBoss: false,
    operations: [OperationType.FOLD],
    bgmKey: 'bgm_chapter3',
    rewards: {
        baseCoin: 100,
        toolFragments: 15,
    },
};

export const CHAPTER_3_LEVELS: LevelDataConfig[] = [
    LEVEL_3_1,
];