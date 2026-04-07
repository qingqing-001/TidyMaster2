import { OperationType } from './LevelData';
import { LevelDataConfig, ITEM_TYPES } from './types';

const COUNTER = ITEM_TYPES.COUNTER;
const SPONGE = ITEM_TYPES.SPONGE;
const PLATE = ITEM_TYPES.PLATE;
const BOWL = ITEM_TYPES.BOWL;
const CUP = ITEM_TYPES.CUP;

export const LEVEL_2_1: LevelDataConfig = {
    id: 201,
    chapter: 2,
    sceneName: 'kitchen',
    sceneDisplayName: '厨房台面擦洗',
    timeLimit: 90,
    items: [
        {
            id: 'sponge_1',
            type: SPONGE,
            spriteKey: 'item_sponge_yellow',
            initialPos: { x: -220, y: -80 },
            targetSlotId: 'wipe_counter_center',
            operation: OperationType.WIPE,
            sortOrder: 1,
        },
        {
            id: 'plate_dirty_1',
            type: PLATE,
            spriteKey: 'item_plate_dirty',
            initialPos: { x: 180, y: -120 },
            targetSlotId: 'plate_stack_slot',
            operation: OperationType.DRAG,
            sortOrder: 2,
        },
    ],
    slots: [
        {
            id: 'wipe_counter_center',
            pos: { x: 0, y: 40 },
            acceptTypes: [SPONGE, COUNTER],
            size: { w: 260, h: 180 },
            hintSprite: 'hint_wipe',
            label: '来回擦洗台面污渍',
        },
        {
            id: 'plate_stack_slot',
            pos: { x: 250, y: 110 },
            acceptTypes: [PLATE, BOWL, CUP],
            size: { w: 120, h: 120 },
            hintSprite: 'hint_plate',
            label: '餐具归位',
        },
    ],
    starThresholds: [40, 70, 100],
    isBoss: false,
    operations: [OperationType.WIPE, OperationType.DRAG],
    bgmKey: 'bgm_chapter2',
    rewards: {
        baseCoin: 90,
        toolFragments: 12,
    },
};

export const CHAPTER_2_LEVELS: LevelDataConfig[] = [
    LEVEL_2_1,
];
