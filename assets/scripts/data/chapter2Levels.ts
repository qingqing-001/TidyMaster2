import { OperationType } from './LevelData';
import { LevelDataConfig, ITEM_TYPES } from './types';

const COUNTER = ITEM_TYPES.COUNTER;
const SPONGE = ITEM_TYPES.SPONGE;
const PLATE = ITEM_TYPES.PLATE;
const BOWL = ITEM_TYPES.BOWL;
const CUP = ITEM_TYPES.CUP;
const BOTTLE = ITEM_TYPES.BOTTLE;
const FORK = ITEM_TYPES.FORK;
const SPOON = ITEM_TYPES.SPOON;

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

export const LEVEL_2_2: LevelDataConfig = {
    id: 202,
    chapter: 2,
    sceneName: 'kitchen',
    sceneDisplayName: '水槽边整理',
    timeLimit: 95,
    items: [
        { id: 'sponge_sink_202', type: SPONGE, spriteKey: 'item_sponge_blue', initialPos: { x: -260, y: -90 }, targetSlotId: 'sink_wipe_slot_202', operation: OperationType.WIPE, sortOrder: 1 },
        { id: 'cup_dirty_202', type: CUP, spriteKey: 'item_cup_dirty', initialPos: { x: -40, y: -110 }, targetSlotId: 'cup_holder_202', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'bowl_dirty_202', type: BOWL, spriteKey: 'item_bowl_dirty', initialPos: { x: 140, y: -100 }, targetSlotId: 'bowl_rack_202', operation: OperationType.DRAG, sortOrder: 3 },
    ],
    slots: [
        { id: 'sink_wipe_slot_202', pos: { x: -120, y: 30 }, acceptTypes: [SPONGE, COUNTER], size: { w: 220, h: 160 }, hintSprite: 'hint_wipe', label: '擦净水槽边缘' },
        { id: 'cup_holder_202', pos: { x: 120, y: 170 }, acceptTypes: [CUP], size: { w: 110, h: 90 }, hintSprite: 'hint_cup', label: '杯子挂回杯架' },
        { id: 'bowl_rack_202', pos: { x: 270, y: 170 }, acceptTypes: [BOWL], size: { w: 110, h: 100 }, hintSprite: 'hint_plate', label: '碗放回沥水架' },
    ],
    starThresholds: [45, 72, 100],
    isBoss: false,
    operations: [OperationType.WIPE, OperationType.DRAG],
    bgmKey: 'bgm_chapter2',
    rewards: { baseCoin: 95, toolFragments: 12 },
};

export const LEVEL_2_3: LevelDataConfig = {
    id: 203,
    chapter: 2,
    sceneName: 'kitchen',
    sceneDisplayName: '灶台去污',
    timeLimit: 100,
    items: [
        { id: 'sponge_stove_203', type: SPONGE, spriteKey: 'item_sponge_green', initialPos: { x: -280, y: -90 }, targetSlotId: 'stove_wipe_slot_203', operation: OperationType.WIPE, sortOrder: 1 },
        { id: 'bottle_oil_203', type: BOTTLE, spriteKey: 'item_bottle_oil', initialPos: { x: -20, y: -110 }, targetSlotId: 'seasoning_slot_203', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'fork_203', type: FORK, spriteKey: 'item_fork', initialPos: { x: 130, y: -95 }, targetSlotId: 'cutlery_slot_203', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'spoon_203', type: SPOON, spriteKey: 'item_spoon', initialPos: { x: 250, y: -85 }, targetSlotId: 'cutlery_slot_203', operation: OperationType.DRAG, sortOrder: 4 },
    ],
    slots: [
        { id: 'stove_wipe_slot_203', pos: { x: -120, y: 40 }, acceptTypes: [SPONGE, COUNTER], size: { w: 250, h: 180 }, hintSprite: 'hint_wipe', label: '擦掉灶台油污' },
        { id: 'seasoning_slot_203', pos: { x: 120, y: 180 }, acceptTypes: [BOTTLE], size: { w: 100, h: 100 }, hintSprite: 'hint_bottle', label: '调味瓶放回置物架' },
        { id: 'cutlery_slot_203', pos: { x: 270, y: 185 }, acceptTypes: [FORK, SPOON], size: { w: 130, h: 90 }, hintSprite: 'hint_cutlery', label: '餐具收回抽屉盒' },
    ],
    starThresholds: [50, 78, 100],
    isBoss: false,
    operations: [OperationType.WIPE, OperationType.DRAG],
    bgmKey: 'bgm_chapter2',
    rewards: { baseCoin: 105, toolFragments: 14 },
};

