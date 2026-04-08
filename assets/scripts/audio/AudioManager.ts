import { AudioClip, resources } from 'cc';
import { GAME_CONFIG } from '../../data/constants';

type AudioContextLike = {
  currentTime: number;
  destination: unknown;
  decodeAudioData(audioData: ArrayBuffer): Promise<AudioBuffer>;
  createBufferSource(): AudioBufferSourceNode;
  createGain(): GainNode;
  resume?(): Promise<void>;
  state?: string;
};

type CachedSFXClip = AudioClip | ArrayBuffer | AudioBuffer;

type AudioConstructor = new () => AudioContextLike;

declare global {
  interface Window {
    AudioContext?: AudioConstructor;
    webkitAudioContext?: AudioConstructor;
  }
}

const SFX_RESOURCE_MAP: Record<string, string> = {
  // 当前资源实际位于 assets/resources/audio/sfx_item_*.mp3，
  // 因此 resources.load 需要使用扁平路径 audio/sfx_item_*。
  // AUDIO_CONFIG 中的 audio/sfx/*.mp3 是规范化目标路径，待资源目录整理后再统一收敛。
  sfx_item_pickup: 'audio/sfx_item_pickup',
  sfx_item_place: 'audio/sfx_item_place',
  sfx_item_wrong: 'audio/sfx_item_wrong',
  sfx_item_bounce: 'audio/sfx_item_bounce'
};

/**
 * 音频管理器 - 负责游戏音效和背景音乐的播放
 */
export class AudioManager {
  private static instance: AudioManager | null = null;
  private enabled = true;
  private musicVolume = 1.0;
  private sfxVolume = 1.0;
  private preloadStarted = false;

  // 音效片段缓存
  private sfxClips: Map<string, CachedSFXClip> = new Map();
  private pendingLoads: Map<string, Promise<CachedSFXClip | null>> = new Map();
  private webAudioContext: AudioContextLike | null = null;

