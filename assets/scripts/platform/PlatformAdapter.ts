export interface UserInfo {
  nickName?: string;
  avatarUrl?: string;
  gender?: number;
  city?: string;
  province?: string;
  country?: string;
  language?: string;
}

export interface IPlatformAdapter {
  isWechat(): boolean;
  getSystemInfo(): Record<string, unknown> | null;
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

export class PlatformAdapter implements IPlatformAdapter {
  public isWechat(): boolean {
    return false;
  }

  public getSystemInfo(): Record<string, unknown> | null {
    return null;
  }

  public vibrateShort(): void {
    // noop for non-wechat platforms
  }

  public showToast(message: string): void {
    console.log('[PlatformAdapter] showToast:', message);
  }

  public showLoading(title?: string): void {
    console.log('[PlatformAdapter] showLoading:', title);
  }

  public hideLoading(): void {
    console.log('[PlatformAdapter] hideLoading');
  }

  public share(title: string, imageUrl: string): void {
    console.log('[PlatformAdapter] share:', title, imageUrl);
  }

  public async login(): Promise<UserInfo> {
    console.log('[PlatformAdapter] login');
    return {};
  }

  public getUserInfo(): UserInfo | null {
    console.log('[PlatformAdapter] getUserInfo');
    return null;
  }

  public getStorage(key: string): string | null {
    console.log('[PlatformAdapter] getStorage:', key);
    return null;
  }

  public setStorage(key: string, value: string): void {
    console.log('[PlatformAdapter] setStorage:', key, value);
  }

  public requestAnimationFrame(callback: () => void): void {
    // Fallback to browser API
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(callback);
    } else {
      // Fallback to setTimeout
      setTimeout(callback, 16);
    }
  }
}
