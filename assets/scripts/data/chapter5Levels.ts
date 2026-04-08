import { OperationType } from './LevelData';
import { LevelDataConfig, ITEM_TYPES } from './types';

const SPONGE = ITEM_TYPES.SPONGE;
const SHAMPOO = ITEM_TYPES.SHAMPOO;
const SOAP = ITEM_TYPES.SOAP;
const TOILET_PAPER = ITEM_TYPES.TOILET_PAPER;
const TOOTHBRUSH = ITEM_TYPES.TOOTHBRUSH;
const TOOTHPASTE = ITEM_TYPES.TOOTHPASTE;
const TOWEL_BATH = ITEM_TYPES.TOWEL_BATH;
const RAZOR = ITEM_TYPES.RAZOR;
const BATH_BOMB = ITEM_TYPES.BATH_BOMB;
const FLOSS = ITEM_TYPES.FLOSS;
const PIPE = ITEM_TYPES.PIPE;
const PIPE_ELBOW = ITEM_TYPES.PIPE_ELBOW;
const PIPE_TEE = ITEM_TYPES.PIPE_TEE;
const VALVE = ITEM_TYPES.VALVE;

export const LEVEL_5_1: LevelDataConfig = {
    id: 501,
    chapter: 5,
    sceneName: 'bathroom',
    sceneDisplayName: '洗手台去污',
    timeLimit: 85,
    items: [
        { id: 'bath_sponge_501', type: SPONGE, spriteKey: 'item_sponge_blue', initialPos: { x: -260, y: -90 }, targetSlotId: 'sink_dirty_zone', operation: OperationType.WIPE, sortOrder: 1 },
        { id: 'bath_toothbrush_501', type: TOOTHBRUSH, spriteKey: 'item_toothbrush_blue', initialPos: { x: -80, y: -110 }, targetSlotId: 'sink_brush_cup', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'bath_toothpaste_501', type: TOOTHPASTE, spriteKey: 'item_toothpaste_mint', initialPos: { x: 110, y: -100 }, targetSlotId: 'sink_tray', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'bath_soap_501', type: SOAP, spriteKey: 'item_soap_bar', initialPos: { x: 270, y: -80 }, targetSlotId: 'sink_soap_dish', operation: OperationType.DRAG, sortOrder: 4 },
    ],
    slots: [
        { id: 'sink_dirty_zone', pos: { x: -20, y: 80 }, acceptTypes: [SPONGE], size: { w: 250, h: 160 }, hintSprite: 'hint_wipe', label: '擦掉洗手台水渍与牙膏印' },
        { id: 'sink_brush_cup', pos: { x: -220, y: 205 }, acceptTypes: [TOOTHBRUSH], size: { w: 100, h: 90 }, hintSprite: 'hint_toothbrush', label: '牙刷竖直放回杯中' },
        { id: 'sink_tray', pos: { x: 10, y: 205 }, acceptTypes: [TOOTHPASTE, FLOSS], size: { w: 130, h: 80 }, hintSprite: 'hint_sort', label: '洗漱用品摆进托盘' },
        { id: 'sink_soap_dish', pos: { x: 235, y: 200 }, acceptTypes: [SOAP], size: { w: 100, h: 80 }, hintSprite: 'hint_soap', label: '香皂放回皂盒' },
    ],
    starThresholds: [55, 80, 100],
    isBoss: false,
    operations: [OperationType.WIPE, OperationType.DRAG],
    bgmKey: 'bgm_chapter5',
    rewards: { baseCoin: 120, toolFragments: 14 },
};

