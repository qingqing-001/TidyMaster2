import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 每日签到组件
 * 管理7天循环签到奖励
 */
@ccclass('DailyCheckin')
export class DailyCheckin extends Component {
    private _consecutiveDays: number = 0;
    private _lastCheckinDate: string = '';

    onLoad() {
        // TODO: 加载签到数据
        // TODO: 检查是否可以签到
    }

    /**
     * 签到
     */
    checkin(): void {
        // TODO: 更新签到天数
        // TODO: 发放奖励
        // TODO: 保存数据
        // TODO: 显示奖励弹窗
    }

    /**
     * 广告补签
     */
    advertiseCheckin(): void {
        // TODO: 观看广告后补签
    }

    /**
     * 是否可以签到
     */
    canCheckin(): boolean {
        // TODO: 检查今日是否已签到
        return true;
    }
}
