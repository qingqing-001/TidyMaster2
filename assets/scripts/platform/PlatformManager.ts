import { PlatformAdapter } from './PlatformAdapter';
import { WxAdapter } from './WxAdapter';
import { WebAdapter } from './WebAdapter';

declare const wx: unknown;

export class PlatformManager {
  private static instance: PlatformManager;
  private adapter: PlatformAdapter;

  private constructor() {
    // 根据环境自动选择适配器
    if (this.detectWechat()) {
      console.log('[PlatformManager] Using WxAdapter');
      this.adapter = new WxAdapter();
    } else {
      console.log('[PlatformManager] Using WebAdapter');
      this.adapter = new WebAdapter();
    }
  }

  public static getInstance(): PlatformManager {
    if (!PlatformManager.instance) {
      PlatformManager.instance = new PlatformManager();
    }
    return PlatformManager.instance;
  }

  public static getAdapter(): PlatformAdapter {
    return PlatformManager.getInstance().getAdapterInternal();
  }

  private getAdapterInternal(): PlatformAdapter {
    return this.adapter;
  }

  private detectWechat(): boolean {
    // 检查wx对象是否存在
    if (typeof wx !== 'undefined') {
      return true;
    }

    // 检查UserAgent中是否包含微信标识
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      return ua.indexOf('micromessenger') !== -1;
    }

    return false;
  }

  // 便捷方法，直接通过PlatformManager调用
  public static isWechat(): boolean {
    return PlatformManager.getAdapter().isWechat();
  }

  public static getSystemInfo(): Record<string, unknown> | null {
    return PlatformManager.getAdapter().getSystemInfo();
  }

  public static vibrateShort(): void {
    PlatformManager.getAdapter().vibrateShort();
  }

  public static showToast(message: string): void {
    PlatformManager.getAdapter().showToast(message);
  }

  public static showLoading(title?: string): void {
    PlatformManager.getAdapter().showLoading(title);
  }

  public static hideLoading(): void {
    PlatformManager.getAdapter().hideLoading();
  }

  public static share(title: string, imageUrl: string): void {
    PlatformManager.getAdapter().share(title, imageUrl);
  }

  public static login(): Promise<import('./PlatformAdapter').UserInfo> {
    return PlatformManager.getAdapter().login();
  }

  public static getUserInfo(): import('./PlatformAdapter').UserInfo | null {
    return PlatformManager.getAdapter().getUserInfo();
  }

  public static getStorage(key: string): string | null {
    return PlatformManager.getAdapter().getStorage(key);
  }

  public static setStorage(key: string, value: string): void {
    PlatformManager.getAdapter().setStorage(key, value);
  }

  public static requestAnimationFrame(callback: () => void): void {
    PlatformManager.getAdapter().requestAnimationFrame(callback);
  }
}

// 导出默认实例
export default PlatformManager;
