import { OperationType } from './LevelData';
import { LevelDataConfig, ITEM_TYPES } from './types';

const BOOK = ITEM_TYPES.BOOK;
const PEN = ITEM_TYPES.PEN;
const CLOTH = ITEM_TYPES.CLOTH;
const TOWEL = ITEM_TYPES.TOWEL;
const SPONGE = ITEM_TYPES.SPONGE;
const BOTTLE = ITEM_TYPES.BOTTLE;
const TOY = ITEM_TYPES.TOY;
const DAIRY = ITEM_TYPES.DAIRY;
const DRINK = ITEM_TYPES.DRINK;
const FRUIT = ITEM_TYPES.FRUIT;
const LEFTOVER = ITEM_TYPES.LEFTOVER;
const TOOTHBRUSH = ITEM_TYPES.TOOTHBRUSH;
const TOOTHPASTE = ITEM_TYPES.TOOTHPASTE;
const SHAMPOO = ITEM_TYPES.SHAMPOO;
const SOAP = ITEM_TYPES.SOAP;
const TOWEL_BATH = ITEM_TYPES.TOWEL_BATH;
const RAZOR = ITEM_TYPES.RAZOR;
const FLOSS = ITEM_TYPES.FLOSS;
const PIPE = ITEM_TYPES.PIPE;
const PIPE_ELBOW = ITEM_TYPES.PIPE_ELBOW;
const PIPE_TEE = ITEM_TYPES.PIPE_TEE;
const VALVE = ITEM_TYPES.VALVE;

export const LEVEL_6_1: LevelDataConfig = {
    id: 601,
    chapter: 6,
    sceneName: 'studio_mix',
    sceneDisplayName: '客厅书角混合整理',
    timeLimit: 95,
    items: [
        { id: 'book_blue_601', type: BOOK, spriteKey: 'item_book_blue', initialPos: { x: -320, y: -120 }, targetSlotId: 'mix_bookshelf_left', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'book_red_601', type: BOOK, spriteKey: 'item_book_red', initialPos: { x: -180, y: -80 }, targetSlotId: 'mix_bookshelf_right', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'pen_blue_601', type: PEN, spriteKey: 'item_pen_blue', initialPos: { x: -20, y: -110 }, targetSlotId: 'mix_pen_holder', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'dust_cloth_601', type: SPONGE, spriteKey: 'item_sponge_green', initialPos: { x: 160, y: -100 }, targetSlotId: 'mix_sideboard_wipe', operation: OperationType.WIPE, sortOrder: 4 },
        { id: 'throw_blanket_601', type: TOWEL, spriteKey: 'item_towel_small', initialPos: { x: 320, y: -90 }, targetSlotId: 'mix_blanket_fold', operation: OperationType.FOLD, sortOrder: 5 },
    ],
    slots: [
        { id: 'mix_bookshelf_left', pos: { x: -260, y: 210 }, acceptTypes: [BOOK], size: { w: 90, h: 110 }, hintSprite: 'hint_book', label: '蓝色书本放回左层' },
        { id: 'mix_bookshelf_right', pos: { x: -120, y: 210 }, acceptTypes: [BOOK], size: { w: 90, h: 110 }, hintSprite: 'hint_book', label: '红色书本摆到右层' },
        { id: 'mix_pen_holder', pos: { x: 20, y: 205 }, acceptTypes: [PEN], size: { w: 110, h: 80 }, hintSprite: 'hint_pen', label: '签字笔插回笔筒' },
        { id: 'mix_sideboard_wipe', pos: { x: 175, y: 80 }, acceptTypes: [SPONGE], size: { w: 220, h: 140 }, hintSprite: 'hint_wipe', label: '擦净边柜灰尘与水杯印' },
        { id: 'mix_blanket_fold', pos: { x: 320, y: 205 }, acceptTypes: [TOWEL, CLOTH], size: { w: 120, h: 90 }, hintSprite: 'hint_fold', label: '将沙发毯折好放齐' },
    ],
    starThresholds: [58, 82, 100],
    isBoss: false,
    operations: [OperationType.DRAG, OperationType.WIPE, OperationType.FOLD],
    bgmKey: 'bgm_chapter6',
    rewards: { baseCoin: 145, toolFragments: 16 },
};

