import { _decorator, Component, Node, Vec3, SpriteFrame } from 'cc';
import { DataManager } from '../core/DataManager';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';

const { ccclass } = _decorator;

/**
 * 装饰品配置
 */
export interface DecorationConfig {
    id: string;
    name: string;
    category: DecorationCategory;
    price: number;
    unlockLevel?: number; // 解锁所需关卡
    spriteFrame?: SpriteFrame;
}

/**
 * 装饰品分类
 */
export enum DecorationCategory {
    FURNITURE = 'furniture',      // 家具
    PLANT = 'plant',              // 植物
    POSTER = 'poster',            // 挂画
    RUG = 'rug',                  // 地毯
    LAMP = 'lamp',                // 灯具
    DECORATION = 'decoration',    // 装饰品
}

/**
 * 已放置的装饰品
 */
export interface PlacedDecoration {
    id: string;
    decorationId: string;
    position: { x: number; y: number };
    rotation: number;
    scale: number;
}

/**
 * 房间数据
 */
export interface RoomData {
    placedDecorations: PlacedDecoration[];
    ownedDecorations: string[];
    backgroundId: string;
}

/**
 * 房间装饰管理器
 * 管理我的房间装饰系统
 */
@ccclass('RoomDecorationManager')
export class RoomDecorationManager extends Component {
    private static _instance: RoomDecorationManager;

    static get instance(): RoomDecorationManager {
        if (!this._instance) {
            this._instance = new RoomDecorationManager();
        }
        return this._instance;
    }

    // 存储key
    private static readonly STORAGE_KEY = 'tidy_master_room';
    private static readonly OWNED_KEY = 'tidy_master_room_owned';
    private static readonly BACKGROUND_KEY = 'tidy_master_room_bg';

    // 房间数据
    private _roomData: RoomData = {
        placedDecorations: [],
        ownedDecorations: [],
        backgroundId: 'default',
    };

    // 装饰品配置
    private _decorationConfigs: Map<string, DecorationConfig> = new Map();

    // 已拥有的装饰品ID集合
    private _ownedDecorations: Set<string> = new Set();

    private constructor() {
        super();
        this.initDecorationConfigs();
        this.loadData();
    }

    onLoad() {
        this.loadData();
    }

    // ==================== 初始化 ====================

    /**
     * 初始化装饰品配置
     */
    private initDecorationConfigs(): void {
        // 家具类
        this.registerDecoration({
            id: 'furniture_sofa_1',
            name: '简约沙发',
            category: DecorationCategory.FURNITURE,
            price: 100,
            unlockLevel: 5,
        });

        this.registerDecoration({
            id: 'furniture_sofa_2',
            name: '豪华沙发',
            category: DecorationCategory.FURNITURE,
            price: 300,
            unlockLevel: 15,
        });

        this.registerDecoration({
            id: 'furniture_table_1',
            name: '茶几',
            category: DecorationCategory.FURNITURE,
            price: 80,
            unlockLevel: 3,
        });

        this.registerDecoration({
            id: 'furniture_table_2',
            name: '大理石茶几',
            category: DecorationCategory.FURNITURE,
            price: 250,
            unlockLevel: 20,
        });

        this.registerDecoration({
            id: 'furniture_bed_1',
            name: '单人床',
            category: DecorationCategory.FURNITURE,
            price: 200,
            unlockLevel: 10,
        });

        this.registerDecoration({
            id: 'furniture_bed_2',
            name: '双人床',
            category: DecorationCategory.FURNITURE,
            price: 400,
            unlockLevel: 25,
        });

        this.registerDecoration({
            id: 'furniture_bookshelf_1',
            name: '书架',
            category: DecorationCategory.FURNITURE,
            price: 150,
            unlockLevel: 8,
        });

        // 植物类
        this.registerDecoration({
            id: 'plant_potted_1',
            name: '绿萝',
            category: DecorationCategory.PLANT,
            price: 50,
            unlockLevel: 2,
        });

        this.registerDecoration({
            id: 'plant_potted_2',
            name: '吊兰',
            category: DecorationCategory.PLANT,
            price: 80,
            unlockLevel: 6,
        });

        this.registerDecoration({
            id: 'plant_succulent_1',
            name: '多肉植物',
            category: DecorationCategory.PLANT,
            price: 60,
            unlockLevel: 4,
        });

        this.registerDecoration({
            id: 'plant_bonsai_1',
            name: '盆景',
            category: DecorationCategory.PLANT,
            price: 200,
            unlockLevel: 18,
        });

        // 挂画类
        this.registerDecoration({
            id: 'poster_landscape_1',
            name: '山水画',
            category: DecorationCategory.POSTER,
            price: 120,
            unlockLevel: 7,
        });

        this.registerDecoration({
            id: 'poster_portrait_1',
            name: '人物画',
            category: DecorationCategory.POSTER,
            price: 150,
            unlockLevel: 12,
        });

        this.registerDecoration({
            id: 'poster_abstract_1',
            name: '抽象画',
            category: DecorationCategory.POSTER,
            price: 180,
            unlockLevel: 16,
        });

        // 地毯类
        this.registerDecoration({
            id: 'rug_simple_1',
            name: '简约地毯',
            category: DecorationCategory.RUG,
            price: 80,
            unlockLevel: 5,
        });

        this.registerDecoration({
            id: 'rug_persian_1',
            name: '波斯地毯',
            category: DecorationCategory.RUG,
            price: 300,
            unlockLevel: 22,
        });

        // 灯具类
        this.registerDecoration({
            id: 'lamp_desk_1',
            name: '台灯',
            category: DecorationCategory.LAMP,
            price: 60,
            unlockLevel: 3,
        });

        this.registerDecoration({
            id: 'lamp_floor_1',
            name: '落地灯',
            category: DecorationCategory.LAMP,
            price: 120,
            unlockLevel: 9,
        });

        this.registerDecoration({
            id: 'lamp_ceiling_1',
            name: '吊灯',
            category: DecorationCategory.LAMP,
            price: 250,
            unlockLevel: 20,
        });

        // 装饰品类
        this.registerDecoration({
            id: 'decor_clock_1',
            name: '时钟',
            category: DecorationCategory.DECORATION,
            price: 50,
            unlockLevel: 2,
        });

        this.registerDecoration({
            id: 'decor_vase_1',
            name: '花瓶',
            category: DecorationCategory.DECORATION,
            price: 80,
            unlockLevel: 4,
        });

        this.registerDecoration({
            id: 'decor_photo_1',
            name: '相框',
            category: DecorationCategory.DECORATION,
            price: 40,
            unlockLevel: 1,
        });

        this.registerDecoration({
            id: 'decor_toy_1',
            name: '毛绒玩具',
            category: DecorationCategory.DECORATION,
            price: 60,
            unlockLevel: 6,
        });

        // 初始赠送的装饰品
        this._ownedDecorations.add('decor_photo_1');
        this._ownedDecorations.add('plant_potted_1');
    }

