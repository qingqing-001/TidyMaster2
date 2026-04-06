import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 主界面场景
 * 负责显示关卡选择、商店入口、社交功能等
 */
@ccclass('HomeScene')
export class HomeScene extends Component {
    onLoad() {
        // TODO: 初始化主界面UI
        // TODO: 加载玩家进度
        // TODO: 显示每日签到弹窗
    }

    start() {
        // TODO: 播放主页BGM
    }

    /**
     * 进入关卡
     */
    enterLevel(levelId: number): void {
        // TODO: 切换到游戏场景
    }

    /**
     * 打开合成面板
     */
    openMergePanel(): void {
        // TODO: 显示合成UI
    }

    /**
     * 打开商店
     */
    openShop(): void {
        // TODO: 显示商店界
    }
}