export const LEVEL_6_2: LevelDataConfig = {
    id: 602,
    chapter: 6,
    sceneName: 'utility_room',
    sceneDisplayName: '清洁间工具联动',
    timeLimit: 105,
    items: [
        { id: 'pipe_straight_602', type: PIPE, spriteKey: 'item_pipe_straight', initialPos: { x: -310, y: -120 }, targetSlotId: 'utility_pipe_top', operation: OperationType.ROTATE, sortOrder: 1 },
        { id: 'pipe_elbow_602', type: PIPE_ELBOW, spriteKey: 'item_pipe_elbow', initialPos: { x: -150, y: -85 }, targetSlotId: 'utility_pipe_turn', operation: OperationType.ROTATE, sortOrder: 2 },
        { id: 'valve_602', type: VALVE, spriteKey: 'item_valve_blue', initialPos: { x: 10, y: -110 }, targetSlotId: 'utility_valve_slot', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'sponge_602', type: SPONGE, spriteKey: 'item_sponge_yellow', initialPos: { x: 170, y: -90 }, targetSlotId: 'utility_leak_wipe', operation: OperationType.WIPE, sortOrder: 4 },
        { id: 'rag_602', type: CLOTH, spriteKey: 'item_cloth_dusty', initialPos: { x: 320, y: -75 }, targetSlotId: 'utility_rag_fold', operation: OperationType.FOLD, sortOrder: 5 },
    ],
    slots: [
        { id: 'utility_pipe_top', pos: { x: -220, y: 175 }, acceptTypes: [PIPE], size: { w: 120, h: 80 }, hintSprite: 'hint_pipe', label: '先接好上段直管' },
        { id: 'utility_pipe_turn', pos: { x: -70, y: 90 }, acceptTypes: [PIPE_ELBOW, PIPE_TEE], size: { w: 110, h: 110 }, hintSprite: 'hint_rotate', label: '弯头旋转后对齐接口' },
        { id: 'utility_valve_slot', pos: { x: 90, y: 180 }, acceptTypes: [VALVE], size: { w: 100, h: 80 }, hintSprite: 'hint_valve', label: '阀门装回墙面供水口' },
        { id: 'utility_leak_wipe', pos: { x: 160, y: 55 }, acceptTypes: [SPONGE], size: { w: 230, h: 150 }, hintSprite: 'hint_wipe', label: '擦掉地面渗水痕迹' },
        { id: 'utility_rag_fold', pos: { x: 300, y: 205 }, acceptTypes: [CLOTH, TOWEL], size: { w: 110, h: 90 }, hintSprite: 'hint_fold', label: '抹布折好收入工具架' },
    ],
    starThresholds: [60, 84, 100],
    isBoss: false,
    operations: [OperationType.ROTATE, OperationType.DRAG, OperationType.WIPE, OperationType.FOLD],
    bgmKey: 'bgm_chapter6',
    rewards: { baseCoin: 155, toolFragments: 18 },
};

export const LEVEL_6_3: LevelDataConfig = {
    id: 603,
    chapter: 6,
    sceneName: 'family_room',
    sceneDisplayName: '亲子区快速收尾',
    timeLimit: 110,
    items: [
        { id: 'toy_car_603', type: TOY, spriteKey: 'item_toy_car', initialPos: { x: -320, y: -125 }, targetSlotId: 'family_toy_box', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'book_yellow_603', type: BOOK, spriteKey: 'item_book_yellow', initialPos: { x: -160, y: -90 }, targetSlotId: 'family_book_basket', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'blanket_603', type: TOWEL, spriteKey: 'item_towel_clean', initialPos: { x: 0, y: -110 }, targetSlotId: 'family_blanket_fold', operation: OperationType.FOLD, sortOrder: 3 },
        { id: 'bottle_water_603', type: BOTTLE, spriteKey: 'item_bottle_water', initialPos: { x: 170, y: -85 }, targetSlotId: 'family_bottle_rack', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'sponge_603', type: SPONGE, spriteKey: 'item_sponge_blue', initialPos: { x: 320, y: -80 }, targetSlotId: 'family_table_wipe', operation: OperationType.WIPE, sortOrder: 5 },
    ],
    slots: [
        { id: 'family_toy_box', pos: { x: -255, y: 205 }, acceptTypes: [TOY], size: { w: 110, h: 90 }, hintSprite: 'hint_toy', label: '玩具车回到收纳盒' },
        { id: 'family_book_basket', pos: { x: -110, y: 205 }, acceptTypes: [BOOK], size: { w: 110, h: 90 }, hintSprite: 'hint_book', label: '绘本放进阅读篮' },
        { id: 'family_blanket_fold', pos: { x: 35, y: 205 }, acceptTypes: [TOWEL, CLOTH], size: { w: 120, h: 90 }, hintSprite: 'hint_fold', label: '游戏垫小毯折叠整齐' },
        { id: 'family_bottle_rack', pos: { x: 200, y: 205 }, acceptTypes: [BOTTLE, DRINK], size: { w: 120, h: 90 }, hintSprite: 'hint_bottle', label: '水瓶竖直放回架子' },
        { id: 'family_table_wipe', pos: { x: 205, y: 80 }, acceptTypes: [SPONGE], size: { w: 240, h: 140 }, hintSprite: 'hint_wipe', label: '把涂鸦桌表面擦干净' },
    ],
    starThresholds: [62, 86, 100],
    isBoss: false,
    operations: [OperationType.DRAG, OperationType.FOLD, OperationType.WIPE],
    bgmKey: 'bgm_chapter6',
    rewards: { baseCoin: 160, toolFragments: 18 },
};

