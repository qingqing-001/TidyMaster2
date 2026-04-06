import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 相册管理器
 * 管理家居图鉴收集系统
 */
@ccclass('AlbumManager')
export class AlbumManager extends Component {
    private static _instance: AlbumManager;

    static get instance(): AlbumManager {
        if (!this._instance) {
            this._instance = new AlbumManager();
        }
        return this._instance;
    }

    private _collectedItems: Set<string> = new Set();

    private constructor() {
        super();
    }

    onLoad() {
        // TODO: 加载已收集物品数据
    }

    /**
     * 添加收集物品
     */
    collectItem(itemId: string): void {
        if (!this._collectedItems.has(itemId)) {
            this._collectedItems.add(itemId);
            // TODO: 显示新解锁提示
            // TODO: 保存收集进度
            // TODO: 检查是否达成里程碑奖励
        }
    }

    /**
     * 获取收集率
     */
    getCollectionRate(category?: string): number {
        // TODO: 计算收集率
        return 0;
    }

    /**
     * 是否已收集
     */
    isCollected(itemId: string): boolean {
        return this._collectedItems.has(itemId);
    }
}
