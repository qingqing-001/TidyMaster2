/**
 * 游戏关卡配置数据
 * 第1章：教学关卡（Chapter 1 - Tutorial）
 */

import { OperationType } from './LevelData';
import { ITEM_TYPES, LevelDataConfig } from './types';
import { CHAPTER_2_LEVELS, LEVEL_2_1 } from './chapter2Levels';

const BOOK = ITEM_TYPES.BOOK;
const PEN = ITEM_TYPES.PEN;
const CUP = ITEM_TYPES.CUP;
const PLATE = ITEM_TYPES.PLATE;
const CLOTH = ITEM_TYPES.CLOTH;
const TOWEL = ITEM_TYPES.TOWEL;
const FORK = ITEM_TYPES.FORK;
const SPOON = ITEM_TYPES.SPOON;
const BOTTLE = ITEM_TYPES.BOTTLE;
const TOY = ITEM_TYPES.TOY;

// 关卡1：书桌整理（拖拽书籍）
export const LEVEL_1_1: LevelDataConfig = {
    id: 1,
    chapter: 1,
    sceneName: 'desk',
    sceneDisplayName: '书桌整理',
    timeLimit: 0,
    items: [
        {
            id: 'book_blue',
            type: BOOK,
            spriteKey: 'item_book_blue',
            initialPos: { x: -250, y: -40 },
            targetSlotId: 'desk_bookshelf_left',
            operation: OperationType.DRAG,
            sortOrder: 1,
        },
        {
            id: 'book_red',
            type: BOOK,
            spriteKey: 'item_book_red',
            initialPos: { x: -100, y: -10 },
            targetSlotId: 'desk_bookshelf_mid',
            operation: OperationType.DRAG,
            sortOrder: 2,
        },
        {
            id: 'book_green',
            type: BOOK,
            spriteKey: 'item_book_green',
            initialPos: { x: 40, y: -60 },
            targetSlotId: 'desk_bookshelf_right',
            operation: OperationType.DRAG,
            sortOrder: 3,
        },
        {
            id: 'pen_blue',
            type: PEN,
            spriteKey: 'item_pen_blue',
            initialPos: { x: 180, y: -20 },
            targetSlotId: 'desk_pen_tray',
            operation: OperationType.DRAG,
            sortOrder: 4,
        },
        {
            id: 'pen_red',
            type: PEN,
            spriteKey: 'item_pen_red',
            initialPos: { x: 260, y: -50 },
            targetSlotId: 'desk_pen_tray',
            operation: OperationType.DRAG,
            sortOrder: 5,
        },
    ],
    slots: [
        {
            id: 'desk_bookshelf_left',
            pos: { x: -180, y: 220 },
            acceptTypes: [BOOK],
            size: { w: 90, h: 120 },
            hintSprite: 'hint_book',
            label: '蓝色书本归位',
        },
        {
            id: 'desk_bookshelf_mid',
            pos: { x: -40, y: 220 },
            acceptTypes: [BOOK],
            size: { w: 90, h: 120 },
            hintSprite: 'hint_book',
            label: '红色书本归位',
        },
        {
            id: 'desk_bookshelf_right',
            pos: { x: 100, y: 220 },
            acceptTypes: [BOOK],
            size: { w: 90, h: 120 },
            hintSprite: 'hint_book',
            label: '绿色书本归位',
        },
        {
            id: 'desk_pen_tray',
            pos: { x: 250, y: 190 },
            acceptTypes: [PEN],
            size: { w: 120, h: 70 },
            hintSprite: 'hint_pen',
            label: '把两支笔放进笔盒',
        },
    ],
    starThresholds: [60, 85, 100],
    isBoss: false,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_tutorial',
    rewards: {
        baseCoin: 50,
        toolFragments: 5,
    },
};

