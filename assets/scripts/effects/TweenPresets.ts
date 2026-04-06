import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 补间动画预设
 * 提供常用的缓动动画
 */
@ccclass('TweenPresets')
export class TweenPresets extends Component {
    private static _instance: TweenPresets;

    static get instance(): TweenPresets {
        if (!this._instance) {
            this._instance = new TweenPresets();
        }
        return this._instance;
    }

    private constructor() {
        super();
    }

    /**
     * 弹出效果（用于弹窗）
     */
    popIn(node: any, duration: number = 0.2): void {
        // TODO: 实现弹出动画
    }

    /**
     * 弹出退出效果
     */
    popOut(node: any, duration: number = 0.2): void {
        // TODO: 实现弹出退出动画
    }

    /**
     * 弹性归位效果（用于物品拖拽）
     */
    elasticBack(node: any, targetPos: any, duration: number = 0.3): void {
        // TODO: 实现弹性归位动画
    }

    /**
     * 淡入效果
     */
    fadeIn(node: any, duration: number = 0.3): void {
        // TODO: 实现淡入动画
    }

    /**
     * 淡出效果
     */
    fadeOut(node: any, duration: number = 0.3): void {
        // TODO: 实现淡出动画
    }
}
