import { OperationType } from './LevelData';
import { LevelDataConfig, ITEM_TYPES } from './types';

const FOOD = ITEM_TYPES.FOOD;
const VEGETABLE = ITEM_TYPES.VEGETABLE;
const FRUIT = ITEM_TYPES.FRUIT;
const DAIRY = ITEM_TYPES.DAIRY;
const MEAT = ITEM_TYPES.MEAT;
const DRINK = ITEM_TYPES.DRINK;
const LEFTOVER = ITEM_TYPES.LEFTOVER;
const ICE_CREAM = ITEM_TYPES.ICE_CREAM;
const JAM = ITEM_TYPES.JAM;
const EGG = ITEM_TYPES.EGG;

export const LEVEL_4_1: LevelDataConfig = {
    id: 401,
    chapter: 4,
    sceneName: 'fridge',
    sceneDisplayName: '冰箱初整理',
    timeLimit: 75,
    items: [
        { id: 'milk_pack_401', type: DAIRY, spriteKey: 'item_milk_pack', initialPos: { x: -250, y: -120 }, targetSlotId: 'fridge_top_left', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'juice_box_401', type: DRINK, spriteKey: 'item_juice_box', initialPos: { x: -60, y: -80 }, targetSlotId: 'fridge_top_right', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'egg_box_401', type: EGG, spriteKey: 'item_egg_box', initialPos: { x: 180, y: -110 }, targetSlotId: 'fridge_door_egg', operation: OperationType.DRAG, sortOrder: 3 },
    ],
    slots: [
        { id: 'fridge_top_left', pos: { x: -180, y: 220 }, acceptTypes: [DAIRY], size: { w: 120, h: 90 }, hintSprite: 'hint_dairy', label: '乳制品放上层左侧' },
        { id: 'fridge_top_right', pos: { x: 30, y: 220 }, acceptTypes: [DRINK], size: { w: 120, h: 90 }, hintSprite: 'hint_drink', label: '饮料靠右摆齐' },
        { id: 'fridge_door_egg', pos: { x: 250, y: 120 }, acceptTypes: [EGG], size: { w: 110, h: 80 }, hintSprite: 'hint_egg', label: '鸡蛋放入门侧蛋架' },
    ],
    starThresholds: [55, 80, 100],
    isBoss: false,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_chapter4',
    rewards: { baseCoin: 110, toolFragments: 12 },
};

export const LEVEL_4_2: LevelDataConfig = {
    id: 402,
    chapter: 4,
    sceneName: 'fridge',
    sceneDisplayName: '蔬果分层',
    timeLimit: 80,
    items: [
        { id: 'carrot_402', type: VEGETABLE, spriteKey: 'item_carrot', initialPos: { x: -280, y: -130 }, targetSlotId: 'fridge_crisper_left', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'broccoli_402', type: VEGETABLE, spriteKey: 'item_broccoli', initialPos: { x: -90, y: -70 }, targetSlotId: 'fridge_crisper_left', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'apple_402', type: FRUIT, spriteKey: 'item_apple', initialPos: { x: 120, y: -100 }, targetSlotId: 'fridge_crisper_right', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'orange_402', type: FRUIT, spriteKey: 'item_orange', initialPos: { x: 280, y: -80 }, targetSlotId: 'fridge_crisper_right', operation: OperationType.DRAG, sortOrder: 4 },
    ],
    slots: [
        { id: 'fridge_crisper_left', pos: { x: -130, y: 60 }, acceptTypes: [VEGETABLE], size: { w: 170, h: 100 }, hintSprite: 'hint_vegetable', label: '蔬菜放入左侧保鲜盒' },
        { id: 'fridge_crisper_right', pos: { x: 120, y: 60 }, acceptTypes: [FRUIT], size: { w: 170, h: 100 }, hintSprite: 'hint_fruit', label: '水果放入右侧保鲜盒' },
    ],
    starThresholds: [58, 82, 100],
    isBoss: false,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_chapter4',
    rewards: { baseCoin: 115, toolFragments: 13 },
};