export const LEVEL_5_2: LevelDataConfig = {
    id: 502,
    chapter: 5,
    sceneName: 'bathroom',
    sceneDisplayName: '浴缸边归类',
    timeLimit: 90,
    items: [
        { id: 'bath_shampoo_502', type: SHAMPOO, spriteKey: 'item_shampoo_green', initialPos: { x: -300, y: -120 }, targetSlotId: 'tub_bottle_rack', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'bath_soap_liquid_502', type: SOAP, spriteKey: 'item_soap_liquid', initialPos: { x: -130, y: -80 }, targetSlotId: 'tub_bottle_rack', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'bath_bomb_502', type: BATH_BOMB, spriteKey: 'item_bath_bomb_pink', initialPos: { x: 40, y: -110 }, targetSlotId: 'tub_basket', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'bath_towel_502', type: TOWEL_BATH, spriteKey: 'item_towel_bath_blue', initialPos: { x: 210, y: -90 }, targetSlotId: 'towel_rack_right', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'bath_sponge_502', type: SPONGE, spriteKey: 'item_sponge_yellow', initialPos: { x: 320, y: -70 }, targetSlotId: 'tub_stain_zone', operation: OperationType.WIPE, sortOrder: 5 },
    ],
    slots: [
        { id: 'tub_bottle_rack', pos: { x: -180, y: 210 }, acceptTypes: [SHAMPOO, SOAP], size: { w: 160, h: 90 }, hintSprite: 'hint_bottle', label: '洗浴瓶罐集中上架' },
        { id: 'tub_basket', pos: { x: 35, y: 200 }, acceptTypes: [BATH_BOMB], size: { w: 110, h: 90 }, hintSprite: 'hint_sort', label: '浴球放入收纳篮' },
        { id: 'towel_rack_right', pos: { x: 250, y: 205 }, acceptTypes: [TOWEL_BATH], size: { w: 120, h: 90 }, hintSprite: 'hint_towel', label: '浴巾挂回右侧杆架' },
        { id: 'tub_stain_zone', pos: { x: 40, y: 55 }, acceptTypes: [SPONGE], size: { w: 280, h: 150 }, hintSprite: 'hint_wipe', label: '擦净浴缸边缘皂垢' },
    ],
    starThresholds: [58, 82, 100],
    isBoss: false,
    operations: [OperationType.DRAG, OperationType.WIPE],
    bgmKey: 'bgm_chapter5',
    rewards: { baseCoin: 125, toolFragments: 15 },
};

export const LEVEL_5_3: LevelDataConfig = {
    id: 503,
    chapter: 5,
    sceneName: 'bathroom',
    sceneDisplayName: '下水管试装',
    timeLimit: 95,
    items: [
        { id: 'pipe_straight_a_503', type: PIPE, spriteKey: 'item_pipe_straight', initialPos: { x: -280, y: -110 }, targetSlotId: 'pipe_path_top', operation: OperationType.ROTATE, sortOrder: 1 },
        { id: 'pipe_elbow_a_503', type: PIPE_ELBOW, spriteKey: 'item_pipe_elbow', initialPos: { x: -100, y: -90 }, targetSlotId: 'pipe_path_turn', operation: OperationType.ROTATE, sortOrder: 2 },
        { id: 'pipe_straight_b_503', type: PIPE, spriteKey: 'item_pipe_straight_short', initialPos: { x: 90, y: -105 }, targetSlotId: 'pipe_path_bottom', operation: OperationType.ROTATE, sortOrder: 3 },
        { id: 'valve_503', type: VALVE, spriteKey: 'item_valve_blue', initialPos: { x: 280, y: -85 }, targetSlotId: 'pipe_valve_slot', operation: OperationType.DRAG, sortOrder: 4 },
    ],
    slots: [
        { id: 'pipe_path_top', pos: { x: -180, y: 170 }, acceptTypes: [PIPE], size: { w: 120, h: 80 }, hintSprite: 'hint_pipe', label: '先接好上方直管' },
        { id: 'pipe_path_turn', pos: { x: -20, y: 90 }, acceptTypes: [PIPE_ELBOW, PIPE_TEE], size: { w: 110, h: 110 }, hintSprite: 'hint_rotate', label: '旋转弯头对准转角' },
        { id: 'pipe_path_bottom', pos: { x: 150, y: 10 }, acceptTypes: [PIPE], size: { w: 120, h: 80 }, hintSprite: 'hint_pipe', label: '接上下行直管' },
        { id: 'pipe_valve_slot', pos: { x: 275, y: 165 }, acceptTypes: [VALVE], size: { w: 100, h: 80 }, hintSprite: 'hint_valve', label: '阀门装回供水口' },
    ],
    starThresholds: [60, 84, 100],
    isBoss: false,
    operations: [OperationType.ROTATE, OperationType.DRAG],
    bgmKey: 'bgm_chapter5',
    rewards: { baseCoin: 130, toolFragments: 16 },
};

