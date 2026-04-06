import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 游戏关卡场景
 * 负责核心玩法的逻辑控制
 */
@ccclass('GameScene')
export class GameScene extends Component {
    onLoad() {
        // TODO: 初始化关卡场景
        // TODO: 加载关卡配置
        // TODO: 初始化物品和目标位置
    }

    start() {
        // TODO: 开始计时倒
        // TODO: 播放关卡BGM
    }

    /**
     * 物品归位成功
     */
    onItemPlaced(itemId: string): void {
        // TODO: 更新进度
        // TODO: 检查是否完成关卡
    }

    /**
     * 关卡完成
     */
    onLevelComplete(stars: number): void {
        // TODO: 保存进度
        // TODO: 切换到结算场景
    }

    /**
     * 时间耗尽
     */
    onTimeOut(): void {
        // TODO: 显示续命广告选项
    }
}
