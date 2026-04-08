import { PlatformAdapter, SystemInfo, UserInfo } from './PlatformAdapter';

interface WxLoginSuccessResult {
  code?: string;
}

interface WxGetUserInfoSuccessResult {
  userInfo?: UserInfo;
  nickName?: string;
  avatarUrl?: string;
  gender?: number;
  city?: string;
  province?: string;
  country?: string;
  language?: string;
}

declare const wx: {
  getSystemInfoSync?: () => SystemInfo;
  vibrateShort?: () => void;
  showToast?: (options: { title: string; duration?: number; icon?: 'none' | 'success' | 'error' }) => void;
  showLoading?: (options?: { title?: string; mask?: boolean }) => void;
  hideLoading?: () => void;
  shareAppMessage?: (options: { title: string; imageUrl?: string; path?: string }) => void;
  login?: (options: {
    success?: (res: WxLoginSuccessResult) => void;
    fail?: (error?: unknown) => void;
  }) => void;
  getUserInfo?: (options: {
    success?: (res: WxGetUserInfoSuccessResult) => void;
    fail?: (error?: unknown) => void;
  }) => void;
  getStorageSync?: (key: string) => string | undefined;
  setStorageSync?: (key: string, value: string) => void;
} | undefined;

export class WxAdapter extends PlatformAdapter {
  private cachedUserInfo: UserInfo | null = null;

  public override isWechat(): boolean {
    return typeof wx !== 'undefined';
  }

  public override getSystemInfo(): SystemInfo | null {
    if (!this.isWechat() || typeof wx?.getSystemInfoSync !== 'function') {
      return null;
    }

    return wx.getSystemInfoSync();
  }

  public override vibrateShort(): void {
    if (this.isWechat() && typeof wx?.vibrateShort === 'function') {
      wx.vibrateShort();
    }
  }

  public override showToast(message: string): void {
    if (this.isWechat() && typeof wx?.showToast === 'function') {
      wx.showToast({
        title: message,
        duration: 2000,
        icon: 'none',
      });
      return;
    }

    console.log('[WxAdapter] showToast fallback:', message);
  }

  public override showLoading(title = '加载中...'): void {
    if (this.isWechat() && typeof wx?.showLoading === 'function') {
      wx.showLoading({
        title,
        mask: true,
      });
      return;
    }

    console.log('[WxAdapter] showLoading fallback:', title);
  }

  public override hideLoading(): void {
    if (this.isWechat() && typeof wx?.hideLoading === 'function') {
      wx.hideLoading();
      return;
    }

    console.log('[WxAdapter] hideLoading fallback');
  }

  public override share(title: string, imageUrl: string): void {
    if (this.isWechat() && typeof wx?.shareAppMessage === 'function') {
      wx.shareAppMessage({
        title,
        imageUrl,
        path: '/pages/index/index',
      });
      return;
    }

    console.log('[WxAdapter] share fallback:', title, imageUrl);
  }

  public override async login(): Promise<UserInfo> {
    if (!this.isWechat() || typeof wx?.login !== 'function') {
      return {};
    }

    return new Promise((resolve, reject) => {
      wx.login?.({
        success: () => {
          if (typeof wx?.getUserInfo !== 'function') {
            resolve(this.cachedUserInfo ?? {});
            return;
          }

          wx.getUserInfo({
            success: (res) => {
              const userInfo = this.normalizeUserInfo(res);
              this.cachedUserInfo = userInfo;
              resolve(userInfo);
            },
            fail: () => {
              resolve(this.cachedUserInfo ?? {});
            },
          });
        },
        fail: (error) => {
          reject(error instanceof Error ? error : new Error('WeChat login failed'));
        },
      });
    });
  }

  public override getUserInfo(): UserInfo | null {
    return this.cachedUserInfo;
  }

  public override getStorage(key: string): string | null {
    if (!this.isWechat() || typeof wx?.getStorageSync !== 'function') {
      return null;
    }

    try {
      const value = wx.getStorageSync(key);
      return value ?? null;
    } catch (error) {
      console.error('[WxAdapter] getStorage error:', error);
      return null;
    }
  }

  public override setStorage(key: string, value: string): void {
    if (!this.isWechat() || typeof wx?.setStorageSync !== 'function') {
      return;
    }

    try {
      wx.setStorageSync(key, value);
    } catch (error) {
      console.error('[WxAdapter] setStorage error:', error);
    }
  }

  public override requestAnimationFrame(callback: () => void): void {
    const raf = typeof globalThis !== 'undefined' ? globalThis.requestAnimationFrame : undefined;
    if (typeof raf === 'function') {
      raf.call(globalThis, callback);
      return;
    }

    super.requestAnimationFrame(callback);
  }

  private normalizeUserInfo(res: WxGetUserInfoSuccessResult): UserInfo {
    if (res.userInfo) {
      return res.userInfo;
    }

    return {
      nickName: res.nickName,
      avatarUrl: res.avatarUrl,
      gender: res.gender,
      city: res.city,
      province: res.province,
      country: res.country,
      language: res.language,
    };
  }
}