export const LEVEL_5_4: LevelDataConfig = {
    id: 504,
    chapter: 5,
    sceneName: 'bathroom',
    sceneDisplayName: '镜柜与排水整理',
    timeLimit: 110,
    items: [
        { id: 'bath_sponge_504', type: SPONGE, spriteKey: 'item_sponge_green', initialPos: { x: -320, y: -120 }, targetSlotId: 'mirror_dirty_zone', operation: OperationType.WIPE, sortOrder: 1 },
        { id: 'floss_504', type: FLOSS, spriteKey: 'item_floss_box', initialPos: { x: -150, y: -85 }, targetSlotId: 'mirror_small_tray', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'razor_504', type: RAZOR, spriteKey: 'item_razor_silver', initialPos: { x: 0, y: -105 }, targetSlotId: 'mirror_small_tray', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'pipe_tee_504', type: PIPE_TEE, spriteKey: 'item_pipe_tee', initialPos: { x: 160, y: -95 }, targetSlotId: 'drain_joint_slot', operation: OperationType.ROTATE, sortOrder: 4 },
        { id: 'pipe_straight_504', type: PIPE, spriteKey: 'item_pipe_straight', initialPos: { x: 320, y: -75 }, targetSlotId: 'drain_output_slot', operation: OperationType.ROTATE, sortOrder: 5 },
    ],
    slots: [
        { id: 'mirror_dirty_zone', pos: { x: -40, y: 130 }, acceptTypes: [SPONGE], size: { w: 260, h: 160 }, hintSprite: 'hint_wipe', label: '镜柜门上的水痕要擦干净' },
        { id: 'mirror_small_tray', pos: { x: -215, y: 210 }, acceptTypes: [FLOSS, RAZOR, TOOTHPASTE], size: { w: 170, h: 80 }, hintSprite: 'hint_sort', label: '小件洗漱品归入左侧托盘' },
        { id: 'drain_joint_slot', pos: { x: 135, y: 95 }, acceptTypes: [PIPE_TEE, PIPE_ELBOW], size: { w: 120, h: 110 }, hintSprite: 'hint_rotate', label: '三通旋到正确朝向' },
        { id: 'drain_output_slot', pos: { x: 280, y: 15 }, acceptTypes: [PIPE], size: { w: 120, h: 80 }, hintSprite: 'hint_pipe', label: '排水直管接到出水端' },
    ],
    starThresholds: [64, 86, 100],
    isBoss: false,
    operations: [OperationType.WIPE, OperationType.DRAG, OperationType.ROTATE],
    bgmKey: 'bgm_chapter5',
    rewards: { baseCoin: 140, toolFragments: 18 },
};

