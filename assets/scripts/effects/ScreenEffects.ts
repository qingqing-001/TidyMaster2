import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 屏幕特效管理器
 * 管理闪屏、震动等屏幕特效
 */
@ccclass('ScreenEffects')
export class ScreenEffects extends Component {
    private static _instance: ScreenEffects;

    static get instance(): ScreenEffects {
        if (!this._instance) {
            this._instance = new ScreenEffects();
        }
        return this._instance;
    }

    private constructor() {
        super();
    }

    /**
     * 闪屏效果
     */
    flash(color: string, duration: number): void {
        // TODO: 播放闪屏特效
    }

    /**
     * 震动效果（长震动）
     */
    vibrateLong(): void {
        // TODO: 调用微信震动API
    }

    /**
     * 震动效果（短震动）
     */
    vibrateShort(): void {
        // TODO: 调用微信震动API
    }

    /**
     * 屏幕缩放效果
     */
    zoomEffect(scale: number, duration: number): void {
        // TODO: 播放缩放特效
    }
}
