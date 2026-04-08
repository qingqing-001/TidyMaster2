import { _decorator, Component, Node, Label, Button, Color, director } from 'cc';
import { DataManager } from '../core/DataManager';
import { AudioManager } from '../audio/AudioManager';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../data/constants';

const { ccclass, property } = _decorator;

/**
 * 设置面板组件
 * 管理游戏设置：音乐、音效、震动、音量等
 */
@ccclass('SettingsPanel')
export class SettingsPanel extends Component {
    // UI节点引用
    @property({ type: Node })
    public closeBtn: Node | null = null;

    @property({ type: Node })
    public musicToggleNode: Node | null = null;

    @property({ type: Node })
    public sfxToggleNode: Node | null = null;

    @property({ type: Node })
    public vibrationToggleNode: Node | null = null;

    @property({ type: Node })
    public resetProgressBtn: Node | null = null;

    @property({ type: Node })
    public versionLabel: Node | null = null;

    // 设置状态
    private _musicEnabled: boolean = true;
    private _sfxEnabled: boolean = true;
    private _vibrationEnabled: boolean = true;
    private _musicVolume: number = 1.0;
    private _sfxVolume: number = 1.0;
    private _qualityLevel: number = 1; // 0:低 1:中 2:高

    onLoad() {
        // 加载设置数据
        this.loadSettings();
    }

    start() {
        // 绑定按钮事件
        this.bindButtonEvents();
        
        // 更新UI显示
        this.updateUI();
    }

    /**
     * 加载设置数据
     */
    private loadSettings(): void {
        const progress = DataManager.getInstance().getProgress();
        
        this._musicEnabled = progress.soundEnabled;
        this._sfxEnabled = progress.soundEnabled;
        this._vibrationEnabled = true;
        this._musicVolume = 1.0;
        this._sfxVolume = 1.0;
        this._qualityLevel = 1;
        
        // 从持久化存储加载
        this.loadFromStorage();
    }

    /**
     * 从存储加载设置
     */
    private loadFromStorage(): void {
        try {
            const musicEnabled = localStorage.getItem('settings_music_enabled');
            const sfxEnabled = localStorage.getItem('settings_sfx_enabled');
            const vibrationEnabled = localStorage.getItem('settings_vibration_enabled');
            const musicVolume = localStorage.getItem('settings_music_volume');
            const sfxVolume = localStorage.getItem('settings_sfx_volume');
            const qualityLevel = localStorage.getItem('settings_quality_level');

            if (musicEnabled !== null) this._musicEnabled = musicEnabled === 'true';
            if (sfxEnabled !== null) this._sfxEnabled = sfxEnabled === 'true';
            if (vibrationEnabled !== null) this._vibrationEnabled = vibrationEnabled === 'true';
            if (musicVolume !== null) this._musicVolume = parseFloat(musicVolume);
            if (sfxVolume !== null) this._sfxVolume = parseFloat(sfxVolume);
            if (qualityLevel !== null) this._qualityLevel = parseInt(qualityLevel);
        } catch (e) {
            console.log('[SettingsPanel] 本地存储不可用，使用默认设置');
        }
    }

    /**
     * 保存设置到存储
     */
    private saveToStorage(): void {
        try {
            localStorage.setItem('settings_music_enabled', this._musicEnabled.toString());
            localStorage.setItem('settings_sfx_enabled', this._sfxEnabled.toString());
            localStorage.setItem('settings_vibration_enabled', this._vibrationEnabled.toString());
            localStorage.setItem('settings_music_volume', this._musicVolume.toString());
            localStorage.setItem('settings_sfx_volume', this._sfxVolume.toString());
            localStorage.setItem('settings_quality_level', this._qualityLevel.toString());
        } catch (e) {
            console.log('[SettingsPanel] 保存到本地存储失败');
        }
    }

    /**
     * 绑定按钮事件
     */
    private bindButtonEvents(): void {
        // 关闭按钮
        if (this.closeBtn) {
            const btn = this.closeBtn.getComponent(Button);
            if (btn) {
                btn.node.on('click', this.onCloseClick, this);
            }
        }

        // 音乐开关按钮
        if (this.musicToggleNode) {
            const btn = this.musicToggleNode.getComponent(Button);
            if (btn) {
                btn.node.on('click', () => this.onMusicToggle(), this);
            }
        }

        // 音效开关按钮
        if (this.sfxToggleNode) {
            const btn = this.sfxToggleNode.getComponent(Button);
            if (btn) {
                btn.node.on('click', () => this.onSfxToggle(), this);
            }
        }

        // 震动开关按钮
        if (this.vibrationToggleNode) {
            const btn = this.vibrationToggleNode.getComponent(Button);
            if (btn) {
                btn.node.on('click', () => this.onVibrationToggle(), this);
            }
        }

        // 重置进度按钮
        if (this.resetProgressBtn) {
            const btn = this.resetProgressBtn.getComponent(Button);
            if (btn) {
                btn.node.on('click', this.onResetProgressClick, this);
            }
        }
    }

    /**
     * 更新UI显示
     */
    private updateUI(): void {
        // 更新开关标签
        this.updateToggleLabel(this.musicToggleNode, '音乐', this._musicEnabled);
        this.updateToggleLabel(this.sfxToggleNode, '音效', this._sfxEnabled);
        this.updateToggleLabel(this.vibrationToggleNode, '震动', this._vibrationEnabled);

        // 更新版本号
        this.updateVersionLabel();
    }

    /**
     * 更新开关标签显示
     */
    private updateToggleLabel(toggleNode: Node | null, name: string, isOn: boolean): void {
        if (!toggleNode) return;
        
        const label = toggleNode.getComponent(Label);
        if (label) {
            const status = isOn ? '开' : '关';
            label.string = `${name}: ${status}`;
        }
    }