// 关卡2：餐具分类（拖拽餐具）
export const LEVEL_1_2: LevelDataConfig = {
    id: 2,
    chapter: 1,
    sceneName: 'kitchen',
    sceneDisplayName: '餐具分类',
    timeLimit: 0,
    items: [
        {
            id: 'plate_white',
            type: PLATE,
            spriteKey: 'item_plate_white',
            initialPos: { x: -260, y: -80 },
            targetSlotId: 'kitchen_plate_rack',
            operation: OperationType.DRAG,
            sortOrder: 1,
        },
        {
            id: 'plate_blue',
            type: PLATE,
            spriteKey: 'item_plate_blue',
            initialPos: { x: -130, y: -30 },
            targetSlotId: 'kitchen_plate_rack',
            operation: OperationType.DRAG,
            sortOrder: 2,
        },
        {
            id: 'cup_mug',
            type: CUP,
            spriteKey: 'item_cup_mug',
            initialPos: { x: 20, y: -20 },
            targetSlotId: 'kitchen_cup_holder',
            operation: OperationType.DRAG,
            sortOrder: 3,
        },
        {
            id: 'cup_glass',
            type: CUP,
            spriteKey: 'item_cup_glass',
            initialPos: { x: 140, y: -60 },
            targetSlotId: 'kitchen_cup_holder',
            operation: OperationType.DRAG,
            sortOrder: 4,
        },
        {
            id: 'fork_silver',
            type: FORK,
            spriteKey: 'item_fork',
            initialPos: { x: 250, y: -10 },
            targetSlotId: 'kitchen_cutlery_tray',
            operation: OperationType.DRAG,
            sortOrder: 5,
        },
        {
            id: 'spoon_silver',
            type: SPOON,
            spriteKey: 'item_spoon',
            initialPos: { x: 320, y: -40 },
            targetSlotId: 'kitchen_cutlery_tray',
            operation: OperationType.DRAG,
            sortOrder: 6,
        },
    ],
    slots: [
        {
            id: 'kitchen_plate_rack',
            pos: { x: -190, y: 210 },
            acceptTypes: [PLATE],
            size: { w: 140, h: 110 },
            hintSprite: 'hint_plate',
            label: '盘子放上置物架',
        },
        {
            id: 'kitchen_cup_holder',
            pos: { x: 10, y: 210 },
            acceptTypes: [CUP],
            size: { w: 130, h: 90 },
            hintSprite: 'hint_cup',
            label: '杯子挂到杯架上',
        },
        {
            id: 'kitchen_cutlery_tray',
            pos: { x: 260, y: 205 },
            acceptTypes: [FORK, SPOON],
            size: { w: 150, h: 80 },
            hintSprite: 'hint_cutlery',
            label: '刀叉勺放入餐具盒',
        },
    ],
    starThresholds: [55, 80, 100],
    isBoss: false,
    operations: [OperationType.DRAG],
    bgmKey: 'bgm_tutorial',
    rewards: {
        baseCoin: 60,
        toolFragments: 8,
    },
};

// 关卡3：桌面擦洗（拖拽+擦洗）
export const LEVEL_1_3: LevelDataConfig = {
    id: 3,
    chapter: 1,
    sceneName: 'table',
    sceneDisplayName: '桌面擦洗',
    timeLimit: 90,
    items: [
        {
            id: 'bottle_water',
            type: BOTTLE,
            spriteKey: 'item_bottle_water',
            initialPos: { x: -240, y: -50 },
            targetSlotId: 'table_bottle_rack',
            operation: OperationType.DRAG,
            sortOrder: 1,
        },
        {
            id: 'towel_clean',
            type: TOWEL,
            spriteKey: 'item_towel_clean',
            initialPos: { x: -80, y: -10 },
            targetSlotId: 'table_dirty_surface',
            operation: OperationType.WIPE,
            sortOrder: 2,
        },
        {
            id: 'plate_dirty',
            type: PLATE,
            spriteKey: 'item_plate_dirty',
            initialPos: { x: 140, y: -60 },
            targetSlotId: 'table_wash_area',
            operation: OperationType.DRAG,
            sortOrder: 3,
        },
        {
            id: 'cup_dirty',
            type: CUP,
            spriteKey: 'item_cup_dirty',
            initialPos: { x: 290, y: -40 },
            targetSlotId: 'table_wash_area',
            operation: OperationType.DRAG,
            sortOrder: 4,
        },
    ],
    slots: [
        {
            id: 'table_bottle_rack',
            pos: { x: -230, y: 220 },
            acceptTypes: [BOTTLE],
            size: { w: 90, h: 100 },
            hintSprite: 'hint_bottle',
            label: '水瓶放回收纳架',
        },
        {
            id: 'table_dirty_surface',
            pos: { x: -10, y: 90 },
            acceptTypes: [TOWEL],
            size: { w: 240, h: 150 },
            hintSprite: 'hint_wipe',
            label: '来回擦掉桌面污渍',
        },
        {
            id: 'table_wash_area',
            pos: { x: 240, y: 220 },
            acceptTypes: [PLATE, CUP],
            size: { w: 170, h: 110 },
            hintSprite: 'hint_wash',
            label: '脏餐具移到清洗区',
        },
    ],
    starThresholds: [45, 75, 100],
    isBoss: false,
    operations: [OperationType.DRAG, OperationType.WIPE],
    bgmKey: 'bgm_tutorial',
    rewards: {
        baseCoin: 70,
        toolFragments: 10,
    },
};