    /**
     * 注册装饰品配置
     */
    private registerDecoration(config: DecorationConfig): void {
        this._decorationConfigs.set(config.id, config);
    }

    // ==================== 数据加载/保存 ====================

    /**
     * 加载房间数据
     */
    private loadData(): void {
        try {
            const roomData = localStorage.getItem(RoomDecorationManager.STORAGE_KEY);
            if (roomData) {
                this._roomData = JSON.parse(roomData);
            }

            const ownedData = localStorage.getItem(RoomDecorationManager.OWNED_KEY);
            if (ownedData) {
                const owned = JSON.parse(ownedData);
                this._ownedDecorations = new Set(owned);
            } else {
                // 初始化默认拥有的装饰品
                this._ownedDecorations.add('decor_photo_1');
                this._ownedDecorations.add('plant_potted_1');
            }

            const bgData = localStorage.getItem(RoomDecorationManager.BACKGROUND_KEY);
            if (bgData) {
                this._roomData.backgroundId = bgData;
            }
        } catch (e) {
            console.error('[RoomDecorationManager] 加载数据失败:', e);
        }
    }

    /**
     * 保存房间数据
     */
    private saveData(): void {
        try {
            localStorage.setItem(RoomDecorationManager.STORAGE_KEY, JSON.stringify(this._roomData));
            localStorage.setItem(RoomDecorationManager.OWNED_KEY, JSON.stringify(Array.from(this._ownedDecorations)));
            localStorage.setItem(RoomDecorationManager.BACKGROUND_KEY, this._roomData.backgroundId);
        } catch (e) {
            console.error('[RoomDecorationManager] 保存数据失败:', e);
        }
    }

    // ==================== 装饰品获取 ====================

    /**
     * 购买装饰品
     * @param decorationId 装饰品ID
     * @returns 是否购买成功
     */
    purchaseDecoration(decorationId: string): boolean {
        const config = this._decorationConfigs.get(decorationId);
        if (!config) {
            console.log(`[RoomDecorationManager] 装饰品不存在: ${decorationId}`);
            return false;
        }

        if (this._ownedDecorations.has(decorationId)) {
            console.log(`[RoomDecorationManager] 已拥有: ${decorationId}`);
            return false;
        }

        const dataManager = DataManager.getInstance();
        if (!dataManager.deductCoins(config.price)) {
            console.log(`[RoomDecorationManager] 金币不足: 需要 ${config.price}`);
            return false;
        }

        this._ownedDecorations.add(decorationId);
        this.saveData();

        console.log(`[RoomDecorationManager] 购买装饰品成功: ${config.name}`);
        return true;
    }