export const LEVEL_2_4: LevelDataConfig = {
    id: 204,
    chapter: 2,
    sceneName: 'kitchen',
    sceneDisplayName: '餐后快速收拾',
    timeLimit: 90,
    items: [
        { id: 'sponge_table_204', type: SPONGE, spriteKey: 'item_sponge_yellow', initialPos: { x: -310, y: -90 }, targetSlotId: 'table_wipe_slot_204', operation: OperationType.WIPE, sortOrder: 1 },
        { id: 'plate_204', type: PLATE, spriteKey: 'item_plate_white', initialPos: { x: -90, y: -115 }, targetSlotId: 'plate_slot_204', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'cup_204', type: CUP, spriteKey: 'item_cup_glass', initialPos: { x: 70, y: -105 }, targetSlotId: 'cup_slot_204', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'bowl_204', type: BOWL, spriteKey: 'item_bowl_clean', initialPos: { x: 230, y: -95 }, targetSlotId: 'bowl_slot_204', operation: OperationType.DRAG, sortOrder: 4 },
    ],
    slots: [
        { id: 'table_wipe_slot_204', pos: { x: -160, y: 20 }, acceptTypes: [SPONGE, COUNTER], size: { w: 220, h: 170 }, hintSprite: 'hint_wipe', label: '擦净餐桌污渍' },
        { id: 'plate_slot_204', pos: { x: 40, y: 180 }, acceptTypes: [PLATE], size: { w: 100, h: 90 }, hintSprite: 'hint_plate', label: '盘子入架' },
        { id: 'cup_slot_204', pos: { x: 170, y: 180 }, acceptTypes: [CUP], size: { w: 100, h: 90 }, hintSprite: 'hint_cup', label: '杯子归位' },
        { id: 'bowl_slot_204', pos: { x: 300, y: 180 }, acceptTypes: [BOWL], size: { w: 100, h: 90 }, hintSprite: 'hint_plate', label: '碗放回碗柜' },
    ],
    starThresholds: [52, 80, 100],
    isBoss: false,
    operations: [OperationType.WIPE, OperationType.DRAG],
    bgmKey: 'bgm_chapter2',
    rewards: { baseCoin: 110, toolFragments: 14 },
};

export const LEVEL_2_5: LevelDataConfig = {
    id: 205,
    chapter: 2,
    sceneName: 'kitchen',
    sceneDisplayName: '厨房清洁Boss',
    timeLimit: 120,
    items: [
        { id: 'boss_sponge_205', type: SPONGE, spriteKey: 'item_sponge_blue', initialPos: { x: -320, y: -95 }, targetSlotId: 'boss_wipe_slot_205', operation: OperationType.WIPE, sortOrder: 1 },
        { id: 'boss_plate_205', type: PLATE, spriteKey: 'item_plate_dirty', initialPos: { x: -120, y: -120 }, targetSlotId: 'boss_plate_slot_205', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'boss_bowl_205', type: BOWL, spriteKey: 'item_bowl_dirty', initialPos: { x: 20, y: -110 }, targetSlotId: 'boss_bowl_slot_205', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'boss_cup_205', type: CUP, spriteKey: 'item_cup_dirty', initialPos: { x: 160, y: -105 }, targetSlotId: 'boss_cup_slot_205', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'boss_bottle_205', type: BOTTLE, spriteKey: 'item_bottle_water', initialPos: { x: 300, y: -90 }, targetSlotId: 'boss_bottle_slot_205', operation: OperationType.DRAG, sortOrder: 5 },
    ],
    slots: [
        { id: 'boss_wipe_slot_205', pos: { x: -170, y: 30 }, acceptTypes: [SPONGE, COUNTER], size: { w: 250, h: 190 }, hintSprite: 'hint_wipe', label: '全面擦洗操作台' },
        { id: 'boss_plate_slot_205', pos: { x: 40, y: 205 }, acceptTypes: [PLATE], size: { w: 95, h: 90 }, hintSprite: 'hint_plate', label: '盘子归位' },
        { id: 'boss_bowl_slot_205', pos: { x: 145, y: 205 }, acceptTypes: [BOWL], size: { w: 95, h: 90 }, hintSprite: 'hint_plate', label: '碗归位' },
        { id: 'boss_cup_slot_205', pos: { x: 250, y: 205 }, acceptTypes: [CUP], size: { w: 95, h: 90 }, hintSprite: 'hint_cup', label: '杯子归位' },
        { id: 'boss_bottle_slot_205', pos: { x: 355, y: 205 }, acceptTypes: [BOTTLE], size: { w: 95, h: 90 }, hintSprite: 'hint_bottle', label: '瓶罐归位' },
    ],
    starThresholds: [58, 86, 100],
    isBoss: true,
    operations: [OperationType.WIPE, OperationType.DRAG],
    bgmKey: 'bgm_chapter2_boss',
    rewards: { baseCoin: 150, toolFragments: 20 },
};

export const CHAPTER_2_LEVELS: LevelDataConfig[] = [
    LEVEL_2_1,
    LEVEL_2_2,
    LEVEL_2_3,
    LEVEL_2_4,
    LEVEL_2_5,
];