export const LEVEL_6_4: LevelDataConfig = {
    id: 604,
    chapter: 6,
    sceneName: 'kitchen_bath_mix',
    sceneDisplayName: '厨卫补给穿梭',
    timeLimit: 120,
    items: [
        { id: 'milk_604', type: DAIRY, spriteKey: 'item_milk_pack', initialPos: { x: -330, y: -130 }, targetSlotId: 'mix_fridge_dairy', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'orange_604', type: FRUIT, spriteKey: 'item_orange', initialPos: { x: -180, y: -80 }, targetSlotId: 'mix_fridge_fruit', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'toothbrush_604', type: TOOTHBRUSH, spriteKey: 'item_toothbrush_blue', initialPos: { x: -20, y: -120 }, targetSlotId: 'mix_sink_brush', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'toothpaste_604', type: TOOTHPASTE, spriteKey: 'item_toothpaste_mint', initialPos: { x: 130, y: -90 }, targetSlotId: 'mix_sink_tray', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'sponge_604', type: SPONGE, spriteKey: 'item_sponge_green', initialPos: { x: 290, y: -110 }, targetSlotId: 'mix_counter_wipe', operation: OperationType.WIPE, sortOrder: 5 },
    ],
    slots: [
        { id: 'mix_fridge_dairy', pos: { x: -245, y: 205 }, acceptTypes: [DAIRY], size: { w: 120, h: 90 }, hintSprite: 'hint_dairy', label: '牛奶先放回冷藏层' },
        { id: 'mix_fridge_fruit', pos: { x: -95, y: 205 }, acceptTypes: [FRUIT], size: { w: 120, h: 90 }, hintSprite: 'hint_fruit', label: '水果归入保鲜盒' },
        { id: 'mix_sink_brush', pos: { x: 80, y: 205 }, acceptTypes: [TOOTHBRUSH], size: { w: 100, h: 85 }, hintSprite: 'hint_toothbrush', label: '牙刷立回杯架' },
        { id: 'mix_sink_tray', pos: { x: 220, y: 205 }, acceptTypes: [TOOTHPASTE, FLOSS], size: { w: 130, h: 80 }, hintSprite: 'hint_sort', label: '牙膏平放进托盘' },
        { id: 'mix_counter_wipe', pos: { x: 170, y: 70 }, acceptTypes: [SPONGE], size: { w: 260, h: 150 }, hintSprite: 'hint_wipe', label: '顺手擦净台面水渍' },
    ],
    starThresholds: [64, 87, 100],
    isBoss: false,
    operations: [OperationType.DRAG, OperationType.WIPE],
    bgmKey: 'bgm_chapter6',
    rewards: { baseCoin: 165, toolFragments: 19 },
};

export const LEVEL_6_5: LevelDataConfig = {
    id: 605,
    chapter: 6,
    sceneName: 'master_suite',
    sceneDisplayName: '卧室与卫浴联整',
    timeLimit: 125,
    items: [
        { id: 'shirt_605', type: CLOTH, spriteKey: 'item_shirt_tshirt', initialPos: { x: -320, y: -125 }, targetSlotId: 'suite_cloth_fold', operation: OperationType.FOLD, sortOrder: 1 },
        { id: 'towel_605', type: TOWEL_BATH, spriteKey: 'item_towel_bath_blue', initialPos: { x: -160, y: -95 }, targetSlotId: 'suite_towel_rack', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'shampoo_605', type: SHAMPOO, spriteKey: 'item_shampoo_green', initialPos: { x: 0, y: -120 }, targetSlotId: 'suite_bottle_rack', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'soap_605', type: SOAP, spriteKey: 'item_soap_bar', initialPos: { x: 155, y: -90 }, targetSlotId: 'suite_bottle_rack', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'sponge_605', type: SPONGE, spriteKey: 'item_sponge_yellow', initialPos: { x: 315, y: -85 }, targetSlotId: 'suite_mirror_wipe', operation: OperationType.WIPE, sortOrder: 5 },
    ],
    slots: [
        { id: 'suite_cloth_fold', pos: { x: -255, y: 210 }, acceptTypes: [CLOTH], size: { w: 110, h: 90 }, hintSprite: 'hint_fold', label: '睡衣折好放进收纳格' },
        { id: 'suite_towel_rack', pos: { x: -85, y: 210 }, acceptTypes: [TOWEL_BATH, TOWEL], size: { w: 120, h: 90 }, hintSprite: 'hint_towel', label: '浴巾挂回毛巾架' },
        { id: 'suite_bottle_rack', pos: { x: 140, y: 210 }, acceptTypes: [SHAMPOO, SOAP], size: { w: 160, h: 90 }, hintSprite: 'hint_bottle', label: '洗浴用品并排归位' },
        { id: 'suite_mirror_wipe', pos: { x: 220, y: 80 }, acceptTypes: [SPONGE], size: { w: 240, h: 150 }, hintSprite: 'hint_wipe', label: '擦掉镜前雾痕和水点' },
    ],
    starThresholds: [65, 88, 100],
    isBoss: false,
    operations: [OperationType.FOLD, OperationType.DRAG, OperationType.WIPE],
    bgmKey: 'bgm_chapter6',
    rewards: { baseCoin: 170, toolFragments: 20 },
};

