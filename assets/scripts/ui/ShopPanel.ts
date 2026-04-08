import { _decorator, Component, Node, Label, Button, Sprite, Color } from 'cc';
import { DataManager } from '../core/DataManager';
import { AudioManager } from '../audio/AudioManager';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';

const { ccclass, property } = _decorator;

// 商品类型
type ShopItemType = 'tool' | 'skin' | 'deco' | 'gem_pack';

// 商品数据结构
interface ShopItem {
    id: string;
    name: string;
    description: string;
    type: ShopItemType;
    price: number;
    priceType: 'coin' | 'gem';
    icon: string;
    isLimited: boolean;
}

// 商店配置
const SHOP_ITEMS: ShopItem[] = [
    // 工具
    {
        id: 'tool_rag',
        name: '高级抹布',
        description: '更快更干净地擦拭物品',
        type: 'tool',
        price: 100,
        priceType: 'coin',
        icon: 'shop/tool_rag',
        isLimited: false,
    },
    {
        id: 'tool_sponge',
        name: '海绵',
        description: '清洁效果更好的工具',
        type: 'tool',
        price: 300,
        priceType: 'coin',
        icon: 'shop/tool_sponge',
        isLimited: false,
    },
    {
        id: 'tool_brush',
        name: '刷子',
        description: '强力清洁刷',
        type: 'tool',
        price: 500,
        priceType: 'coin',
        icon: 'shop/tool_brush',
        isLimited: false,
    },
    // 钻石礼包
    {
        id: 'gem_pack_small',
        name: '小钻石包',
        description: '包含50颗钻石',
        type: 'gem_pack',
        price: 60,
        priceType: 'coin',
        icon: 'shop/gem_small',
        isLimited: false,
    },
    {
        id: 'gem_pack_medium',
        name: '中钻石包',
        description: '包含150颗钻石',
        type: 'gem_pack',
        price: 160,
        priceType: 'coin',
        icon: 'shop/gem_medium',
        isLimited: false,
    },
    {
        id: 'gem_pack_large',
        name: '大钻石包',
        description: '包含500颗钻石，额外赠送50颗！',
        type: 'gem_pack',
        price: 500,
        priceType: 'coin',
        icon: 'shop/gem_large',
        isLimited: true,
    },
    // 皮肤/外观
    {
        id: 'skin_desk_blue',
        name: '蓝色书桌皮肤',
        description: '解锁蓝色主题书桌',
        type: 'skin',
        price: 200,
        priceType: 'gem',
        icon: 'shop/skin_desk_blue',
        isLimited: false,
    },
    // 装饰品
    {
        id: 'deco_plant',
        name: '装饰植物',
        description: '美化你的房间',
        type: 'deco',
        price: 500,
        priceType: 'coin',
        icon: 'shop/deco_plant',
        isLimited: false,
    },
];

/**
 * 商店面板组件
 */
@ccclass('ShopPanel')
export class ShopPanel extends Component {
    // UI节点引用
    @property({ type: Node })
    public closeBtn: Node | null = null;

    @property({ type: Node })
    public itemList: Node | null = null;

    @property({ type: Node })
    public coinLabel: Node | null = null;

    @property({ type: Node })
    public gemLabel: Node | null = null;

    // 当前选中的商品
    private _selectedItem: ShopItem | null = null;

    // 当前tab
    private _currentTab: string = 'all';

    // 玩家货币
    private _coins: number = 0;
    private _gems: number = 0;

    onLoad() {
        // 加载玩家货币
        this.loadPlayerCurrency();
        
        // 加载商品列表
        this.loadShopItems();
    }

    start() {
        // 绑定按钮事件
        this.bindButtonEvents();
        
        // 更新货币显示
        this.updateCurrencyDisplay();
    }

    /**
     * 加载玩家货币
     */
    private loadPlayerCurrency(): void {
        // 从DataManager加载
        this._coins = 1000; // 默认金币
        this._gems = 50;    // 默认钻石
    }

