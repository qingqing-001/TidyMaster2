import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 合成逻辑
 * 处理工具合成的核心规则
 */
@ccclass('MergeLogic')
export class MergeLogic extends Component {
    private static _instance: MergeLogic;

    static get instance(): MergeLogic {
        if (!this._instance) {
            this._instance = new MergeLogic();
        }
        return this._instance;
    }

    private constructor() {
        super();
    }

    /**
     * 检查是否可以合成
     */
    canMerge(level1: number, level2: number): boolean {
        return level1 === level2 && level1 < 7;
    }

    /**
     * 合成后的等级
     */
    getMergedLevel(level: number): number {
        return level < 7 ? level + 1 : level;
    }

    /**
     * 获取工具增益效果
     */
    getToolBonus(level: number): { timeBonus: number, autoSort: boolean, showHint: boolean, oneClickSort: boolean } {
        return {
            timeBonus: level >= 2 ? 5 : 0,
            autoSort: level >= 3 && level <= 4,
            showHint: level >= 5 && level <= 6,
            oneClickSort: level >= 7
        };
    }
}