export const LEVEL_6_6: LevelDataConfig = {
    id: 606,
    chapter: 6,
    sceneName: 'pantry_mix',
    sceneDisplayName: '储物柜复合收纳',
    timeLimit: 130,
    items: [
        { id: 'juice_606', type: DRINK, spriteKey: 'item_juice_box', initialPos: { x: -320, y: -125 }, targetSlotId: 'pantry_drink_row', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'leftover_606', type: LEFTOVER, spriteKey: 'item_leftover_box', initialPos: { x: -165, y: -90 }, targetSlotId: 'pantry_leftover_box', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'cloth_606', type: CLOTH, spriteKey: 'item_cloth_dusty', initialPos: { x: -10, y: -115 }, targetSlotId: 'pantry_cloth_fold', operation: OperationType.FOLD, sortOrder: 3 },
        { id: 'pipe_tee_606', type: PIPE_TEE, spriteKey: 'item_pipe_tee', initialPos: { x: 150, y: -95 }, targetSlotId: 'pantry_pipe_joint', operation: OperationType.ROTATE, sortOrder: 4 },
        { id: 'sponge_606', type: SPONGE, spriteKey: 'item_sponge_blue', initialPos: { x: 315, y: -80 }, targetSlotId: 'pantry_floor_wipe', operation: OperationType.WIPE, sortOrder: 5 },
    ],
    slots: [
        { id: 'pantry_drink_row', pos: { x: -255, y: 205 }, acceptTypes: [DRINK], size: { w: 130, h: 85 }, hintSprite: 'hint_drink', label: '饮料摆入上层补给架' },
        { id: 'pantry_leftover_box', pos: { x: -100, y: 205 }, acceptTypes: [LEFTOVER], size: { w: 130, h: 85 }, hintSprite: 'hint_leftover', label: '保鲜盒收入密封格' },
        { id: 'pantry_cloth_fold', pos: { x: 35, y: 205 }, acceptTypes: [CLOTH, TOWEL], size: { w: 110, h: 90 }, hintSprite: 'hint_fold', label: '围裙折好压平' },
        { id: 'pantry_pipe_joint', pos: { x: 175, y: 90 }, acceptTypes: [PIPE_TEE, PIPE_ELBOW], size: { w: 120, h: 110 }, hintSprite: 'hint_rotate', label: '接好储物柜下方三通' },
        { id: 'pantry_floor_wipe', pos: { x: 235, y: 45 }, acceptTypes: [SPONGE], size: { w: 240, h: 150 }, hintSprite: 'hint_wipe', label: '擦净角落残留水渍' },
    ],
    starThresholds: [66, 89, 100],
    isBoss: false,
    operations: [OperationType.DRAG, OperationType.FOLD, OperationType.ROTATE, OperationType.WIPE],
    bgmKey: 'bgm_chapter6',
    rewards: { baseCoin: 175, toolFragments: 21 },
};

