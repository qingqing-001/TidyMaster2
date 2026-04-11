import { _decorator, Component, Node, Label, Sprite, director } from 'cc';
import { EventManager } from '../core/EventManager';
import { DataManager } from '../core/DataManager';
import { GAME_EVENTS } from '../../data/constants';
import { RoomDecorationManager, DecorationCategory, PlacedDecoration } from '../collection/RoomDecorationManager';

const { ccclass, property } = _decorator;

/**
 * 我的房间场景
 * 玩家可以装饰个人空间，好友可以访问
 */
@ccclass('MyRoomScene')
export class MyRoomScene extends Component {
    // UI节点引用
    @property({ type: Node, tooltip: '装饰品容器' })
    public decorationContainer: Node | null = null;

    @property({ type: Node, tooltip: '商店按钮' })
    public shopBtn: Node | null = null;

    @property({ type: Node, tooltip: '返回按钮' })
    public backBtn: Node | null = null;

    @property({ type: Label, tooltip: '金币显示' })
    public coinLabel: Label | null = null;

    @property({ type: Node, tooltip: '装饰品列表面板' })
    public decorationPanel: Node | null = null;

    // 管理器
    private _roomManager: RoomDecorationManager | null = null;
    private _eventManager: EventManager | null = null;
    private _placedDecorationNodes: Map<string, Node> = new Map();

    onLoad() {
        // 初始化管理器
        this._roomManager = this.resolveRoomManager();
        if (!this._roomManager) {
            console.warn('[MyRoomScene] 未找到 RoomDecorationManager，当前仅跳过房间装饰加载。');
        }
        this._eventManager = EventManager.getInstance();

        // 注册事件监听
        this.registerEvents();
    }

    start() {
        // 加载房间数据
        this.loadRoomData();
        
        // 更新金币显示
        this.updateCoinDisplay();
    }

    /**
     * 注册事件监听
     */
    private registerEvents(): void {
        if (!this._eventManager) return;

        // 监听金币变化
        this._eventManager.on(GAME_EVENTS.COIN_CHANGE, this.onCoinChange, this);

        // 监听装饰品放置事件
        this._eventManager.on(GAME_EVENTS.ROOM_DECORATION_PLACED, this.onDecorationPlaced, this);
    }

    /**
     * 注销事件监听
     */
    private unregisterEvents(): void {
        if (!this._eventManager) return;

        this._eventManager.off(GAME_EVENTS.COIN_CHANGE, this.onCoinChange, this);
        this._eventManager.off(GAME_EVENTS.ROOM_DECORATION_PLACED, this.onDecorationPlaced, this);
    }

    /**
     * 加载房间数据
     */
    private loadRoomData(): void {
        if (!this.decorationContainer) return;

        this._roomManager = this._roomManager || this.resolveRoomManager();
        if (!this._roomManager) return;

        this.clearPlacedDecorationNodes();

        // 获取已放置的装饰品
        const placedDecorations = this._roomManager.getPlacedDecorations();

        for (const placed of placedDecorations) {
            this.createDecorationNode(placed);
        }

        console.log(`[MyRoomScene] 加载了 ${placedDecorations.length} 个装饰品`);
    }

    /**
     * 创建装饰品节点
     */
    private createDecorationNode(placed: PlacedDecoration): void {
        if (!this.decorationContainer || this._placedDecorationNodes.has(placed.id)) return;

        const config = this._roomManager?.getDecorationConfig(placed.decorationId);
        if (!config) return;

        // 创建节点
        const node = new Node(`Decoration_${placed.id}`);
        node.setParent(this.decorationContainer);
        node.setPosition(placed.position.x, placed.position.y, 0);

        // 设置缩放 (旋转在Cocos中处理较复杂，这里简化处理)
        node.setScale(placed.scale, placed.scale, 1);

        // 添加Sprite组件（实际项目中应该使用预制体）
        const sprite = node.addComponent(Sprite);
        
        // 存储引用
        this._placedDecorationNodes.set(placed.id, node);

        console.log(`[MyRoomScene] 创建装饰品节点: ${config.name}`);
    }

