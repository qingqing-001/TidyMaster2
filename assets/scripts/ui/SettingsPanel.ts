import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 设置面板组件
 */
@ccclass('SettingsPanel')
export class SettingsPanel extends Component {
    private _musicEnabled: boolean = true;
    private _sfxEnabled: boolean = true;
    private _vibrationEnabled: boolean = true;

    onLoad() {
        // TODO: 加载设置数据
    }

    /**
     * 切换音乐开关
     */
    toggleMusic(enabled: boolean): void {
        this._musicEnabled = enabled;
        // TODO: 应用设置
        // TODO: 保存数据
    }

    /**
     * 切换音效开关
     */
    toggleSfx(enabled: boolean): void {
        this._sfxEnabled = enabled;
        // TODO: 应用设置
        // TODO: 保存数据
    }

    /**
     * 切换震动开关
     */
    toggleVibration(enabled: boolean): void {
        this._vibrationEnabled = enabled;
        // TODO: 应用设置
        // TODO: 保存数据
    }
}