export const LEVEL_5_5: LevelDataConfig = {
    id: 505,
    chapter: 5,
    sceneName: 'bathroom',
    sceneDisplayName: '乱糟糟浴室 Boss 关',
    timeLimit: 150,
    items: [
        { id: 'boss_sponge_505', type: SPONGE, spriteKey: 'item_sponge_blue', initialPos: { x: -330, y: -130 }, targetSlotId: 'boss_sink_stain', operation: OperationType.WIPE, sortOrder: 1 },
        { id: 'boss_toothbrush_505', type: TOOTHBRUSH, spriteKey: 'item_toothbrush_pink', initialPos: { x: -220, y: -80 }, targetSlotId: 'boss_brush_holder', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'boss_toothpaste_505', type: TOOTHPASTE, spriteKey: 'item_toothpaste_mint', initialPos: { x: -90, y: -120 }, targetSlotId: 'boss_sink_tray', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'boss_floss_505', type: FLOSS, spriteKey: 'item_floss_box', initialPos: { x: 20, y: -70 }, targetSlotId: 'boss_sink_tray', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'boss_shampoo_505', type: SHAMPOO, spriteKey: 'item_shampoo_blue', initialPos: { x: 130, y: -125 }, targetSlotId: 'boss_bottle_rack', operation: OperationType.DRAG, sortOrder: 5 },
        { id: 'boss_soap_505', type: SOAP, spriteKey: 'item_soap_liquid', initialPos: { x: 250, y: -80 }, targetSlotId: 'boss_bottle_rack', operation: OperationType.DRAG, sortOrder: 6 },
        { id: 'boss_towel_505', type: TOWEL_BATH, spriteKey: 'item_towel_bath_white', initialPos: { x: 340, y: -120 }, targetSlotId: 'boss_towel_rack', operation: OperationType.DRAG, sortOrder: 7 },
        { id: 'boss_razor_505', type: RAZOR, spriteKey: 'item_razor_black', initialPos: { x: -280, y: 5 }, targetSlotId: 'boss_small_tray', operation: OperationType.DRAG, sortOrder: 8 },
        { id: 'boss_bomb_505', type: BATH_BOMB, spriteKey: 'item_bath_bomb_blue', initialPos: { x: -140, y: 15 }, targetSlotId: 'boss_tub_basket', operation: OperationType.DRAG, sortOrder: 9 },
        { id: 'boss_pipe_top_505', type: PIPE, spriteKey: 'item_pipe_straight', initialPos: { x: -10, y: 10 }, targetSlotId: 'boss_pipe_top', operation: OperationType.ROTATE, sortOrder: 10 },
        { id: 'boss_pipe_elbow_505', type: PIPE_ELBOW, spriteKey: 'item_pipe_elbow', initialPos: { x: 120, y: 10 }, targetSlotId: 'boss_pipe_turn', operation: OperationType.ROTATE, sortOrder: 11 },
        { id: 'boss_pipe_tee_505', type: PIPE_TEE, spriteKey: 'item_pipe_tee', initialPos: { x: 250, y: 15 }, targetSlotId: 'boss_pipe_joint', operation: OperationType.ROTATE, sortOrder: 12 },
        { id: 'boss_valve_505', type: VALVE, spriteKey: 'item_valve_red', initialPos: { x: 350, y: 10 }, targetSlotId: 'boss_valve_slot', operation: OperationType.DRAG, sortOrder: 13 },
    ],
    slots: [
        { id: 'boss_sink_stain', pos: { x: -40, y: 110 }, acceptTypes: [SPONGE], size: { w: 290, h: 170 }, hintSprite: 'hint_wipe', label: '先把洗手台和镜前水痕全部擦净' },
        { id: 'boss_brush_holder', pos: { x: -250, y: 220 }, acceptTypes: [TOOTHBRUSH], size: { w: 100, h: 85 }, hintSprite: 'hint_toothbrush', label: '牙刷回到杯架' },
        { id: 'boss_sink_tray', pos: { x: -70, y: 220 }, acceptTypes: [TOOTHPASTE, FLOSS], size: { w: 150, h: 80 }, hintSprite: 'hint_sort', label: '牙膏与牙线并排进托盘' },
        { id: 'boss_bottle_rack', pos: { x: 150, y: 220 }, acceptTypes: [SHAMPOO, SOAP], size: { w: 160, h: 90 }, hintSprite: 'hint_bottle', label: '瓶罐集中摆上浴缸架' },
        { id: 'boss_towel_rack', pos: { x: 325, y: 215 }, acceptTypes: [TOWEL_BATH], size: { w: 110, h: 90 }, hintSprite: 'hint_towel', label: '浴巾挂回右侧杆架' },
        { id: 'boss_small_tray', pos: { x: -260, y: 95 }, acceptTypes: [RAZOR], size: { w: 100, h: 80 }, hintSprite: 'hint_sort', label: '剃须刀放进安全托盘' },
        { id: 'boss_tub_basket', pos: { x: -115, y: 85 }, acceptTypes: [BATH_BOMB], size: { w: 100, h: 80 }, hintSprite: 'hint_sort', label: '浴球放回收纳篮' },
        { id: 'boss_pipe_top', pos: { x: 20, y: 95 }, acceptTypes: [PIPE], size: { w: 120, h: 80 }, hintSprite: 'hint_pipe', label: '接通上方进水直管' },
        { id: 'boss_pipe_turn', pos: { x: 145, y: 25 }, acceptTypes: [PIPE_ELBOW], size: { w: 110, h: 110 }, hintSprite: 'hint_rotate', label: '弯头旋转后对准下方接口' },
        { id: 'boss_pipe_joint', pos: { x: 255, y: 95 }, acceptTypes: [PIPE_TEE], size: { w: 120, h: 110 }, hintSprite: 'hint_rotate', label: '三通接好洗手台与浴缸分支' },
        { id: 'boss_valve_slot', pos: { x: 345, y: 150 }, acceptTypes: [VALVE], size: { w: 100, h: 80 }, hintSprite: 'hint_valve', label: '最后装回总阀门' },
    ],
    starThresholds: [70, 90, 100],
    isBoss: true,
    operations: [OperationType.WIPE, OperationType.DRAG, OperationType.ROTATE],
    bgmKey: 'bgm_chapter5_boss',
    rewards: { baseCoin: 220, toolFragments: 30 },
};

export const CHAPTER_5_LEVELS: LevelDataConfig[] = [
    LEVEL_5_1,
    LEVEL_5_2,
    LEVEL_5_3,
    LEVEL_5_4,
    LEVEL_5_5,
];