export const LEVEL_4_3: LevelDataConfig = {
    id: 403,
    chapter: 4,
    sceneName: 'fridge',
    sceneDisplayName: '冷藏区归类',
    timeLimit: 85,
    items: [
        { id: 'cheese_403', type: DAIRY, spriteKey: 'item_cheese', initialPos: { x: -250, y: -120 }, targetSlotId: 'fridge_mid_left', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'yogurt_403', type: DAIRY, spriteKey: 'item_yogurt', initialPos: { x: -60, y: -60 }, targetSlotId: 'fridge_mid_left', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'ham_403', type: MEAT, spriteKey: 'item_ham_pack', initialPos: { x: 130, y: -100 }, targetSlotId: 'fridge_mid_right', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'steak_403', type: MEAT, spriteKey: 'item_steak_pack', initialPos: { x: 280, y: -80 }, targetSlotId: 'fridge_mid_right', operation: OperationType.DRAG, sortOrder: 4 },
    ],
    slots: [
        { id: 'fridge_mid_left', pos: { x: -150, y: 145 }, acceptTypes: [DAIRY], size: { w: 160, h: 90 }, hintSprite: 'hint_dairy', label: '奶酪酸奶放左格' },
        { id: 'fridge_mid_right', pos: { x: 120, y: 145 }, acceptTypes: [MEAT], size: { w: 160, h: 90 }, hintSprite: 'hint_meat', label: '生鲜肉类单独放右格' },
    ],
    starThresholds: [60, 84, 100],
    isBoss: false,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_chapter4',
    rewards: { baseCoin: 120, toolFragments: 14 },
};

export const LEVEL_4_4: LevelDataConfig = {
    id: 404,
    chapter: 4,
    sceneName: 'fridge',
    sceneDisplayName: '调味与剩菜',
    timeLimit: 90,
    items: [
        { id: 'jam_strawberry_404', type: JAM, spriteKey: 'item_jam_strawberry', initialPos: { x: -260, y: -120 }, targetSlotId: 'fridge_door_condiment', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'jam_blueberry_404', type: JAM, spriteKey: 'item_jam_blueberry', initialPos: { x: -120, y: -50 }, targetSlotId: 'fridge_door_condiment', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'leftover_bowl_404', type: LEFTOVER, spriteKey: 'item_leftover_bowl', initialPos: { x: 110, y: -100 }, targetSlotId: 'fridge_bottom_box', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'leftover_box_404', type: LEFTOVER, spriteKey: 'item_leftover_box', initialPos: { x: 270, y: -70 }, targetSlotId: 'fridge_bottom_box', operation: OperationType.DRAG, sortOrder: 4 },
    ],
    slots: [
        { id: 'fridge_door_condiment', pos: { x: 260, y: 200 }, acceptTypes: [JAM], size: { w: 100, h: 150 }, hintSprite: 'hint_jam', label: '果酱集中放门侧' },
        { id: 'fridge_bottom_box', pos: { x: -10, y: -20 }, acceptTypes: [LEFTOVER], size: { w: 220, h: 100 }, hintSprite: 'hint_leftover', label: '剩菜盒叠放到底层' },
    ],
    starThresholds: [62, 85, 100],
    isBoss: false,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_chapter4',
    rewards: { baseCoin: 125, toolFragments: 15 },
};

export const LEVEL_4_5: LevelDataConfig = {
    id: 405,
    chapter: 4,
    sceneName: 'fridge',
    sceneDisplayName: '饮品成列',
    timeLimit: 95,
    items: [
        { id: 'cola_can_405', type: DRINK, spriteKey: 'item_cola_can', initialPos: { x: -290, y: -130 }, targetSlotId: 'fridge_drink_row', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'water_bottle_405', type: DRINK, spriteKey: 'item_water_bottle', initialPos: { x: -150, y: -80 }, targetSlotId: 'fridge_drink_row', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'juice_bottle_405', type: DRINK, spriteKey: 'item_juice_bottle', initialPos: { x: 20, y: -120 }, targetSlotId: 'fridge_drink_row', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'soda_can_405', type: DRINK, spriteKey: 'item_soda_can', initialPos: { x: 180, y: -70 }, targetSlotId: 'fridge_drink_row', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'pudding_405', type: FOOD, spriteKey: 'item_pudding', initialPos: { x: 300, y: -110 }, targetSlotId: 'fridge_snack_corner', operation: OperationType.DRAG, sortOrder: 5 },
    ],
    slots: [
        { id: 'fridge_drink_row', pos: { x: -20, y: 150 }, acceptTypes: [DRINK], size: { w: 300, h: 90 }, hintSprite: 'hint_drink', label: '饮料按一排摆正' },
        { id: 'fridge_snack_corner', pos: { x: 240, y: 150 }, acceptTypes: [FOOD], size: { w: 100, h: 90 }, hintSprite: 'hint_food', label: '布丁放入零食角' },
    ],
    starThresholds: [64, 86, 100],
    isBoss: false,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_chapter4',
    rewards: { baseCoin: 130, toolFragments: 16 },
};