  public static getInstance(): AudioManager {
    if (AudioManager.instance === null) {
      AudioManager.instance = new AudioManager();
      AudioManager.instance.onLoad();
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
    if (this.preloadStarted) {
      return;
    }

    this.preloadStarted = true;

    Object.keys(SFX_RESOURCE_MAP).forEach((sfxName) => {
      this.loadSFXClip(sfxName).catch((error: unknown) => {
        if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
          console.warn(`[AudioManager] Failed to preload SFX: ${sfxName}`, error);
        }
      });
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
    this.playPlace();
  }

  /**
   * 播放指定名称的音效
   * @param name 音效名称
   */
  public playSFX(name: string): void {
    if (!this.enabled) {
      return;
    }

    const cachedClip = this.sfxClips.get(name);
    if (cachedClip) {
      void this.playAudioClip(cachedClip, name);
      return;
    }

    void this.loadSFXClip(name).then((clip) => {
      if (clip && this.enabled) {
        void this.playAudioClip(clip, name);
      }
    });
  }

  /**
   * 播放拿起物品音效
   */
  public playPickup(): void {
    this.playSFX('sfx_item_pickup');
  }

  /**
   * 播放物品归位音效
   */
  public playPlace(): void {
    this.playSFX('sfx_item_place');
  }

  /**
   * 播放错误音效
   */
  public playWrong(): void {
    this.playSFX('sfx_item_wrong');
  }

  /**
   * 播放弹回音效
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

  private loadSFXClip(name: string): Promise<CachedSFXClip | null> {
    const cachedClip = this.sfxClips.get(name);
    if (cachedClip) {
      return Promise.resolve(cachedClip);
    }

    const pending = this.pendingLoads.get(name);
    if (pending) {
      return pending;
    }

    const resourcePath = SFX_RESOURCE_MAP[name];
    if (!resourcePath) {
      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.warn(`[AudioManager] Unknown SFX name: ${name}`);
      }

      return Promise.resolve(null);
    }

    const loadPromise = new Promise<CachedSFXClip | null>((resolve) => {
      resources.load(resourcePath, AudioClip, (err, asset) => {
        if (!err && asset) {
          this.sfxClips.set(name, asset as AudioClip);
          this.pendingLoads.delete(name);
          resolve(asset as AudioClip);
          return;
        }

        this.loadNativeAudioBuffer(resourcePath)
          .then((buffer) => {
            if (buffer) {
              this.sfxClips.set(name, buffer);
            }
            this.pendingLoads.delete(name);
            resolve(buffer);
          })
          .catch((error: unknown) => {
            this.pendingLoads.delete(name);
            if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
              console.warn(`[AudioManager] Unable to load native SFX: ${name}`, error);
            }
            resolve(null);
          });
      });
    });

    this.pendingLoads.set(name, loadPromise);
    return loadPromise;
  }

  /**
   * 播放音频片段（内部方法）
   */
  private async playAudioClip(clip: CachedSFXClip, name: string): Promise<void> {
    if (!this.enabled) {
      return;
    }

    if (clip instanceof AudioClip) {
      const nativeUrl = this.getNativeAudioUrl(clip, name);
      if (nativeUrl) {
        const played = await this.playHtmlAudio(nativeUrl, name);
        if (played) {
          return;
        }
      }

      const resourcePath = SFX_RESOURCE_MAP[name];
      if (resourcePath) {
        const arrayBuffer = await this.loadNativeAudioBuffer(resourcePath);
        if (arrayBuffer) {
          this.sfxClips.set(name, arrayBuffer);
          await this.playArrayBuffer(arrayBuffer, name);
          return;
        }
      }

      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.warn(`[AudioManager] AudioClip loaded but no playable native source found: ${name}`);
      }
      return;
    }

    if (clip instanceof ArrayBuffer) {
      await this.playArrayBuffer(clip, name);
      return;
    }

    await this.resumeAudioContextIfNeeded();
    this.playDecodedBuffer(clip, name);
  }

  private async playHtmlAudio(url: string, name: string): Promise<boolean> {
    if (typeof Audio === 'undefined') {
      return false;
    }

    try {
      const audio = new Audio(url);
      audio.volume = this.sfxVolume;
      audio.preload = 'auto';
      const playResult = audio.play();
      if (playResult && typeof playResult.then === 'function') {
        await playResult;
      }

      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.log(`[AudioManager] Playing SFX via HTMLAudioElement: ${name}`);
      }
      return true;
    } catch (error) {
      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.warn(`[AudioManager] HTMLAudioElement playback failed: ${name}`, error);
      }
      return false;
    }
  }

  private async playArrayBuffer(buffer: ArrayBuffer, name: string): Promise<void> {
    const context = this.getAudioContext();
    if (!context) {
      return;
    }

    try {
      await this.resumeAudioContextIfNeeded();
      const decoded = await context.decodeAudioData(buffer.slice(0));
      this.sfxClips.set(name, decoded);
      this.playDecodedBuffer(decoded, name);
    } catch (error) {
      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.warn(`[AudioManager] Failed to decode SFX array buffer: ${name}`, error);
      }
    }
  }

  private playDecodedBuffer(buffer: AudioBuffer, name: string): void {
    const context = this.getAudioContext();
    if (!context) {
      return;
    }

    const source = context.createBufferSource();
    const gainNode = context.createGain();
    source.buffer = buffer;
    gainNode.gain.value = this.sfxVolume;
    source.connect(gainNode);
    gainNode.connect(context.destination as AudioNode);
    source.start(0);

    if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
      console.log(`[AudioManager] Playing SFX via WebAudio: ${name}`);
    }
  }

  private async loadNativeAudioBuffer(resourcePath: string): Promise<ArrayBuffer | null> {
    if (typeof fetch === 'undefined') {
      return null;
    }

    const response = await fetch(`assets/resources/${resourcePath}.mp3`);
    if (!response.ok) {
      return null;
    }

    return response.arrayBuffer();
  }

  private getNativeAudioUrl(clip: AudioClip, name: string): string | null {
    const nativePath = typeof clip.native === 'string' ? clip.native : '';
    if (nativePath) {
      return nativePath;
    }

    const resourcePath = SFX_RESOURCE_MAP[name];
    return resourcePath ? `assets/resources/${resourcePath}.mp3` : null;
  }

  private async resumeAudioContextIfNeeded(): Promise<void> {
    const context = this.getAudioContext();
    if (!context || typeof context.resume !== 'function') {
      return;
    }

    if (context.state && context.state !== 'suspended') {
      return;
    }

    try {
      await context.resume();
    } catch (error) {
      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.warn('[AudioManager] Failed to resume AudioContext', error);
      }
    }
  }

  private getAudioContext(): AudioContextLike | null {
    if (this.webAudioContext) {
      return this.webAudioContext;
    }

    if (typeof window === 'undefined') {
      return null;
    }

    const audioContextConstructor = window.AudioContext ?? window.webkitAudioContext;
    if (!audioContextConstructor) {
      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.warn('[AudioManager] AudioContext is not available in current runtime');
      }
      return null;
    }

    this.webAudioContext = new audioContextConstructor();
    return this.webAudioContext;
  }

  /**
   * 限制数值在指定范围内
   */
  private clampValue(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