// 关卡4：衣服折叠（拖拽+折叠）
export const LEVEL_1_4: LevelDataConfig = {
    id: 4,
    chapter: 1,
    sceneName: 'bedroom',
    sceneDisplayName: '衣服折叠',
    timeLimit: 120,
    items: [
        {
            id: 'shirt_white',
            type: CLOTH,
            spriteKey: 'item_shirt_tshirt',
            initialPos: { x: -260, y: -30 },
            targetSlotId: 'bed_fold_1',
            operation: OperationType.FOLD,
            sortOrder: 1,
        },
        {
            id: 'pants_blue',
            type: CLOTH,
            spriteKey: 'item_shirt_pants',
            initialPos: { x: -120, y: -70 },
            targetSlotId: 'bed_fold_2',
            operation: OperationType.FOLD,
            sortOrder: 2,
        },
        {
            id: 'towel_large',
            type: TOWEL,
            spriteKey: 'item_towel_bath',
            initialPos: { x: 20, y: -10 },
            targetSlotId: 'bed_fold_3',
            operation: OperationType.FOLD,
            sortOrder: 3,
        },
        {
            id: 'dress_pink',
            type: CLOTH,
            spriteKey: 'item_shirt_dress',
            initialPos: { x: 180, y: -50 },
            targetSlotId: 'bed_fold_4',
            operation: OperationType.FOLD,
            sortOrder: 4,
        },
        {
            id: 'towel_small',
            type: TOWEL,
            spriteKey: 'item_towel_hand',
            initialPos: { x: 310, y: -20 },
            targetSlotId: 'bed_fold_5',
            operation: OperationType.FOLD,
            sortOrder: 5,
        },
    ],
    slots: [
        {
            id: 'bed_fold_1',
            pos: { x: -250, y: 210 },
            acceptTypes: [CLOTH],
            size: { w: 90, h: 90 },
            hintSprite: 'hint_fold',
            label: '折好上衣',
        },
        {
            id: 'bed_fold_2',
            pos: { x: -110, y: 210 },
            acceptTypes: [CLOTH],
            size: { w: 90, h: 90 },
            hintSprite: 'hint_fold',
            label: '折好裤子',
        },
        {
            id: 'bed_fold_3',
            pos: { x: 30, y: 210 },
            acceptTypes: [TOWEL],
            size: { w: 90, h: 90 },
            hintSprite: 'hint_fold',
            label: '折叠浴巾',
        },
        {
            id: 'bed_fold_4',
            pos: { x: 170, y: 210 },
            acceptTypes: [CLOTH],
            size: { w: 90, h: 90 },
            hintSprite: 'hint_fold',
            label: '折好连衣裙',
        },
        {
            id: 'bed_fold_5',
            pos: { x: 310, y: 210 },
            acceptTypes: [TOWEL],
            size: { w: 90, h: 90 },
            hintSprite: 'hint_fold',
            label: '折叠毛巾',
        },
    ],
    starThresholds: [50, 78, 100],
    isBoss: false,
    operations: [OperationType.DRAG, OperationType.FOLD],
    bgmKey: 'bgm_tutorial',
    rewards: {
        baseCoin: 80,
        toolFragments: 12,
    },
};