export const LEVEL_4_6: LevelDataConfig = {
    id: 406,
    chapter: 4,
    sceneName: 'fridge',
    sceneDisplayName: '冷冻抽屉',
    timeLimit: 100,
    items: [
        { id: 'icecream_vanilla_406', type: ICE_CREAM, spriteKey: 'item_icecream_vanilla', initialPos: { x: -270, y: -130 }, targetSlotId: 'freezer_left', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'icecream_choco_406', type: ICE_CREAM, spriteKey: 'item_icecream_choco', initialPos: { x: -90, y: -70 }, targetSlotId: 'freezer_left', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'frozen_dumpling_406', type: FOOD, spriteKey: 'item_frozen_dumpling', initialPos: { x: 120, y: -120 }, targetSlotId: 'freezer_right', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'frozen_peas_406', type: VEGETABLE, spriteKey: 'item_frozen_peas', initialPos: { x: 280, y: -80 }, targetSlotId: 'freezer_right', operation: OperationType.DRAG, sortOrder: 4 },
    ],
    slots: [
        { id: 'freezer_left', pos: { x: -140, y: -30 }, acceptTypes: [ICE_CREAM], size: { w: 150, h: 100 }, hintSprite: 'hint_icecream', label: '冰淇淋放左抽屉' },
        { id: 'freezer_right', pos: { x: 120, y: -30 }, acceptTypes: [FOOD, VEGETABLE], size: { w: 170, h: 100 }, hintSprite: 'hint_food', label: '速冻食物放右抽屉' },
    ],
    starThresholds: [66, 88, 100],
    isBoss: false,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_chapter4',
    rewards: { baseCoin: 135, toolFragments: 17 },
};

export const LEVEL_4_7: LevelDataConfig = {
    id: 407,
    chapter: 4,
    sceneName: 'fridge',
    sceneDisplayName: '鸡蛋与早餐层',
    timeLimit: 105,
    items: [
        { id: 'egg_box_a_407', type: EGG, spriteKey: 'item_egg_box', initialPos: { x: -300, y: -130 }, targetSlotId: 'breakfast_egg_rack', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'egg_box_b_407', type: EGG, spriteKey: 'item_egg_box_small', initialPos: { x: -140, y: -80 }, targetSlotId: 'breakfast_egg_rack', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'butter_407', type: DAIRY, spriteKey: 'item_butter', initialPos: { x: 40, y: -120 }, targetSlotId: 'breakfast_dairy_row', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'milk_small_407', type: DAIRY, spriteKey: 'item_milk_small', initialPos: { x: 200, y: -70 }, targetSlotId: 'breakfast_dairy_row', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'jam_apricot_407', type: JAM, spriteKey: 'item_jam_apricot', initialPos: { x: 320, y: -110 }, targetSlotId: 'breakfast_condiment', operation: OperationType.DRAG, sortOrder: 5 },
    ],
    slots: [
        { id: 'breakfast_egg_rack', pos: { x: 250, y: 110 }, acceptTypes: [EGG], size: { w: 100, h: 90 }, hintSprite: 'hint_egg', label: '鸡蛋放回蛋架' },
        { id: 'breakfast_dairy_row', pos: { x: -70, y: 205 }, acceptTypes: [DAIRY], size: { w: 200, h: 80 }, hintSprite: 'hint_dairy', label: '早餐乳品靠前排' },
        { id: 'breakfast_condiment', pos: { x: 120, y: 205 }, acceptTypes: [JAM], size: { w: 90, h: 80 }, hintSprite: 'hint_jam', label: '果酱放在乳品旁' },
    ],
    starThresholds: [68, 89, 100],
    isBoss: false,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_chapter4',
    rewards: { baseCoin: 140, toolFragments: 18 },
};