export const LEVEL_6_7: LevelDataConfig = {
    id: 607,
    chapter: 6,
    sceneName: 'compact_bath',
    sceneDisplayName: '紧凑卫浴极限整理',
    timeLimit: 135,
    items: [
        { id: 'razor_607', type: RAZOR, spriteKey: 'item_razor_black', initialPos: { x: -320, y: -125 }, targetSlotId: 'compact_safe_tray', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'floss_607', type: FLOSS, spriteKey: 'item_floss_box', initialPos: { x: -170, y: -90 }, targetSlotId: 'compact_sink_tray', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'pipe_straight_607', type: PIPE, spriteKey: 'item_pipe_straight_short', initialPos: { x: -20, y: -110 }, targetSlotId: 'compact_pipe_bottom', operation: OperationType.ROTATE, sortOrder: 3 },
        { id: 'valve_607', type: VALVE, spriteKey: 'item_valve_red', initialPos: { x: 140, y: -85 }, targetSlotId: 'compact_valve_slot', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'sponge_607', type: SPONGE, spriteKey: 'item_sponge_green', initialPos: { x: 310, y: -80 }, targetSlotId: 'compact_sink_wipe', operation: OperationType.WIPE, sortOrder: 5 },
    ],
    slots: [
        { id: 'compact_safe_tray', pos: { x: -255, y: 205 }, acceptTypes: [RAZOR], size: { w: 100, h: 80 }, hintSprite: 'hint_sort', label: '剃须刀放进安全托盘' },
        { id: 'compact_sink_tray', pos: { x: -105, y: 205 }, acceptTypes: [FLOSS, TOOTHPASTE], size: { w: 130, h: 80 }, hintSprite: 'hint_sort', label: '牙线归入洗手台托盘' },
        { id: 'compact_pipe_bottom', pos: { x: 80, y: 80 }, acceptTypes: [PIPE], size: { w: 120, h: 80 }, hintSprite: 'hint_pipe', label: '短直管旋正接入底部' },
        { id: 'compact_valve_slot', pos: { x: 210, y: 165 }, acceptTypes: [VALVE], size: { w: 100, h: 80 }, hintSprite: 'hint_valve', label: '把阀门装回角阀口' },
        { id: 'compact_sink_wipe', pos: { x: 200, y: 55 }, acceptTypes: [SPONGE], size: { w: 250, h: 150 }, hintSprite: 'hint_wipe', label: '擦净狭小洗手池边缘' },
    ],
    starThresholds: [68, 90, 100],
    isBoss: false,
    operations: [OperationType.DRAG, OperationType.ROTATE, OperationType.WIPE],
    bgmKey: 'bgm_chapter6',
    rewards: { baseCoin: 180, toolFragments: 22 },
};

export const LEVEL_6_8: LevelDataConfig = {
    id: 608,
    chapter: 6,
    sceneName: 'entryway_mix',
    sceneDisplayName: '玄关脏乱综合处理',
    timeLimit: 140,
    items: [
        { id: 'book_608', type: BOOK, spriteKey: 'item_book_purple', initialPos: { x: -320, y: -125 }, targetSlotId: 'entry_book_shelf', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'towel_608', type: TOWEL, spriteKey: 'item_towel_hand', initialPos: { x: -160, y: -90 }, targetSlotId: 'entry_towel_fold', operation: OperationType.FOLD, sortOrder: 2 },
        { id: 'bottle_608', type: BOTTLE, spriteKey: 'item_water_bottle', initialPos: { x: -10, y: -115 }, targetSlotId: 'entry_bottle_rack', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'sponge_608', type: SPONGE, spriteKey: 'item_sponge_yellow', initialPos: { x: 150, y: -90 }, targetSlotId: 'entry_bench_wipe', operation: OperationType.WIPE, sortOrder: 4 },
        { id: 'pipe_elbow_608', type: PIPE_ELBOW, spriteKey: 'item_pipe_elbow', initialPos: { x: 320, y: -80 }, targetSlotId: 'entry_pipe_turn', operation: OperationType.ROTATE, sortOrder: 5 },
    ],
    slots: [
        { id: 'entry_book_shelf', pos: { x: -255, y: 205 }, acceptTypes: [BOOK], size: { w: 100, h: 90 }, hintSprite: 'hint_book', label: '便签本塞回玄关格架' },
        { id: 'entry_towel_fold', pos: { x: -105, y: 205 }, acceptTypes: [TOWEL, CLOTH], size: { w: 110, h: 90 }, hintSprite: 'hint_fold', label: '擦鞋巾折好收进抽屉' },
        { id: 'entry_bottle_rack', pos: { x: 45, y: 205 }, acceptTypes: [BOTTLE, DRINK], size: { w: 120, h: 90 }, hintSprite: 'hint_bottle', label: '随身水瓶放回立架' },
        { id: 'entry_bench_wipe', pos: { x: 175, y: 70 }, acceptTypes: [SPONGE], size: { w: 230, h: 140 }, hintSprite: 'hint_wipe', label: '鞋凳表面泥点要擦净' },
        { id: 'entry_pipe_turn', pos: { x: 305, y: 95 }, acceptTypes: [PIPE_ELBOW, PIPE_TEE], size: { w: 120, h: 110 }, hintSprite: 'hint_rotate', label: '雨伞烘干管道转角接正' },
    ],
    starThresholds: [69, 91, 100],
    isBoss: false,
    operations: [OperationType.DRAG, OperationType.FOLD, OperationType.WIPE, OperationType.ROTATE],
    bgmKey: 'bgm_chapter6',
    rewards: { baseCoin: 185, toolFragments: 22 },
};

