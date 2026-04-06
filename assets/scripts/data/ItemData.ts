/**
 * 物品数据定义
 */

export interface ItemData {
    id: string;
    name: string;
    type: string;
    category: string;      // 类别：furniture,文具,厨具,衣物,浴室用品等
    spriteKey: string;
    rarity: number;        // 稀有度 1-5
    description: string;
    unlockLevel: number;   // 解锁所需关卡
}

export const ITEM_CATEGORIES = {
    FURNITURE: 'furniture',
    STATIONERY: 'stationery',
    KITCHENWARE: 'kitchenware',
    CLOTHING: 'clothing',
    BATHROOM: 'bathroom',
    DECORATION: 'decoration'
} as const;