export const LEVEL_4_8: LevelDataConfig = {
    id: 408,
    chapter: 4,
    sceneName: 'fridge',
    sceneDisplayName: '生熟分区',
    timeLimit: 110,
    items: [
        { id: 'salad_box_408', type: FOOD, spriteKey: 'item_salad_box', initialPos: { x: -290, y: -120 }, targetSlotId: 'cooked_food_zone', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'cake_slice_408', type: FOOD, spriteKey: 'item_cake_slice', initialPos: { x: -120, y: -70 }, targetSlotId: 'cooked_food_zone', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'raw_meat_408', type: MEAT, spriteKey: 'item_raw_meat_pack', initialPos: { x: 60, y: -120 }, targetSlotId: 'raw_meat_zone', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'sausage_408', type: MEAT, spriteKey: 'item_sausage_pack', initialPos: { x: 220, y: -80 }, targetSlotId: 'raw_meat_zone', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'grape_408', type: FRUIT, spriteKey: 'item_grape', initialPos: { x: 330, y: -100 }, targetSlotId: 'fruit_top_corner', operation: OperationType.DRAG, sortOrder: 5 },
    ],
    slots: [
        { id: 'cooked_food_zone', pos: { x: -140, y: 140 }, acceptTypes: [FOOD], size: { w: 180, h: 90 }, hintSprite: 'hint_food', label: '熟食甜点放左侧' },
        { id: 'raw_meat_zone', pos: { x: 90, y: 140 }, acceptTypes: [MEAT], size: { w: 180, h: 90 }, hintSprite: 'hint_meat', label: '生肉密封放右侧' },
        { id: 'fruit_top_corner', pos: { x: 260, y: 220 }, acceptTypes: [FRUIT], size: { w: 100, h: 70 }, hintSprite: 'hint_fruit', label: '葡萄放到上角落' },
    ],
    starThresholds: [70, 90, 100],
    isBoss: false,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_chapter4',
    rewards: { baseCoin: 145, toolFragments: 19 },
};

export const LEVEL_4_9: LevelDataConfig = {
    id: 409,
    chapter: 4,
    sceneName: 'fridge',
    sceneDisplayName: '容量压缩',
    timeLimit: 115,
    items: [
        { id: 'milk_carton_409', type: DAIRY, spriteKey: 'item_milk_carton', initialPos: { x: -300, y: -130 }, targetSlotId: 'compact_top_row', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'yogurt_drink_409', type: DAIRY, spriteKey: 'item_yogurt_drink', initialPos: { x: -170, y: -75 }, targetSlotId: 'compact_top_row', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'tomato_409', type: VEGETABLE, spriteKey: 'item_tomato', initialPos: { x: -10, y: -115 }, targetSlotId: 'compact_crisper', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'lettuce_409', type: VEGETABLE, spriteKey: 'item_lettuce', initialPos: { x: 120, y: -80 }, targetSlotId: 'compact_crisper', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'pear_409', type: FRUIT, spriteKey: 'item_pear', initialPos: { x: 250, y: -115 }, targetSlotId: 'compact_door_bin', operation: OperationType.DRAG, sortOrder: 5 },
        { id: 'jam_mini_409', type: JAM, spriteKey: 'item_jam_mini', initialPos: { x: 340, y: -70 }, targetSlotId: 'compact_door_bin', operation: OperationType.DRAG, sortOrder: 6 },
    ],
    slots: [
        { id: 'compact_top_row', pos: { x: -130, y: 210 }, acceptTypes: [DAIRY], size: { w: 170, h: 80 }, hintSprite: 'hint_dairy', label: '乳品顶层紧密摆放' },
        { id: 'compact_crisper', pos: { x: 20, y: 50 }, acceptTypes: [VEGETABLE], size: { w: 180, h: 100 }, hintSprite: 'hint_vegetable', label: '蔬菜压缩进保鲜层' },
        { id: 'compact_door_bin', pos: { x: 255, y: 120 }, acceptTypes: [FRUIT, JAM], size: { w: 110, h: 130 }, hintSprite: 'hint_sort', label: '门侧小格放轻小物品' },
    ],
    starThresholds: [72, 91, 100],
    isBoss: false,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_chapter4',
    rewards: { baseCoin: 150, toolFragments: 20 },
};