    /**
     * 加载商品列表
     */
    private loadShopItems(): void {
        if (!this.itemList) return;

        // 清空现有商品
        this.itemList.removeAllChildren();

        // 根据当前tab过滤商品
        const filteredItems = this.getFilteredItems();

        // 创建商品项
        for (const item of filteredItems) {
            this.createShopItem(item);
        }
    }

    /**
     * 获取过滤后的商品
     */
    private getFilteredItems(): ShopItem[] {
        if (this._currentTab === 'all') {
            return SHOP_ITEMS;
        }
        
        // 根据tab类型过滤
        const tabMap: Record<string, ShopItemType[]> = {
            'tool': ['tool'],
            'gem': ['gem_pack'],
            'skin': ['skin'],
            'deco': ['deco'],
        };
        
        const types = tabMap[this._currentTab] || [];
        return SHOP_ITEMS.filter(item => types.includes(item.type));
    }

    /**
     * 创建商店商品项
     */
    private createShopItem(item: ShopItem): void {
        if (!this.itemList) return;

        // 创建商品节点
        const itemNode = new Node('ShopItem_' + item.id);
        itemNode.setParent(this.itemList);

        // 设置位置（垂直列表）
        const index = this.itemList.children.length - 1;
        itemNode.setPosition(0, -index * 120, 0);

        // 添加背景
        const bg = new Node('Background');
        bg.setParent(itemNode);
        bg.setPosition(0, 0, 0);
        const bgSprite = bg.addComponent(Sprite);
        bgSprite.color = new Color(60, 60, 60, 255);

        // 添加商品名称
        const nameNode = new Node('Name');
        nameNode.setParent(itemNode);
        nameNode.setPosition(-50, 20, 0);
        const nameLabel = nameNode.addComponent(Label);
        nameLabel.string = item.name;
        nameLabel.fontSize = 28;

        // 添加商品描述
        const descNode = new Node('Description');
        descNode.setParent(itemNode);
        descNode.setPosition(-50, -10, 0);
        const descLabel = descNode.addComponent(Label);
        descLabel.string = item.description;
        descLabel.fontSize = 20;

        // 添加价格标签
        const priceNode = new Node('Price');
        priceNode.setParent(itemNode);
        priceNode.setPosition(150, 0, 0);
        const priceLabel = priceNode.addComponent(Label);
        
        // 价格图标
        const priceIcon = item.priceType === 'coin' ? '💰' : '💎';
        priceLabel.string = `${priceIcon} ${item.price}`;
        priceLabel.fontSize = 32;

        // 添加购买按钮
        const buyBtnNode = new Node('BuyButton');
        buyBtnNode.setParent(itemNode);
        buyBtnNode.setPosition(250, 0, 0);
        
        const buyBtn = buyBtnNode.addComponent(Button);
        
        const buyLabel = buyBtnNode.addComponent(Label);
        buyLabel.string = '购买';
        buyLabel.fontSize = 24;

        // 绑定购买事件
        buyBtn.node.on('click', () => this.onBuyClick(item), this);

        // 存储商品数据
        (itemNode as any).shopItemData = item;
    }

    /**
     * 绑定按钮事件
     */
    private bindButtonEvents(): void {
        // 关闭按钮
        if (this.closeBtn) {
            const btn = this.closeBtn.getComponent(Button);
            if (btn) {
                btn.node.on('click', this.onCloseClick, this);
            }
        }
    }

    /**
     * 更新货币显示
     */
    private updateCurrencyDisplay(): void {
        if (this.coinLabel) {
            const label = this.coinLabel.getComponent(Label);
            if (label) {
                label.string = '💰 ' + this._coins;
            }
        }

        if (this.gemLabel) {
            const label = this.gemLabel.getComponent(Label);
            if (label) {
                label.string = '💎 ' + this._gems;
            }
        }
    }

    // ==================== 按钮回调 ====================