export const LEVEL_6_9: LevelDataConfig = {
    id: 609,
    chapter: 6,
    sceneName: 'double_station',
    sceneDisplayName: '双工位同步收纳',
    timeLimit: 145,
    items: [
        { id: 'pen_609', type: PEN, spriteKey: 'item_pen_red', initialPos: { x: -320, y: -125 }, targetSlotId: 'double_pen_holder', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'shirt_609', type: CLOTH, spriteKey: 'item_shirt_pants', initialPos: { x: -170, y: -90 }, targetSlotId: 'double_cloth_fold', operation: OperationType.FOLD, sortOrder: 2 },
        { id: 'shampoo_609', type: SHAMPOO, spriteKey: 'item_shampoo_blue', initialPos: { x: -10, y: -115 }, targetSlotId: 'double_bath_rack', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'pipe_609', type: PIPE, spriteKey: 'item_pipe_straight', initialPos: { x: 150, y: -90 }, targetSlotId: 'double_pipe_top', operation: OperationType.ROTATE, sortOrder: 4 },
        { id: 'sponge_609', type: SPONGE, spriteKey: 'item_sponge_blue', initialPos: { x: 315, y: -80 }, targetSlotId: 'double_desk_wipe', operation: OperationType.WIPE, sortOrder: 5 },
    ],
    slots: [
        { id: 'double_pen_holder', pos: { x: -255, y: 205 }, acceptTypes: [PEN], size: { w: 110, h: 80 }, hintSprite: 'hint_pen', label: '签字笔归入办公笔架' },
        { id: 'double_cloth_fold', pos: { x: -100, y: 205 }, acceptTypes: [CLOTH, TOWEL], size: { w: 110, h: 90 }, hintSprite: 'hint_fold', label: '工作围裙折好挂放' },
        { id: 'double_bath_rack', pos: { x: 60, y: 205 }, acceptTypes: [SHAMPOO, SOAP], size: { w: 150, h: 90 }, hintSprite: 'hint_bottle', label: '清洁瓶罐摆回侧架' },
        { id: 'double_pipe_top', pos: { x: 200, y: 95 }, acceptTypes: [PIPE], size: { w: 120, h: 80 }, hintSprite: 'hint_pipe', label: '直管旋正连到上口' },
        { id: 'double_desk_wipe', pos: { x: 225, y: 55 }, acceptTypes: [SPONGE], size: { w: 240, h: 150 }, hintSprite: 'hint_wipe', label: '双工位台面一起擦净' },
    ],
    starThresholds: [70, 92, 100],
    isBoss: false,
    operations: [OperationType.DRAG, OperationType.FOLD, OperationType.ROTATE, OperationType.WIPE],
    bgmKey: 'bgm_chapter6',
    rewards: { baseCoin: 190, toolFragments: 23 },
};

export const LEVEL_6_10: LevelDataConfig = {
    id: 610,
    chapter: 6,
    sceneName: 'whole_house_prep',
    sceneDisplayName: '全屋收尾热身',
    timeLimit: 150,
    items: [
        { id: 'toothpaste_610', type: TOOTHPASTE, spriteKey: 'item_toothpaste_mint', initialPos: { x: -320, y: -125 }, targetSlotId: 'prep_sink_tray', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'soap_610', type: SOAP, spriteKey: 'item_soap_liquid', initialPos: { x: -165, y: -90 }, targetSlotId: 'prep_bottle_rack', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'towel_610', type: TOWEL_BATH, spriteKey: 'item_towel_bath_white', initialPos: { x: -10, y: -115 }, targetSlotId: 'prep_towel_fold', operation: OperationType.FOLD, sortOrder: 3 },
        { id: 'pipe_tee_610', type: PIPE_TEE, spriteKey: 'item_pipe_tee', initialPos: { x: 150, y: -90 }, targetSlotId: 'prep_pipe_joint', operation: OperationType.ROTATE, sortOrder: 4 },
        { id: 'sponge_610', type: SPONGE, spriteKey: 'item_sponge_green', initialPos: { x: 315, y: -80 }, targetSlotId: 'prep_counter_wipe', operation: OperationType.WIPE, sortOrder: 5 },
    ],
    slots: [
        { id: 'prep_sink_tray', pos: { x: -245, y: 205 }, acceptTypes: [TOOTHPASTE, FLOSS], size: { w: 130, h: 80 }, hintSprite: 'hint_sort', label: '牙膏和小件放进托盘' },
        { id: 'prep_bottle_rack', pos: { x: -80, y: 205 }, acceptTypes: [SOAP, SHAMPOO], size: { w: 150, h: 90 }, hintSprite: 'hint_bottle', label: '液体用品集中上架' },
        { id: 'prep_towel_fold', pos: { x: 65, y: 205 }, acceptTypes: [TOWEL_BATH, TOWEL], size: { w: 120, h: 90 }, hintSprite: 'hint_fold', label: '大浴巾折叠后压平' },
        { id: 'prep_pipe_joint', pos: { x: 210, y: 95 }, acceptTypes: [PIPE_TEE, PIPE_ELBOW], size: { w: 120, h: 110 }, hintSprite: 'hint_rotate', label: '旋转三通接通两路出水' },
        { id: 'prep_counter_wipe', pos: { x: 230, y: 55 }, acceptTypes: [SPONGE], size: { w: 250, h: 150 }, hintSprite: 'hint_wipe', label: '把最后的台面污迹擦净' },
    ],
    starThresholds: [72, 93, 100],
    isBoss: false,
    operations: [OperationType.DRAG, OperationType.FOLD, OperationType.ROTATE, OperationType.WIPE],
    bgmKey: 'bgm_chapter6',
    rewards: { baseCoin: 195, toolFragments: 24 },
};

