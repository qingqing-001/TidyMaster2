import { AudioClip, resources } from 'cc';
import { GAME_CONFIG, GAME_EVENTS } from '../../data/constants';
import { EventManager } from '../core/EventManager';

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

function isNodeLikeRuntime(): boolean {
  return typeof globalThis !== 'undefined'
    && 'process' in globalThis
    && !!(globalThis as typeof globalThis & { process?: { versions?: { node?: string } } }).process?.versions?.node;
}

const SFX_RESOURCE_MAP: Record<string, string> = {
  // 当前资源实际位于 assets/resources/audio/sfx_item_*.mp3，
  // 因此 resources.load 需要使用扁平路径 audio/sfx_item_*。
  // AUDIO_CONFIG 中的 audio/sfx/*.mp3 是规范化目标路径，待资源目录整理后再统一收敛。
  sfx_item_pickup: 'audio/sfx_item_pickup',
  sfx_item_place: 'audio/sfx_item_place',
  sfx_item_wrong: 'audio/sfx_item_wrong',
  sfx_item_bounce: 'audio/sfx_item_bounce',
  sfx_merge_success: 'audio/sfx_merge',
  sfx_tool_upgrade: 'audio/sfx_tool_upgrade'
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

  // Combo连击相关
  private comboCount: number = 0;
  private comboTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly COMBO_TIMEOUT_MS = 2000; // 2秒内连续成功归位算连击

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
    if (!this.enabled || isNodeLikeRuntime()) {
      return;
    }
    this.preloadSFX();
  }

  /**
   * 预加载所有SFX音效
   */
  private preloadSFX(): void {
    if (!this.enabled || isNodeLikeRuntime()) {
      return;
    }

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
    if (enabled && !isNodeLikeRuntime()) {
      this.preloadSFX();
    }
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
   * 播放合成成功音效
   */
  public playMergeSuccess(): void {
    this.playSFX('sfx_merge_success');
  }

  /**
   * 播放工具升级音效
   */
  public playToolUpgrade(): void {
    this.playSFX('sfx_tool_upgrade');
  }

  /**
   * 播放连击音效（带音高递增）
   * combo 1-3: 正常音调 (1.0)
   * combo 4-6: 稍高音调 (1.1-1.2)
   * combo 7-9: 更高音调 (1.3-1.4)
   * combo 10+: 最高音调 (1.5)
   */
  public playCombo(): void {
    // 增加连击计数
    this.comboCount++;

    // 清除之前的计时器
    if (this.comboTimer) {
      clearTimeout(this.comboTimer);
    }

    // 设置2秒超时，超时后重置连击
    this.comboTimer = setTimeout(() => {
      this.resetCombo();
    }, this.COMBO_TIMEOUT_MS);

    // 计算音高倍率
    const playbackRate = this.getComboPlaybackRate();

    // 发送连击事件
    try {
      const eventManager = EventManager.getInstance();
      eventManager.emit(GAME_EVENTS.COMBO_CHANGE, {
        comboCount: this.comboCount,
        playbackRate: playbackRate
      });
    } catch (e) {
      // EventManager可能未初始化，忽略
    }

    if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
      console.log(`[AudioManager] 播放连击音效: combo=${this.comboCount}, rate=${playbackRate}`);
    }

    // 播放带音高调整的音效
    this.playSFXWithPlaybackRate('sfx_item_place', playbackRate);
  }

  /**
   * 根据连击数获取音高倍率
   */
  private getComboPlaybackRate(): number {
    if (this.comboCount <= 3) {
      return 1.0;
    } else if (this.comboCount <= 6) {
      return 1.0 + (this.comboCount - 3) * 0.1; // 1.1 - 1.2
    } else if (this.comboCount <= 9) {
      return 1.2 + (this.comboCount - 6) * 0.1; // 1.3 - 1.4
    } else {
      return 1.5; // 最高音调
    }
  }

  /**
   * 使用指定音高倍率播放音效
   */
  private playSFXWithPlaybackRate(name: string, playbackRate: number): void {
    if (!this.enabled) {
      return;
    }

    const cachedClip = this.sfxClips.get(name);
    if (cachedClip) {
      void this.playAudioClipWithRate(cachedClip, name, playbackRate);
      return;
    }

    void this.loadSFXClip(name).then((clip) => {
      if (clip && this.enabled) {
        void this.playAudioClipWithRate(clip, name, playbackRate);
      }
    });
  }

  /**
   * 使用指定音高倍率播放音频片段
   */
  private async playAudioClipWithRate(clip: CachedSFXClip, name: string, playbackRate: number): Promise<void> {
    if (!this.enabled) {
      return;
    }

    if (clip instanceof AudioClip) {
      const nativeUrl = this.getNativeAudioUrl(clip, name);
      if (nativeUrl) {
        const played = await this.playHtmlAudioWithRate(nativeUrl, name, playbackRate);
        if (played) {
          return;
        }
      }

      const resourcePath = SFX_RESOURCE_MAP[name];
      if (resourcePath) {
        const arrayBuffer = await this.loadNativeAudioBuffer(resourcePath);
        if (arrayBuffer) {
          this.sfxClips.set(name, arrayBuffer);
          await this.playArrayBufferWithRate(arrayBuffer, name, playbackRate);
          return;
        }
      }

      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.warn(`[AudioManager] AudioClip loaded but no playable native source found: ${name}`);
      }
      return;
    }

    if (clip instanceof ArrayBuffer) {
      await this.playArrayBufferWithRate(clip, name, playbackRate);
      return;
    }

    await this.resumeAudioContextIfNeeded();
    this.playDecodedBufferWithRate(clip, name, playbackRate);
  }

  /**
   * 使用HTML Audio播放并调整音高
   */
  private async playHtmlAudioWithRate(url: string, name: string, playbackRate: number): Promise<boolean> {
    if (typeof Audio === 'undefined') {
      return false;
    }

    try {
      const audio = new Audio(url);
      audio.volume = this.sfxVolume;
      audio.playbackRate = playbackRate;
      audio.preload = 'auto';
      const playResult = audio.play();
      if (playResult && typeof playResult.then === 'function') {
        await playResult;
      }

      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.log(`[AudioManager] Playing SFX via HTMLAudioElement with rate ${playbackRate}: ${name}`);
      }
      return true;
    } catch (error) {
      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.warn(`[AudioManager] HTMLAudioElement playback failed: ${name}`, error);
      }
      return false;
    }
  }

  /**
   * 使用ArrayBuffer播放并调整音高
   */
  private async playArrayBufferWithRate(buffer: ArrayBuffer, name: string, playbackRate: number): Promise<void> {
    const context = this.getAudioContext();
    if (!context) {
      return;
    }

    try {
      await this.resumeAudioContextIfNeeded();
      const decoded = await context.decodeAudioData(buffer.slice(0));
      this.sfxClips.set(name, decoded);
      this.playDecodedBufferWithRate(decoded, name, playbackRate);
    } catch (error) {
      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.warn(`[AudioManager] Failed to decode SFX array buffer: ${name}`, error);
      }
    }
  }

  /**
   * 使用WebAudio播放并调整音高
   */
  private playDecodedBufferWithRate(buffer: AudioBuffer, name: string, playbackRate: number): void {
    const context = this.getAudioContext();
    if (!context) {
      return;
    }

    const source = context.createBufferSource();
    const gainNode = context.createGain();
    source.buffer = buffer;
    source.playbackRate.value = playbackRate; // 关键：设置音高
    gainNode.gain.value = this.sfxVolume;
    source.connect(gainNode);
    gainNode.connect(context.destination as AudioNode);
    source.start(0);

    if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
      console.log(`[AudioManager] Playing SFX via WebAudio with rate ${playbackRate}: ${name}`);
    }
  }

  /**
   * 重置连击计数
   */
  public resetCombo(): void {
    this.comboCount = 0;
    if (this.comboTimer) {
      clearTimeout(this.comboTimer);
      this.comboTimer = null;
    }

    if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
      console.log('[AudioManager] 连击计数已重置');
    }
  }

  /**
   * 获取当前连击数
   */
  public getComboCount(): number {
    return this.comboCount;
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