    /**
     * 解锁装饰品 (通过关卡或其他方式)
     */
    unlockDecoration(decorationId: string): boolean {
        if (this._ownedDecorations.has(decorationId)) {
            return false;
        }

        this._ownedDecorations.add(decorationId);
        this.saveData();

        // 发送解锁事件
        const eventManager = EventManager.getInstance();
        const config = this._decorationConfigs.get(decorationId);
        eventManager.emit(GAME_EVENTS.ROOM_DECORATION_PLACED, {
            decorationId: decorationId,
            name: config?.name || decorationId,
            action: 'unlock',
        });

        return true;
    }

    /**
     * 是否已拥有
     */
    isOwned(decorationId: string): boolean {
        return this._ownedDecorations.has(decorationId);
    }

    /**
     * 获取已拥有装饰品列表
     */
    getOwnedDecorations(): string[] {
        return Array.from(this._ownedDecorations);
    }

    /**
     * 获取所有可购买的装饰品
     */
    getAllDecorationConfigs(): DecorationConfig[] {
        return Array.from(this._decorationConfigs.values());
    }

    /**
     * 根据分类获取装饰品
     */
    getDecorationsByCategory(category: DecorationCategory): DecorationConfig[] {
        const result: DecorationConfig[] = [];
        for (const config of this._decorationConfigs.values()) {
            if (config.category === category) {
                result.push(config);
            }
        }
        return result;
    }

    /**
     * 获取装饰品配置
     */
    getDecorationConfig(decorationId: string): DecorationConfig | undefined {
        return this._decorationConfigs.get(decorationId);
    }

    // ==================== 放置装饰品 ====================

    /**
     * 放置装饰品
     * @param decorationId 装饰品ID
     * @param x X坐标
     * @param y Y坐标
     * @param rotation 旋转角度
     * @param scale 缩放
     * @returns 是否放置成功
     */
    placeDecoration(
        decorationId: string,
        x: number,
        y: number,
        rotation: number = 0,
        scale: number = 1
    ): boolean {
        if (!this._ownedDecorations.has(decorationId)) {
            console.log(`[RoomDecorationManager] 未拥有装饰品: ${decorationId}`);
            return false;
        }

        const placed: PlacedDecoration = {
            id: `placed_${Date.now()}`,
            decorationId: decorationId,
            position: { x, y },
            rotation,
            scale,
        };

        this._roomData.placedDecorations.push(placed);
        this.saveData();

        // 发送放置事件
        const eventManager = EventManager.getInstance();
        const config = this._decorationConfigs.get(decorationId);
        eventManager.emit(GAME_EVENTS.ROOM_DECORATION_PLACED, {
            decorationId: decorationId,
            name: config?.name || decorationId,
            position: { x, y },
            action: 'place',
        });

        console.log(`[RoomDecorationManager] 放置装饰品: ${config?.name}`);
        return true;
    }

    /**
     * 移除装饰品
     * @param placedId 已放置装饰品的ID
     * @returns 是否移除成功
     */
    removeDecoration(placedId: string): boolean {
        const index = this._roomData.placedDecorations.findIndex((d) => d.id === placedId);
        if (index === -1) {
            return false;
        }

        this._roomData.placedDecorations.splice(index, 1);
        this.saveData();

        return true;
    }

    /**
     * 更新装饰品位置
     */
    updateDecorationPosition(placedId: string, x: number, y: number): boolean {
        const placed = this._roomData.placedDecorations.find((d) => d.id === placedId);
        if (!placed) {
            return false;
        }

        placed.position = { x, y };
        this.saveData();

        return true;
    }

    /**
     * 获取所有已放置的装饰品
     */
    getPlacedDecorations(): PlacedDecoration[] {
        return [...this._roomData.placedDecorations];
    }

    /**
     * 清除所有装饰品
     */
    clearAllDecorations(): void {
        this._roomData.placedDecorations = [];
        this.saveData();
    }

    // ==================== 背景管理 ====================

    /**
     * 设置房间背景
     */
    setBackground(backgroundId: string): void {
        this._roomData.backgroundId = backgroundId;
        this.saveData();
    }

    /**
     * 获取当前背景ID
     */
    getBackgroundId(): string {
        return this._roomData.backgroundId;
    }

    // ==================== 重置 ====================

    /**
     * 重置房间数据
     */
    reset(): void {
        this._roomData = {
            placedDecorations: [],
            ownedDecorations: [],
            backgroundId: 'default',
        };
        this._ownedDecorations.clear();
        this._ownedDecorations.add('decor_photo_1');
        this._ownedDecorations.add('plant_potted_1');
        this.saveData();
    }
}