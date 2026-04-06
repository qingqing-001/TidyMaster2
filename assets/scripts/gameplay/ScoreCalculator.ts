import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 分数计算器
 * 根据完成度计算星级评分
 */
@ccclass('ScoreCalculator')
export class ScoreCalculator extends Component {
    private static _instance: ScoreCalculator;

    static get instance(): ScoreCalculator {
        if (!this._instance) {
            this._instance = new ScoreCalculator();
        }
        return this._instance;
    }

    private constructor() {
        super();
    }

    /**
     * 计算星级评分
     * @param completionRate 完成度 (0-1)
     * @param starThresholds [1星阈值, 2星阈值, 3星阈值]
     * @returns 星级 (0-3)
     */
    calculateStars(completionRate: number, starThresholds: [number, number, number]): number {
        if (completionRate >= starThresholds[2]) return 3;
        if (completionRate >= starThresholds[1]) return 2;
        if (completionRate >= starThresholds[0]) return 1;
        return 0;
    }

    /**
     * 计算金币奖励
     */
    calculateCoins(stars: number, baseCoin: number): number {
        return baseCoin * stars;
    }
}
