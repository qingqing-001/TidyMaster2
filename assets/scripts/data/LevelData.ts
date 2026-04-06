/**
 * 关卡数据结构定义
 */

export interface LevelConfig {
    id: number;                    // 关卡ID
    chapter: number;               // 章节号
    sceneName: string;             // 场景名（desk/kitchen/closet等）
    timeLimit: number;             // 时间限制（秒），0=无限制
    items: ItemConfig[];           // 物品列表
    slots: SlotConfig[];           // 目标位置列表
    starThresholds: [number, number, number]; // 1/2/3星的完成度阈值
    isBoss: boolean;               // 是否BOSS关
    operations: OperationType[];   // 本关涉及的操作类型
    bgmKey: string;                // 背景音乐key
    rewards?: {
        baseCoin: number;
        toolFragments: number;
    };
}

export interface ItemConfig {
    id: string;                    // 物品唯一ID
    type: string;                  // 物品类型（book/cup/cloth等）
    spriteKey: string;             // 图片资源key
    initialPos: { x: number, y: number }; // 初始位置
    targetSlotId: string;          // 目标位置ID
    operation: OperationType;      // 需要的操作类型
    sortOrder: number;             // 渲染排序
}

export interface SlotConfig {
    id: string;                    // 位置唯一ID
    pos: { x: number, y: number }; // 目标位置
    acceptTypes: string[];         // 接受的物品类型
    size: { w: number, h: number }; // 区域大小
    hintSprite?: string;           // 提示图标
}

export enum OperationType {
    DRAG = 'drag',       // 拖拽
    WIPE = 'wipe',       // 擦洗
    FOLD = 'fold',       // 折叠
    ROTATE = 'rotate'    // 旋转
}
