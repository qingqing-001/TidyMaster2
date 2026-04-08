export interface UserInfo {
  nickName?: string;
  avatarUrl?: string;
  gender?: number;
  city?: string;
  province?: string;
  country?: string;
  language?: string;
}

export interface SystemInfo {
  platform?: string;
  system?: string;
  model?: string;
  pixelRatio?: number;
  screenWidth?: number;
  screenHeight?: number;
  windowWidth?: number;
  windowHeight?: number;
  language?: string;
  [key: string]: unknown;
}

export interface IPlatformAdapter {
  isWechat(): boolean;
  getSystemInfo(): SystemInfo | null;
  vibrateShort(): void;
  showToast(message: string): void;
  showLoading(title?: string): void;
  hideLoading(): void;
  share(title: string, imageUrl: string): void;
  login(): Promise<UserInfo>;
  getUserInfo(): UserInfo | null;
  getStorage(key: string): string | null;
  setStorage(key: string, value: string): void;
  requestAnimationFrame(callback: () => void): void;
}

export abstract class PlatformAdapter implements IPlatformAdapter {
  public abstract isWechat(): boolean;

  public abstract getSystemInfo(): SystemInfo | null;

  public abstract vibrateShort(): void;

  public abstract showToast(message: string): void;

  public showLoading(title = '加载中...'): void {
    void title;
  }

  public hideLoading(): void {
    // no-op by default
  }

  public share(title: string, imageUrl: string): void {
    void title;
    void imageUrl;
  }

  public async login(): Promise<UserInfo> {
    return this.getUserInfo() ?? {};
  }

  public getUserInfo(): UserInfo | null {
    return null;
  }

  public getStorage(key: string): string | null {
    void key;
    return null;
  }

  public setStorage(key: string, value: string): void {
    void key;
    void value;
  }

  public requestAnimationFrame(callback: () => void): void {
    const raf = typeof globalThis !== 'undefined' ? globalThis.requestAnimationFrame : undefined;

    if (typeof raf === 'function') {
      raf.call(globalThis, callback);
      return;
    }

    setTimeout(callback, 16);
  }
}
