import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 赛季通行证
 * 管理赛季进度和奖励
 */
@ccclass('SeasonPass')
export class SeasonPass extends Component {
    private static _instance: SeasonPass;

    static get instance(): SeasonPass {
        if (!this._instance) {
            this._instance = new SeasonPass();
        }
        return this._instance;
    }

    private _currentLevel: number = 1;
    private _currentExp: number = 0;
    private _isPremium: boolean = false;

    private constructor() {
        super();
    }

    onLoad() {
        // TODO: 加载赛季数据
    }

    /**
     * 增加经验值
     */
    addExp(exp: number): void {
        this._currentExp += exp;
        // TODO: 检查是否升级
    }

    /**
     * 领取奖励
     */
    claimReward(level: number): boolean {
        // TODO: 检查是否已领取
        // TODO: 发放奖励
        return true;
    }

    /**
     * 解锁高级通行证（观看广告）
     */
    unlockPremium(): void {
        this._isPremium = true;
        // TODO: 保存数据
    }
}