export const LEVEL_6_BOSS: LevelDataConfig = {
    id: 611,
    chapter: 6,
    sceneName: 'whole_house_boss',
    sceneDisplayName: '混合操作终极 Boss',
    timeLimit: 180,
    items: [
        { id: 'boss_book_611', type: BOOK, spriteKey: 'item_book_blue', initialPos: { x: -340, y: -135 }, targetSlotId: 'boss6_book_shelf', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'boss_pen_611', type: PEN, spriteKey: 'item_pen_blue', initialPos: { x: -250, y: -95 }, targetSlotId: 'boss6_pen_holder', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'boss_towel_611', type: TOWEL_BATH, spriteKey: 'item_towel_bath_blue', initialPos: { x: -150, y: -125 }, targetSlotId: 'boss6_towel_fold', operation: OperationType.FOLD, sortOrder: 3 },
        { id: 'boss_shirt_611', type: CLOTH, spriteKey: 'item_shirt_tshirt', initialPos: { x: -40, y: -90 }, targetSlotId: 'boss6_cloth_fold', operation: OperationType.FOLD, sortOrder: 4 },
        { id: 'boss_toothbrush_611', type: TOOTHBRUSH, spriteKey: 'item_toothbrush_pink', initialPos: { x: 60, y: -125 }, targetSlotId: 'boss6_brush_holder', operation: OperationType.DRAG, sortOrder: 5 },
        { id: 'boss_toothpaste_611', type: TOOTHPASTE, spriteKey: 'item_toothpaste_mint', initialPos: { x: 160, y: -95 }, targetSlotId: 'boss6_sink_tray', operation: OperationType.DRAG, sortOrder: 6 },
        { id: 'boss_shampoo_611', type: SHAMPOO, spriteKey: 'item_shampoo_green', initialPos: { x: 270, y: -130 }, targetSlotId: 'boss6_bottle_rack', operation: OperationType.DRAG, sortOrder: 7 },
        { id: 'boss_soap_611', type: SOAP, spriteKey: 'item_soap_bar', initialPos: { x: 360, y: -95 }, targetSlotId: 'boss6_bottle_rack', operation: OperationType.DRAG, sortOrder: 8 },
        { id: 'boss_pipe_top_611', type: PIPE, spriteKey: 'item_pipe_straight', initialPos: { x: -300, y: 10 }, targetSlotId: 'boss6_pipe_top', operation: OperationType.ROTATE, sortOrder: 9 },
        { id: 'boss_pipe_turn_611', type: PIPE_ELBOW, spriteKey: 'item_pipe_elbow', initialPos: { x: -180, y: 15 }, targetSlotId: 'boss6_pipe_turn', operation: OperationType.ROTATE, sortOrder: 10 },
        { id: 'boss_pipe_joint_611', type: PIPE_TEE, spriteKey: 'item_pipe_tee', initialPos: { x: -60, y: 10 }, targetSlotId: 'boss6_pipe_joint', operation: OperationType.ROTATE, sortOrder: 11 },
        { id: 'boss_valve_611', type: VALVE, spriteKey: 'item_valve_red', initialPos: { x: 60, y: 10 }, targetSlotId: 'boss6_valve_slot', operation: OperationType.DRAG, sortOrder: 12 },
        { id: 'boss_bottle_611', type: BOTTLE, spriteKey: 'item_bottle_water', initialPos: { x: 180, y: 5 }, targetSlotId: 'boss6_bottle_stand', operation: OperationType.DRAG, sortOrder: 13 },
        { id: 'boss_toy_611', type: TOY, spriteKey: 'item_toy_car', initialPos: { x: 280, y: 10 }, targetSlotId: 'boss6_toy_box', operation: OperationType.DRAG, sortOrder: 14 },
        { id: 'boss_sponge_611', type: SPONGE, spriteKey: 'item_sponge_blue', initialPos: { x: 370, y: 15 }, targetSlotId: 'boss6_wipe_zone', operation: OperationType.WIPE, sortOrder: 15 },
    ],
    slots: [
        { id: 'boss6_book_shelf', pos: { x: -300, y: 220 }, acceptTypes: [BOOK], size: { w: 95, h: 110 }, hintSprite: 'hint_book', label: '书本回到展示架左层' },
        { id: 'boss6_pen_holder', pos: { x: -190, y: 220 }, acceptTypes: [PEN], size: { w: 100, h: 80 }, hintSprite: 'hint_pen', label: '笔类集中进笔筒' },
        { id: 'boss6_towel_fold', pos: { x: -80, y: 220 }, acceptTypes: [TOWEL_BATH, TOWEL], size: { w: 110, h: 90 }, hintSprite: 'hint_fold', label: '浴巾折叠后叠齐' },
        { id: 'boss6_cloth_fold', pos: { x: 20, y: 220 }, acceptTypes: [CLOTH], size: { w: 110, h: 90 }, hintSprite: 'hint_fold', label: '上衣折好收入衣物格' },
        { id: 'boss6_brush_holder', pos: { x: 120, y: 220 }, acceptTypes: [TOOTHBRUSH], size: { w: 100, h: 85 }, hintSprite: 'hint_toothbrush', label: '牙刷回到杯架' },
        { id: 'boss6_sink_tray', pos: { x: 220, y: 220 }, acceptTypes: [TOOTHPASTE, FLOSS], size: { w: 130, h: 80 }, hintSprite: 'hint_sort', label: '牙膏等小件并排进托盘' },
        { id: 'boss6_bottle_rack', pos: { x: 330, y: 220 }, acceptTypes: [SHAMPOO, SOAP], size: { w: 150, h: 90 }, hintSprite: 'hint_bottle', label: '洗浴瓶罐全部上架' },
        { id: 'boss6_pipe_top', pos: { x: -250, y: 110 }, acceptTypes: [PIPE], size: { w: 120, h: 80 }, hintSprite: 'hint_pipe', label: '先接上方主水管' },
        { id: 'boss6_pipe_turn', pos: { x: -120, y: 45 }, acceptTypes: [PIPE_ELBOW], size: { w: 110, h: 110 }, hintSprite: 'hint_rotate', label: '弯头转正衔接转角' },
        { id: 'boss6_pipe_joint', pos: { x: 0, y: 110 }, acceptTypes: [PIPE_TEE], size: { w: 120, h: 110 }, hintSprite: 'hint_rotate', label: '三通接起两路分支' },
        { id: 'boss6_valve_slot', pos: { x: 115, y: 160 }, acceptTypes: [VALVE], size: { w: 100, h: 80 }, hintSprite: 'hint_valve', label: '总阀门最后装回' },
        { id: 'boss6_bottle_stand', pos: { x: 210, y: 105 }, acceptTypes: [BOTTLE, DRINK], size: { w: 110, h: 90 }, hintSprite: 'hint_bottle', label: '饮水瓶放回立架' },
        { id: 'boss6_toy_box', pos: { x: 300, y: 105 }, acceptTypes: [TOY], size: { w: 110, h: 90 }, hintSprite: 'hint_toy', label: '玩具车收入收纳箱' },
        { id: 'boss6_wipe_zone', pos: { x: 170, y: 45 }, acceptTypes: [SPONGE], size: { w: 300, h: 170 }, hintSprite: 'hint_wipe', label: '整块混合区域的污渍全部擦净' },
    ],
    starThresholds: [75, 94, 100],
    isBoss: true,
    operations: [OperationType.DRAG, OperationType.FOLD, OperationType.ROTATE, OperationType.WIPE],
    bgmKey: 'bgm_chapter6_boss',
    rewards: { baseCoin: 260, toolFragments: 36 },
};

export const CHAPTER_6_LEVELS: LevelDataConfig[] = [
    LEVEL_6_1,
    LEVEL_6_2,
    LEVEL_6_3,
    LEVEL_6_4,
    LEVEL_6_5,
    LEVEL_6_6,
    LEVEL_6_7,
    LEVEL_6_8,
    LEVEL_6_9,
    LEVEL_6_10,
    LEVEL_6_BOSS,
];