    /**
     * 关闭按钮点击
     */
    private onCloseClick(): void {
        console.log('[ShopPanel] 点击关闭');
        
        // 隐藏商店面板
        if (this.node) {
            this.node.active = false;
        }
    }

    /**
     * Tab点击
     */
    private onTabClick(tab: string): void {
        console.log('[ShopPanel] 切换tab:', tab);
        
        this._currentTab = tab;
        
        // 重新加载商品
        this.loadShopItems();
    }

    /**
     * 购买点击
     */
    private onBuyClick(item: ShopItem): void {
        console.log('[ShopPanel] 购买商品:', item.id);
        
        // 检查货币是否足够
        if (!this.canAfford(item.price, item.priceType)) {
            console.log('[ShopPanel] 货币不足');
            this.showToast('货币不足');
            return;
        }

        // 执行购买
        this.buyItem(item.id);
    }

    // ==================== 公共方法 ====================

    /**
     * 购买商品
     */
    public buyItem(itemId: string): void {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) {
            console.error('[ShopPanel] 商品不存在:', itemId);
            return;
        }

        // 检查货币是否足够
        if (!this.canAfford(item.price, item.priceType)) {
            this.showToast('货币不足');
            return;
        }

        // 扣除货币
        if (item.priceType === 'coin') {
            this._coins -= item.price;
        } else {
            this._gems -= item.price;
        }

        // 发放商品
        this.grantItem(item);

        // 保存数据
        this.savePlayerData();

        // 更新货币显示
        this.updateCurrencyDisplay();

        // 显示成功提示
        this.showToast(`购买成功！获得 ${item.name}`);

        // 发送购买事件
        const eventManager = EventManager.getInstance();
        eventManager.emit('shop-item-purchased', {
            itemId: item.id,
            itemType: item.type,
            price: item.price,
            priceType: item.priceType,
        });

        console.log('[ShopPanel] 购买成功:', item.name);
    }

    /**
     * 观看广告获取商品
     */
    public buyItemByAd(itemId: string): void {
        console.log('[ShopPanel] 看广告获取商品:', itemId);
    }

    /**
     * 刷新商品
     */
    public refreshItems(): void {
        console.log('[ShopPanel] 刷新商品');
        // 重新加载商品列表
        this.loadShopItems();
    }

    /**
     * 检查是否能购买
     */
    public canAfford(price: number, priceType: 'coin' | 'gem'): boolean {
        if (priceType === 'coin') {
            return this._coins >= price;
        } else {
            return this._gems >= price;
        }
    }

    /**
     * 发放商品
     */
    private grantItem(item: ShopItem): void {
        console.log('[ShopPanel] 发放商品:', item.name);
        
        // 根据商品类型发放
        switch (item.type) {
            case 'tool':
                // 添加工具到背包
                break;
            case 'skin':
                // 解锁皮肤
                break;
            case 'deco':
                // 添加装饰品
                break;
            case 'gem_pack':
                // 添加钻石
                this._gems += this.getGemAmount(item.id);
                break;
        }
    }

    /**
     * 获取钻石包数量
     */
    private getGemAmount(itemId: string): number {
        const gemPacks: Record<string, number> = {
            'gem_pack_small': 50,
            'gem_pack_medium': 150,
            'gem_pack_large': 550, // 500 + 50 奖励
        };
        return gemPacks[itemId] || 0;
    }

    /**
     * 保存玩家数据
     */
    private savePlayerData(): void {
        console.log('[ShopPanel] 保存玩家数据: coins=', this._coins, 'gems=', this._gems);
    }

    /**
     * 显示提示
     */
    private showToast(message: string): void {
        console.log('[ShopPanel] Toast:', message);
    }

    /**
     * 获取商店商品列表
     */
    public static getShopItems(): ShopItem[] {
        return SHOP_ITEMS;
    }

    /**
     * 获取指定类型的商品
     */
    public static getItemsByType(type: ShopItemType): ShopItem[] {
        return SHOP_ITEMS.filter(item => item.type === type);
    }
}