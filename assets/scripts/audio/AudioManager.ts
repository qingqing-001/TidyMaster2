import { GAME_CONFIG } from '../../data/constants';

/**
 * 音频片段类型（用于类型安全）
 * 在Cocos Creator中，AudioClip通过编辑器绑定或动态加载
 */
type AudioClip = any;

/**
 * 音频源类型
 */
type AudioSource = any;

/**
 * 音频管理器 - 负责游戏音效和背景音乐的播放
 */
export class AudioManager {
  private static instance: AudioManager | null = null;
  private enabled = true;
  private musicVolume = 1.0;
  private sfxVolume = 1.0;

  // 音效片段缓存
  private sfxClips: Map<string, AudioClip> = new Map();

  public static getInstance(): AudioManager {
    if (AudioManager.instance === null) {
      AudioManager.instance = new AudioManager();
    }

    return AudioManager.instance;
  }

  /**
   * 组件加载时预加载所有音效
   */
  onLoad(): void {
    this.preloadSFX();
  }

  /**
   * 预加载所有SFX音效
   */
  private preloadSFX(): void {
    const sfxList = [
      'sfx_item_pickup',
      'sfx_item_place',
      'sfx_item_wrong',
      'sfx_item_bounce'
    ];

    sfxList.forEach(sfxName => {
      // 在Cocos Creator中通过resources.load加载
      // 这里先占位，实际音效文件需要在编辑器中配置
      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.log(`[AudioManager] Preloading SFX: ${sfxName}`);
      }
    });
  }

  /**
   * 启用或禁用音频
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * 检查是否可以播放音频
   */
  public canPlay(): boolean {
    return this.enabled;
  }

  /**
   * 播放点击音效
   */
  public playClick(): void {
    if (!this.enabled) {
      return;
    }

    if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
      console.log('[AudioManager] Playing click sound');
    }
  }

  /**
   * 播放指定名称的音效
   * @param name 音效名称
   */
  public playSFX(name: string): void {
    if (!this.enabled) {
      return;
    }

    if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
      console.log(`[AudioManager] Playing SFX: ${name}`);
    }

    // 如果有缓存的音效片段，播放它
    const clip = this.sfxClips.get(name);
    if (clip) {
      this.playAudioClip(clip);
    }
  }

  /**
   * 播放拿起物品音效
   * 轻柔的摩擦声，提示玩家物品被拿起
   */
  public playPickup(): void {
    this.playSFX('sfx_item_pickup');
  }

  /**
   * 播放物品归位音效
   * 清脆的放置声，这是最核心的音效，给予玩家满足感
   */
  public playPlace(): void {
    this.playSFX('sfx_item_place');
  }

  /**
   * 播放错误音效
   * 提示玩家物品放错了位置
   */
  public playWrong(): void {
    this.playSFX('sfx_item_wrong');
  }

  /**
   * 播放弹回音效
   * 物品弹回原位时的弹性音效
   */
  public playBounce(): void {
    this.playSFX('sfx_item_bounce');
  }

  /**
   * 设置音效音量
   * @param volume 音量值 (0.0 - 1.0)
   */
  public setSFXVolume(volume: number): void {
    this.sfxVolume = this.clampValue(volume, 0, 1);
  }

  /**
   * 获取音效音量
   */
  public getSFXVolume(): number {
    return this.sfxVolume;
  }

  /**
   * 设置背景音乐音量
   * @param volume 音量值 (0.0 - 1.0)
   */
  public setMusicVolume(volume: number): void {
    this.musicVolume = this.clampValue(volume, 0, 1);
  }

  /**
   * 获取背景音乐音量
   */
  public getMusicVolume(): number {
    return this.musicVolume;
  }

  /**
   * 播放音频片段（内部方法）
   * 在Cocos Creator中，这会创建临时的AudioSource来播放
   */
  private playAudioClip(clip: AudioClip): void {
    // 在Cocos Creator编辑器中，可以通过以下方式播放：
    // const source = new AudioSource(clip);
    // source.volume = this.sfxVolume;
    // source.play();
    //
    // 由于这是TypeScript代码，实际AudioSource需要在运行时环境才能创建
    // 这里保留接口，具体实现在Cocos Creator环境中完成
  }

  /**
   * 限制数值在指定范围内
   */
  private clampValue(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
