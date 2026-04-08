import { PlatformAdapter, SystemInfo, UserInfo } from './PlatformAdapter';
import { WebAdapter } from './WebAdapter';
import { WxAdapter } from './WxAdapter';

declare const wx: unknown;

export class PlatformManager {
  private static instance: PlatformManager | null = null;
  private readonly adapter: PlatformAdapter;

  private constructor() {
    this.adapter = PlatformManager.detectWechat() ? new WxAdapter() : new WebAdapter();
    console.log(`[PlatformManager] Using ${this.adapter.constructor.name}`);
  }

  public static getInstance(): PlatformManager {
    if (!PlatformManager.instance) {
      PlatformManager.instance = new PlatformManager();
    }

    return PlatformManager.instance;
  }

  public static getAdapter(): PlatformAdapter {
    return PlatformManager.getInstance().adapter;
  }

  public static resetForTest(): void {
    PlatformManager.instance = null;
  }

  public static detectWechat(): boolean {
    if (typeof wx !== 'undefined') {
      return true;
    }

    if (typeof navigator !== 'undefined') {
      return navigator.userAgent.toLowerCase().includes('micromessenger');
    }

    return false;
  }

  public static isWechat(): boolean {
    return PlatformManager.getAdapter().isWechat();
  }

  public static getSystemInfo(): SystemInfo | null {
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

  public static login(): Promise<UserInfo> {
    return PlatformManager.getAdapter().login();
  }

  public static getUserInfo(): UserInfo | null {
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

export default PlatformManager;