export const LEVEL_4_10: LevelDataConfig = {
    id: 410,
    chapter: 4,
    sceneName: 'fridge',
    sceneDisplayName: '满载前整备',
    timeLimit: 120,
    items: [
        { id: 'drink_green_410', type: DRINK, spriteKey: 'item_green_tea', initialPos: { x: -310, y: -130 }, targetSlotId: 'prep_drink_line', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'drink_milk_tea_410', type: DRINK, spriteKey: 'item_milk_tea', initialPos: { x: -190, y: -80 }, targetSlotId: 'prep_drink_line', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'egg_pack_410', type: EGG, spriteKey: 'item_egg_pack', initialPos: { x: -50, y: -120 }, targetSlotId: 'prep_egg_slot', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'kiwi_410', type: FRUIT, spriteKey: 'item_kiwi', initialPos: { x: 90, y: -70 }, targetSlotId: 'prep_fruit_box', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'berry_box_410', type: FRUIT, spriteKey: 'item_berry_box', initialPos: { x: 210, y: -110 }, targetSlotId: 'prep_fruit_box', operation: OperationType.DRAG, sortOrder: 5 },
        { id: 'cheese_slice_410', type: DAIRY, spriteKey: 'item_cheese_slice', initialPos: { x: 330, y: -80 }, targetSlotId: 'prep_dairy_slot', operation: OperationType.DRAG, sortOrder: 6 },
    ],
    slots: [
        { id: 'prep_drink_line', pos: { x: -140, y: 155 }, acceptTypes: [DRINK], size: { w: 170, h: 90 }, hintSprite: 'hint_drink', label: '饮品先排成一列' },
        { id: 'prep_egg_slot', pos: { x: 250, y: 115 }, acceptTypes: [EGG], size: { w: 100, h: 80 }, hintSprite: 'hint_egg', label: '鸡蛋固定在门架中央' },
        { id: 'prep_fruit_box', pos: { x: 50, y: 45 }, acceptTypes: [FRUIT], size: { w: 170, h: 95 }, hintSprite: 'hint_fruit', label: '水果一起放进果盒' },
        { id: 'prep_dairy_slot', pos: { x: 60, y: 220 }, acceptTypes: [DAIRY], size: { w: 110, h: 70 }, hintSprite: 'hint_dairy', label: '芝士放上层角落' },
    ],
    starThresholds: [74, 92, 100],
    isBoss: false,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_chapter4',
    rewards: { baseCoin: 160, toolFragments: 22 },
};