// 关卡5：物品归位（综合操作）
export const LEVEL_1_5: LevelDataConfig = {
    id: 5,
    chapter: 1,
    sceneName: 'living_room',
    sceneDisplayName: '物品归位',
    timeLimit: 150,
    items: [
        {
            id: 'living_book_yellow',
            type: BOOK,
            spriteKey: 'item_book_yellow',
            initialPos: { x: -280, y: -40 },
            targetSlotId: 'living_shelf_left',
            operation: OperationType.DRAG,
            sortOrder: 1,
        },
        {
            id: 'living_cup_tea',
            type: CUP,
            spriteKey: 'item_cup_tea',
            initialPos: { x: -120, y: -20 },
            targetSlotId: 'living_table_cup',
            operation: OperationType.DRAG,
            sortOrder: 2,
        },
        {
            id: 'living_towel_small',
            type: TOWEL,
            spriteKey: 'item_towel_small',
            initialPos: { x: 10, y: -60 },
            targetSlotId: 'living_fold_area',
            operation: OperationType.FOLD,
            sortOrder: 3,
        },
        {
            id: 'living_dust_cloth',
            type: CLOTH,
            spriteKey: 'item_cloth_dusty',
            initialPos: { x: 140, y: -10 },
            targetSlotId: 'living_wipe_area',
            operation: OperationType.WIPE,
            sortOrder: 4,
        },
        {
            id: 'living_book_purple',
            type: BOOK,
            spriteKey: 'item_book_purple',
            initialPos: { x: 270, y: -40 },
            targetSlotId: 'living_shelf_right',
            operation: OperationType.DRAG,
            sortOrder: 5,
        },
        {
            id: 'living_cup_coffee',
            type: CUP,
            spriteKey: 'item_cup_coffee',
            initialPos: { x: 380, y: -20 },
            targetSlotId: 'living_table_cup',
            operation: OperationType.DRAG,
            sortOrder: 6,
        },
        {
            id: 'living_toy_car',
            type: TOY,
            spriteKey: 'item_toy_car',
            initialPos: { x: 80, y: -110 },
            targetSlotId: 'living_toy_box',
            operation: OperationType.DRAG,
            sortOrder: 7,
        },
    ],
    slots: [
        {
            id: 'living_shelf_left',
            pos: { x: -260, y: 220 },
            acceptTypes: [BOOK],
            size: { w: 90, h: 110 },
            hintSprite: 'hint_book',
            label: '左侧书架归位',
        },
        {
            id: 'living_table_cup',
            pos: { x: -70, y: 205 },
            acceptTypes: [CUP],
            size: { w: 140, h: 80 },
            hintSprite: 'hint_cup',
            label: '杯子摆回茶几',
        },
        {
            id: 'living_fold_area',
            pos: { x: 120, y: 205 },
            acceptTypes: [TOWEL],
            size: { w: 100, h: 90 },
            hintSprite: 'hint_fold',
            label: '折叠并收好毛巾',
        },
        {
            id: 'living_wipe_area',
            pos: { x: 280, y: 90 },
            acceptTypes: [CLOTH],
            size: { w: 180, h: 140 },
            hintSprite: 'hint_wipe',
            label: '擦净电视柜台面',
        },
        {
            id: 'living_shelf_right',
            pos: { x: 420, y: 220 },
            acceptTypes: [BOOK],
            size: { w: 90, h: 110 },
            hintSprite: 'hint_book',
            label: '右侧书架归位',
        },
        {
            id: 'living_toy_box',
            pos: { x: 430, y: 80 },
            acceptTypes: [TOY],
            size: { w: 110, h: 90 },
            hintSprite: 'hint_toy',
            label: '玩具放回收纳箱',
        },
    ],
    starThresholds: [55, 82, 100],
    isBoss: true,
    operations: [OperationType.DRAG, OperationType.WIPE, OperationType.FOLD],
    bgmKey: 'bgm_tutorial_boss',
    rewards: {
        baseCoin: 150,
        toolFragments: 20,
    },
};

export const CHAPTER_1_LEVELS: LevelDataConfig[] = [
    LEVEL_1_1,
    LEVEL_1_2,
    LEVEL_1_3,
    LEVEL_1_4,
    LEVEL_1_5,
];

export const LEVEL_MAP: Record<number, LevelDataConfig> = {
    1: LEVEL_1_1,
    2: LEVEL_1_2,
    3: LEVEL_1_3,
    4: LEVEL_1_4,
    5: LEVEL_1_5,
    201: LEVEL_2_1,
};

export function getLevelConfig(levelId: number): LevelDataConfig | undefined {
    return LEVEL_MAP[levelId];
}

export function getChapterLevels(chapter: number): LevelDataConfig[] {
    return [...CHAPTER_1_LEVELS, ...CHAPTER_2_LEVELS].filter(level => level.chapter === chapter);
}