    /**
     * 更新版本号
     */
    private updateVersionLabel(): void {
        if (!this.versionLabel) return;
        
        const label = this.versionLabel.getComponent(Label);
        if (label) {
            const version = '1.0.0';
            const buildTime = '2024-04-07';
            label.string = `版本 ${version} (${buildTime})`;
        }
    }

    // ==================== 设置应用 ====================

    /**
     * 应用所有设置
     */
    private applySettings(): void {
        const audioManager = AudioManager.getInstance();
        
        // 音乐设置
        audioManager.setEnabled(this._musicEnabled);
        audioManager.setMusicVolume(this._musicVolume);
        
        // 音效设置
        audioManager.setEnabled(this._sfxEnabled);
        audioManager.setSFXVolume(this._sfxVolume);
        
        // 画面质量
        this.applyQualitySettings();
        
        // 保存设置
        this.saveToStorage();
        this.saveToDataManager();
        
        // 发送设置更新事件
        const eventManager = EventManager.getInstance();
        eventManager.emit(GAME_EVENTS.COLLECTION_UPDATE, {
            type: 'settings',
        });
    }

    /**
     * 应用画质设置
     */
    private applyQualitySettings(): void {
        console.log('[SettingsPanel] 应用画质设置, level:', this._qualityLevel);
    }

    /**
     * 保存到DataManager
     */
    private saveToDataManager(): void {
        const dataManager = DataManager.getInstance();
        dataManager.setSoundEnabled(this._sfxEnabled);
    }

    // ==================== 按钮回调 ====================

    /**
     * 关闭按钮点击
     */
    private onCloseClick(): void {
        console.log('[SettingsPanel] 点击关闭');
        
        // 应用设置
        this.applySettings();
        
        // 隐藏设置面板
        if (this.node) {
            this.node.active = false;
        }
    }

    /**
     * 音乐开关切换
     */
    private onMusicToggle(): void {
        this._musicEnabled = !this._musicEnabled;
        console.log('[SettingsPanel] 音乐开关:', this._musicEnabled);
        
        // 更新UI
        this.updateToggleLabel(this.musicToggleNode, '音乐', this._musicEnabled);
    }

    /**
     * 音效开关切换
     */
    private onSfxToggle(): void {
        this._sfxEnabled = !this._sfxEnabled;
        console.log('[SettingsPanel] 音效开关:', this._sfxEnabled);
        
        // 更新UI
        this.updateToggleLabel(this.sfxToggleNode, '音效', this._sfxEnabled);
    }

    /**
     * 震动开关切换
     */
    private onVibrationToggle(): void {
        this._vibrationEnabled = !this._vibrationEnabled;
        console.log('[SettingsPanel] 震动开关:', this._vibrationEnabled);
        
        // 测试震动
        if (this._vibrationEnabled) {
            // navigator.vibrate(100);
        }
        
        // 更新UI
        this.updateToggleLabel(this.vibrationToggleNode, '震动', this._vibrationEnabled);
    }

    /**
     * 重置进度点击
     */
    private onResetProgressClick(): void {
        console.log('[SettingsPanel] 点击重置进度');
        
        // 确认对话框
        const confirmed = confirm('确定要重置所有游戏进度吗？此操作不可恢复！');
        
        if (confirmed) {
            this.resetAllProgress();
        }
    }

    /**
     * 重置所有进度
     */
    private resetAllProgress(): void {
        console.log('[SettingsPanel] 重置所有游戏进度');
        
        // 清空本地存储
        try {
            localStorage.clear();
        } catch (e) {
            console.log('[SettingsPanel] 清空本地存储失败');
        }
        
        // 重置内存中的数据
        this._musicEnabled = true;
        this._sfxEnabled = true;
        this._vibrationEnabled = true;
        this._musicVolume = 1.0;
        this._sfxVolume = 1.0;
        this._qualityLevel = 1;
        
        // 更新UI
        this.updateUI();
        
        // 应用设置
        this.applySettings();
        
        // 显示提示
        alert('游戏进度已重置');
    }

    // ==================== 公共方法 ====================

    /**
     * 切换音乐开关
     */
    public toggleMusic(enabled: boolean): void {
        this._musicEnabled = enabled;
        this.applySettings();
    }

    /**
     * 切换音效开关
     */
    public toggleSfx(enabled: boolean): void {
        this._sfxEnabled = enabled;
        this.applySettings();
    }

    /**
     * 切换震动开关
     */
    public toggleVibration(enabled: boolean): void {
        this._vibrationEnabled = enabled;
        this.applySettings();
    }

    /**
     * 设置音乐音量
     */
    public setMusicVolume(volume: number): void {
        this._musicVolume = Math.max(0, Math.min(1, volume));
        this.applySettings();
    }

    /**
     * 设置音效音量
     */
    public setSfxVolume(volume: number): void {
        this._sfxVolume = Math.max(0, Math.min(1, volume));
        this.applySettings();
    }

    /**
     * 获取音乐是否启用
     */
    public isMusicEnabled(): boolean {
        return this._musicEnabled;
    }

    /**
     * 获取音效是否启用
     */
    public isSfxEnabled(): boolean {
        return this._sfxEnabled;
    }

    /**
     * 获取震动是否启用
     */
    public isVibrationEnabled(): boolean {
        return this._vibrationEnabled;
    }

    /**
     * 获取音乐音量
     */
    public getMusicVolume(): number {
        return this._musicVolume;
    }

    /**
     * 获取音效音量
     */
    public getSfxVolume(): number {
        return this._sfxVolume;
    }
}