export const LEVEL_4_11: LevelDataConfig = {
    id: 411,
    chapter: 4,
    sceneName: 'fridge',
    sceneDisplayName: '杂乱冰箱 Boss 关',
    timeLimit: 150,
    items: [
        { id: 'boss_milk_411', type: DAIRY, spriteKey: 'item_milk_pack', initialPos: { x: -320, y: -130 }, targetSlotId: 'boss_top_dairy', operation: OperationType.DRAG, sortOrder: 1 },
        { id: 'boss_cheese_411', type: DAIRY, spriteKey: 'item_cheese', initialPos: { x: -220, y: -70 }, targetSlotId: 'boss_top_dairy', operation: OperationType.DRAG, sortOrder: 2 },
        { id: 'boss_cola_411', type: DRINK, spriteKey: 'item_cola_can', initialPos: { x: -110, y: -120 }, targetSlotId: 'boss_drink_zone', operation: OperationType.DRAG, sortOrder: 3 },
        { id: 'boss_juice_411', type: DRINK, spriteKey: 'item_juice_bottle', initialPos: { x: 10, y: -80 }, targetSlotId: 'boss_drink_zone', operation: OperationType.DRAG, sortOrder: 4 },
        { id: 'boss_steak_411', type: MEAT, spriteKey: 'item_steak_pack', initialPos: { x: 120, y: -125 }, targetSlotId: 'boss_meat_zone', operation: OperationType.DRAG, sortOrder: 5 },
        { id: 'boss_ham_411', type: MEAT, spriteKey: 'item_ham_pack', initialPos: { x: 220, y: -70 }, targetSlotId: 'boss_meat_zone', operation: OperationType.DRAG, sortOrder: 6 },
        { id: 'boss_apple_411', type: FRUIT, spriteKey: 'item_apple', initialPos: { x: 320, y: -110 }, targetSlotId: 'boss_fruit_crisper', operation: OperationType.DRAG, sortOrder: 7 },
        { id: 'boss_grape_411', type: FRUIT, spriteKey: 'item_grape', initialPos: { x: -260, y: 0 }, targetSlotId: 'boss_fruit_crisper', operation: OperationType.DRAG, sortOrder: 8 },
        { id: 'boss_carrot_411', type: VEGETABLE, spriteKey: 'item_carrot', initialPos: { x: -150, y: 20 }, targetSlotId: 'boss_veg_crisper', operation: OperationType.DRAG, sortOrder: 9 },
        { id: 'boss_lettuce_411', type: VEGETABLE, spriteKey: 'item_lettuce', initialPos: { x: -20, y: 5 }, targetSlotId: 'boss_veg_crisper', operation: OperationType.DRAG, sortOrder: 10 },
        { id: 'boss_egg_411', type: EGG, spriteKey: 'item_egg_box', initialPos: { x: 110, y: 10 }, targetSlotId: 'boss_egg_rack', operation: OperationType.DRAG, sortOrder: 11 },
        { id: 'boss_jam_411', type: JAM, spriteKey: 'item_jam_strawberry', initialPos: { x: 220, y: 15 }, targetSlotId: 'boss_door_condiment', operation: OperationType.DRAG, sortOrder: 12 },
        { id: 'boss_leftover_411', type: LEFTOVER, spriteKey: 'item_leftover_box', initialPos: { x: 320, y: 0 }, targetSlotId: 'boss_bottom_leftover', operation: OperationType.DRAG, sortOrder: 13 },
        { id: 'boss_icecream_411', type: ICE_CREAM, spriteKey: 'item_icecream_vanilla', initialPos: { x: -70, y: 95 }, targetSlotId: 'boss_freezer', operation: OperationType.DRAG, sortOrder: 14 },
    ],
    slots: [
        { id: 'boss_top_dairy', pos: { x: -190, y: 220 }, acceptTypes: [DAIRY], size: { w: 150, h: 85 }, hintSprite: 'hint_dairy', label: '顶层左侧乳品区' },
        { id: 'boss_drink_zone', pos: { x: 20, y: 220 }, acceptTypes: [DRINK], size: { w: 140, h: 85 }, hintSprite: 'hint_drink', label: '顶层右侧饮料区' },
        { id: 'boss_meat_zone', pos: { x: -170, y: 140 }, acceptTypes: [MEAT], size: { w: 160, h: 85 }, hintSprite: 'hint_meat', label: '中层单独放肉类' },
        { id: 'boss_fruit_crisper', pos: { x: 60, y: 60 }, acceptTypes: [FRUIT], size: { w: 160, h: 95 }, hintSprite: 'hint_fruit', label: '水果进入右侧果盒' },
        { id: 'boss_veg_crisper', pos: { x: -170, y: 60 }, acceptTypes: [VEGETABLE], size: { w: 160, h: 95 }, hintSprite: 'hint_vegetable', label: '蔬菜进入左侧菜盒' },
        { id: 'boss_egg_rack', pos: { x: 255, y: 120 }, acceptTypes: [EGG], size: { w: 90, h: 80 }, hintSprite: 'hint_egg', label: '鸡蛋放门侧蛋架' },
        { id: 'boss_door_condiment', pos: { x: 255, y: 200 }, acceptTypes: [JAM], size: { w: 90, h: 80 }, hintSprite: 'hint_jam', label: '果酱放上部门格' },
        { id: 'boss_bottom_leftover', pos: { x: 10, y: -25 }, acceptTypes: [LEFTOVER], size: { w: 180, h: 90 }, hintSprite: 'hint_leftover', label: '剩菜盒放到底层' },
        { id: 'boss_freezer', pos: { x: -230, y: -25 }, acceptTypes: [ICE_CREAM], size: { w: 120, h: 90 }, hintSprite: 'hint_icecream', label: '冰淇淋收进冷冻格' },
    ],
    starThresholds: [76, 93, 100],
    isBoss: true,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_chapter4_boss',
    rewards: { baseCoin: 220, toolFragments: 30 },
};

export const CHAPTER_4_LEVELS: LevelDataConfig[] = [
    LEVEL_4_1,
    LEVEL_4_2,
    LEVEL_4_3,
    LEVEL_4_4,
    LEVEL_4_5,
    LEVEL_4_6,
    LEVEL_4_7,
    LEVEL_4_8,
    LEVEL_4_9,
    LEVEL_4_10,
    LEVEL_4_11,
];
