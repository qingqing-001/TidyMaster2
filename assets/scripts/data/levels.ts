/**
 * 关游戏关卡配置数据
 * 第1章：教学关卡（Chapter 1 - Tutorial）
 */

import { OperationType } from './LevelData';
import { LevelDataConfig } from './types';

// 物品类型字符串常量
const BOOK = 'book';
const PEN = 'pen';
const CUP = 'cup';
const PLATE = 'plate';
const CLOTH = 'cloth';
const TOWEL = 'towel';
const FORK = 'fork';
const SPOON = 'spoon';
const BOTTLE = 'bottle';

// 关卡1：书桌整理（拖拽书籍）
export const LEVEL_1_1: LevelDataConfig = {
    id: 1,
    chapter: 1,
    sceneName: 'desk',
    sceneDisplayName: '书桌',
    timeLimit: 0,  // 无时间限制
    items: [
        {
            id: 'book_1',
            type: BOOK,
            spriteKey: 'item_book_blue',
            initialPos: { x: 100, y: 300 },
            targetSlotId: 'slot_bookshelf_1',
            operation: OperationType.DRAG,
            sortOrder: 1,
        },
        {
            id: 'book_2',
            type: BOOK,
            spriteKey: 'item_book_red',
            initialPos: { x: 200, y: 320 },
            targetSlotId: 'slot_bookshelf_2',
            operation: OperationType.DRAG,
            sortOrder: 2,
        },
        {
            id: 'book_3',
            type: BOOK,
            spriteKey: 'item_book_green',
            initialPos: { x: 300, y: 280 },
            targetSlotId: 'slot_bookshelf_3',
            operation: OperationType.DRAG,
            sortOrder: 3,
        },
        {
            id: 'pen_1',
            type: PEN,
            spriteKey: 'item_pen_blue',
            initialPos: { x: 400, y: 350 },
            targetSlotId: 'slot_pencil_case',
            operation: OperationType.DRAG,
            sortOrder: 4,
        },
        {
            id: 'pen_2',
            type: PEN,
            spriteKey: 'item_pen_red',
            initialPos: { x: 500, y: 330 },
            targetSlotId: 'slot_pencil_case',
            operation: OperationType.DRAG,
            sortOrder: 5,
        },
    ],
    slots: [
        {
            id: 'slot_bookshelf_1',
            pos: { x: 150, y: 100 },
            acceptTypes: [BOOK],
            size: { w: 80, h: 100 },
            hintSprite: 'hint_book',
        },
        {
            id: 'slot_bookshelf_2',
            pos: { x: 250, y: 100 },
            acceptTypes: [BOOK],
            size: { w: 80, h: 100 },
            hintSprite: 'hint_book',
        },
        {
            id: 'slot_bookshelf_3',
            pos: { x: 350, y: 100 },
            acceptTypes: [BOOK],
            size: { w: 80, h: 100 },
            hintSprite: 'hint_book',
        },
        {
            id: 'slot_pencil_case',
            pos: { x: 450, y: 120 },
            acceptTypes: [PEN],
            size: { w: 60, h: 80 },
            hintSprite: 'hint_pen',
        },
    ],
    starThresholds: [60, 80, 100],  // 1星60分，2星80分，3星100分
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
    sceneDisplayName: '厨房',
    timeLimit: 0,
    items: [
        {
            id: 'plate_1',
            type: PLATE,
            spriteKey: 'item_plate_white',
            initialPos: { x: 80, y: 280 },
            targetSlotId: 'slot_plate_rack',
            operation: OperationType.DRAG,
            sortOrder: 1,
        },
        {
            id: 'plate_2',
            type: PLATE,
            spriteKey: 'item_plate_blue',
            initialPos: { x: 180, y: 300 },
            targetSlotId: 'slot_plate_rack',
            operation: OperationType.DRAG,
            sortOrder: 2,
        },
        {
            id: 'cup_1',
            type: CUP,
            spriteKey: 'item_cup_mug',
            initialPos: { x: 280, y: 320 },
            targetSlotId: 'slot_cup_holder',
            operation: OperationType.DRAG,
            sortOrder: 3,
        },
        {
            id: 'cup_2',
            type: CUP,
            spriteKey: 'item_cup_glass',
            initialPos: { x: 380, y: 290 },
            targetSlotId: 'slot_cup_holder',
            operation: OperationType.DRAG,
            sortOrder: 4,
        },
        {
            id: 'fork_1',
            type: FORK,
            spriteKey: 'item_fork',
            initialPos: { x: 480, y: 310 },
            targetSlotId: 'slot_cutlery_tray',
            operation: OperationType.DRAG,
            sortOrder: 5,
        },
        {
            id: 'spoon_1',
            type: SPOON,
            spriteKey: 'item_spoon',
            initialPos: { x: 550, y: 330 },
            targetSlotId: 'slot_cutlery_tray',
            operation: OperationType.DRAG,
            sortOrder: 6,
        },
    ],
    slots: [
        {
            id: 'slot_plate_rack',
            pos: { x: 130, y: 100 },
            acceptTypes: [PLATE],
            size: { w: 120, h: 100 },
            hintSprite: 'hint_plate',
        },
        {
            id: 'slot_cup_holder',
            pos: { x: 330, y: 100 },
            acceptTypes: [CUP],
            size: { w: 100, h: 80 },
            hintSprite: 'hint_cup',
        },
        {
            id: 'slot_cutlery_tray',
            pos: { x: 500, y: 120 },
            acceptTypes: [FORK, SPOON],
            size: { w: 90, h: 70 },
            hintSprite: 'hint_cutlery',
        },
    ],
    starThresholds: [50, 75, 100],
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
    sceneDisplayName: '餐桌',
    timeLimit: 90,  // 90秒时间限制
    items: [
        {
            id: 'bottle_1',
            type: BOTTLE,
            spriteKey: 'item_bottle_water',
            initialPos: { x: 120, y: 320 },
            targetSlotId: 'slot_bottle_rack',
            operation: OperationType.DRAG,
            sortOrder: 1,
        },
        {
            id: 'towel_1',
            type: TOWEL,
            spriteKey: 'item_towel_clean',
            initialPos: { x: 250, y: 340 },
            targetSlotId: 'slot_dirty_surface',
            operation: OperationType.WIPE,
            sortOrder: 2,
        },
        {
            id: 'plate_dirty',
            type: PLATE,
            spriteKey: 'item_plate_dirty',
            initialPos: { x: 400, y: 300 },
            targetSlotId: 'slot_wash_area',
            operation: OperationType.DRAG,
            sortOrder: 3,
        },
        {
            id: 'cup_dirty',
            type: CUP,
            spriteKey: 'item_cup_dirty',
            initialPos: { x: 520, y: 280 },
            targetSlotId: 'slot_wash_area',
            operation: OperationType.DRAG,
            sortOrder: 4,
        },
    ],
    slots: [
        {
            id: 'slot_bottle_rack',
            pos: { x: 150, y: 100 },
            acceptTypes: [BOTTLE],
            size: { w: 60, h: 80 },
            hintSprite: 'hint_bottle',
        },
        {
            id: 'slot_dirty_surface',
            pos: { x: 300, y: 200 },
            acceptTypes: [TOWEL],
            size: { w: 150, h: 100 },
            hintSprite: 'hint_wipe',
            label: '擦洗污渍',
        },
        {
            id: 'slot_wash_area',
            pos: { x: 480, y: 100 },
            acceptTypes: [PLATE, CUP],
            size: { w: 100, h: 100 },
            hintSprite: 'hint_wash',
        },
    ],
    starThresholds: [40, 70, 100],
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
    sceneDisplayName: '卧室',
    timeLimit: 120,
    items: [
        {
            id: 'cloth_1',
            type: CLOTH,
            spriteKey: 'item_shirt_tshirt',
            initialPos: { x: 100, y: 300 },
            targetSlotId: 'slot_fold_area_1',
            operation: OperationType.FOLD,
            sortOrder: 1,
        },
        {
            id: 'cloth_2',
            type: CLOTH,
            spriteKey: 'item_shirt_pants',
            initialPos: { x: 220, y: 320 },
            targetSlotId: 'slot_fold_area_2',
            operation: OperationType.FOLD,
            sortOrder: 2,
        },
        {
            id: 'towel_2',
            type: TOWEL,
            spriteKey: 'item_towel_bath',
            initialPos: { x: 340, y: 280 },
            targetSlotId: 'slot_fold_area_3',
            operation: OperationType.FOLD,
            sortOrder: 3,
        },
        {
            id: 'cloth_3',
            type: CLOTH,
            spriteKey: 'item_shirt_dress',
            initialPos: { x: 460, y: 310 },
            targetSlotId: 'slot_fold_area_4',
            operation: OperationType.FOLD,
            sortOrder: 4,
        },
        {
            id: 'towel_3',
            type: TOWEL,
            spriteKey: 'item_towel_hand',
            initialPos: { x: 580, y: 330 },
            targetSlotId: 'slot_fold_area_5',
            operation: OperationType.FOLD,
            sortOrder: 5,
        },
    ],
    slots: [
        {
            id: 'slot_fold_area_1',
            pos: { x: 130, y: 100 },
            acceptTypes: [CLOTH],
            size: { w: 80, h: 80 },
            hintSprite: 'hint_fold',
        },
            {
            id: 'slot_fold_area_2',
            pos: { x: 250, y: 100 },
            acceptTypes: [CLOTH],
            size: { w: 80, h: 80 },
            hintSprite: 'hint_fold',
        },
        {
            id: 'slot_fold_area_3',
            pos: { x: 370, y: 100 },
            acceptTypes: [TOWEL],
            size: { w: 80, h: 80 },
            hintSprite: 'hint_fold',
        },
        {
            id: 'slot_fold_area_4',
            pos: { x: 490, y: 100 },
            acceptTypes: [CLOTH],
            size: { w: 80, h: 80 },
            hintSprite: 'hint_fold',
        },
        {
            id: 'slot_fold_area_5',
            pos: { x: 610, y: 100 },
            acceptTypes: [TOWEL],
            size: { w: 80, h: 80 },
            hintSprite: 'hint_fold',
        },
    ],
    starThresholds: [45, 75, 100],
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
    sceneDisplayName: '客厅',
    timeLimit: 150,
    items: [
        {
            id: 'book_4',
            type: BOOK,
            spriteKey: 'item_book_yellow',
            initialPos: { x: 80, y: 320 },
            targetSlotId: 'slot_shelf_1',
            operation: OperationType.DRAG,
            sortOrder: 1,
        },
        {
            id: 'cup_3',
            type: CUP,
            spriteKey: 'item_cup_tea',
            initialPos: { x: 200, y: 340 },
            targetSlotId: 'slot_table',
            operation: OperationType.DRAG,
            sortOrder: 2,
        },
        {
            id: 'towel_4',
            type: TOWEL,
            spriteKey: 'item_towel_small',
            initialPos: { x: 320, y: 300 },
            targetSlotId: 'slot_fold_area',
            operation: OperationType.FOLD,
            sortOrder: 3,
        },
        {
            id: 'cloth_4',
            type: CLOTH,
            spriteKey: 'item_cloth_dusty',
            initialPos: { x: 440, y: 280 },
            targetSlotId: 'slot_wipe_area',
            operation: OperationType.WIPE,
            sortOrder: 4,
        },
        {
            id: 'book_5',
            type: BOOK,
            spriteKey: 'item_book_purple',
            initialPos: { x: 560, y: 330 },
            targetSlotId: 'slot_shelf_2',
            operation: OperationType.DRAG,
            sortOrder: 5,
        },
        {
            id: 'cup_4',
            type: CUP,
            spriteKey: 'item_cup_coffee',
            initialPos: { x: 680, y: 310 },
            targetSlotId: 'slot_table',
            operation: OperationType.DRAG,
            sortOrder: 6,
        },
    ],
    slots: [
        {
            id: 'slot_shelf_1',
            pos: { x: 120, y: 100 },
            acceptTypes: [BOOK],
            size: { w: 70, h: 90 },
            hintSprite: 'hint_book',
        },
        {
            id: 'slot_table',
            pos: { x: 280, y: 150 },
            acceptTypes: [CUP],
            size: { w: 100, h: 60 },
            hintSprite: 'hint_cup',
        },
        {
            id: 'slot_fold_area',
            pos: { x: 400, y: 100 },
            acceptTypes: [TOWEL],
            size: { w: 80, h: 80 },
            hintSprite: 'hint_fold',
        },
        {
            id: 'slot_wipe_area',
            pos: { x: 520, y: 200 },
            acceptTypes: [CLOTH],
            size: { w: 100, h: 80 },
            hintSprite: 'hint_wipe',
        },
        {
            id: 'slot_shelf_2',
            pos: { x: 640, y: 100 },
            acceptTypes: [BOOK],
            size: { w: 70, h: 90 },
            hintSprite: 'hint_book',
        },
    ],
    starThresholds: [50, 80, 100],
    isBoss: true,  // 这是第一关BOSS关
    operations: [OperationType.DRAG, OperationType.WIPE, OperationType.FOLD],
    bgmKey: 'bgm_tutorial_boss',
    rewards: {
        baseCoin: 150,
        toolFragments: 20,
    },
};

// 所有关卡配置列表
export const CHAPTER_1_LEVELS: LevelDataConfig[] = [
    LEVEL_1_1,
    LEVEL_1_2,
    LEVEL_1_3,
    LEVEL_1_4,
    LEVEL_1_5,
];

// 关卡ID到配置的映射
export const LEVEL_MAP: Record<number, LevelDataConfig> = {
    1: LEVEL_1_1,
    2: LEVEL_1_2,
    3: LEVEL_1_3,
    4: LEVEL_1_4,
    5: LEVEL_1_5,
};

// 获取关卡配置的辅助函数
export function getLevelConfig(levelId: number): LevelDataConfig | undefined {
    return LEVEL_MAP[levelId];
}

// 获取章节的所有关卡
export function getChapterLevels(chapter: number): LevelDataConfig[] {
    return CHAPTER_1_LEVELS.filter(level => level.chapter === chapter);
}
