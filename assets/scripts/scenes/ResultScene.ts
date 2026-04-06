import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 结算场景
 * 显示关卡完成评分、奖励、前后对比等
 */
@ccclass('ResultScene')
export class ResultScene extends Component {
    onLoad() {
        // TODO: 初始化结算界面
        // TODO: 显示星级评分
        // TODO: 显示前后对比图
    }

    start() {
        // TODO: 播放完成音效
        // TODO: 触发粒子特效
    }

    /**
     * 点击下一关
     */
    onNextLevel(): void {
        // TODO: 切换到游戏场景
    }

    /**
     * 返回主页
     */
    onBackHome(): void {
        // TODO: 切换到主页场景
    }

    /**
     * 观看广告翻倍奖励
     */
    onWatchAd(): void {
        // TODO: 显示奖励翻倍广告
    }
}
