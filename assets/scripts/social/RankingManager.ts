import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 排行榜管理器
 * 使用微信开放域实现好友排行榜
 */
@cccclass('RankingManager')
export class RankingManager extends Component {
    private static _instance: RankingManager;

    static get instance(): RankingManager {
        if (!this._instance) {
            this._instance = new RankingManager();
        }
        return this._instance;
    }

    private constructor() {
        super();
    }

    /**
     * 上传分数
     */
    postScore(key: string, value: number): void {
        // TODO: 使用 wx.getOpenDataContext().postMessage()
    }

    /**
     * 打开排行榜
     */
    openRanking(): void {
        // TODO: 显示开放域排行榜
    }

    /**
     * 关闭排行榜
     */
    closeRanking(): void {
        // TODO: 隐藏开放域排行榜
    }
}
