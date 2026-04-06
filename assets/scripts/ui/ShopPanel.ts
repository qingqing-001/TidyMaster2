import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 商店面板组件
 */
@ccclass('ShopPanel')
export class ShopPanel extends Component {
    onLoad() {
        // TODO: 初始化商店UI
        // TODO: 加载商品列表
    }

    /**
     * 购买商品
     */
    buyItem(itemId: string): void {
        // TODO: 检查金币是否足够
        // TODO: 扣除金币
        // TODO: 发放商品
        // TODO: 保存数据
    }

    /**
     * 观看广告获取商品
     */
    buyItemByAd(itemId: string): void {
        // TODO: 显示广告
        // TODO: 广告看完后发放商品
    }

    /**
     * 刷新商品
     */
    refreshItems(): void {
        // TODO: 刷新商店商品列表
    }
}