    /**
     * 放置装饰品
     * @param itemId 装饰品ID
     * @param x X坐标
     * @param y Y坐标
     */
    placeDecoration(itemId: string, x: number, y: number): void {
        if (!this._roomManager) return;

        // 调用管理器放置装饰品
        const success = this._roomManager.placeDecoration(itemId, x, y);

        if (success) {
            console.log(`[MyRoomScene] 放置装饰品成功: ${itemId} at (${x}, ${y})`);
        } else {
            console.log(`[MyRoomScene] 放置装饰品失败: ${itemId}`);
        }
    }

    /**
     * 购买装饰品
     * @param decorationId 装饰品ID
     */
    purchaseDecoration(decorationId: string): void {
        if (!this._roomManager) return;

        const success = this._roomManager.purchaseDecoration(decorationId);

        if (success) {
            console.log(`[MyRoomScene] 购买装饰品成功: ${decorationId}`);
            this.updateCoinDisplay();
        } else {
            console.log(`[MyRoomScene] 购买装饰品失败: ${decorationId}`);
        }
    }

    /**
     * 移除装饰品
     * @param placedId 已放置装饰品的ID
     */
    removeDecoration(placedId: string): void {
        if (!this._roomManager) return;

        const success = this._roomManager.removeDecoration(placedId);

        if (success) {
            // 移除节点
            const node = this._placedDecorationNodes.get(placedId);
            if (node) {
                node.destroy();
                this._placedDecorationNodes.delete(placedId);
            }
            console.log(`[MyRoomScene] 移除装饰品成功: ${placedId}`);
        }
    }

    /**
     * 获取所有可购买的装饰品
     */
    getAvailableDecorations(): any[] {
        if (!this._roomManager) return [];

        const allConfigs = this._roomManager.getAllDecorationConfigs();
        const owned = new Set(this._roomManager.getOwnedDecorations());

        // 返回未拥有的装饰品
        return allConfigs.filter(config => !owned.has(config.id));
    }

    /**
     * 获取已拥有的装饰品
     */
    getOwnedDecorations(): string[] {
        if (!this._roomManager) return [];
        return this._roomManager.getOwnedDecorations();
    }

    /**
     * 打开装饰品商店
     */
    openDecorationShop(): void {
        if (this.decorationPanel) {
            this.decorationPanel.active = true;
        }
        console.log('[MyRoomScene] 打开装饰品商店');
    }

    /**
     * 关闭装饰品商店
     */
    closeDecorationShop(): void {
        if (this.decorationPanel) {
            this.decorationPanel.active = false;
        }
    }

    /**
     * 好友访问
     */
    onFriendVisit(): void {
        console.log('[MyRoomScene] 收到好友访问事件，当前场景未配置访客提示 UI，保留日志记录。');
    }

    /**
     * 更新金币显示
     */
    private updateCoinDisplay(): void {
        if (!this.coinLabel) return;

        const coins = DataManager.getInstance().getCoins();
        this.coinLabel.string = coins.toString();
    }

    private resolveRoomManager(): RoomDecorationManager | null {
        if (RoomDecorationManager.instance) {
            return RoomDecorationManager.instance;
        }

        const scene = director.getScene();
        if (!scene) {
            return null;
        }

        const managerNode = new Node('RoomDecorationManager');
        scene.addChild(managerNode);
        return managerNode.addComponent(RoomDecorationManager);
    }

    private clearPlacedDecorationNodes(): void {
        for (const node of this._placedDecorationNodes.values()) {
            if (node.isValid) {
                node.destroy();
            }
        }
        this._placedDecorationNodes.clear();
        this.decorationContainer?.removeAllChildren();
    }

    /**
     * 金币变化回调
     */
    private onCoinChange(data?: { amount?: number; currentCoins?: number }): void {
        this.updateCoinDisplay();
    }

    /**
     * 装饰品放置事件回调
     */
    private onDecorationPlaced(data?: { decorationId: string; name: string; action: string }): void {
        if (data && data.action === 'place') {
            // 刷新显示
            this.loadRoomData();
        }
    }

    /**
     * 点击商店按钮
     */
    onShopClick(): void {
        this.openDecorationShop();
    }

    /**
     * 点击返回按钮
     */
    onBackClick(): void {
        // 发送切换场景事件
        if (this._eventManager) {
            this._eventManager.emit(GAME_EVENTS.CHANGE_SCENE, { 
                sceneName: 'HomeScene'
            });
        }
    }

    onDestroy(): void {
        this.unregisterEvents();
    }
}