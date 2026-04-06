import { PlatformAdapter, UserInfo } from './PlatformAdapter';

declare const wx: {
  getSystemInfoSync?: () => Record<string, unknown>;
  vibrateShort?: () => void;
  showToast?: (options: { title: string; duration?: number; icon?: string }) => void;
  showLoading?: (options?: { title?: string; mask?: boolean }) => void;
  hideLoading?: () => void;
  shareAppMessage?: (callback: () => { title: string; imageUrl?: string; path?: string }) => void;
  login?: (callback: { success: (res: { code: string }) => void; fail?: () => void }) => void;
  getUserInfo?: (callback: { success: (res: UserInfo) => void; fail?: () => void }) => void;
  getStorageSync?: (key: string) => string | undefined;
  setStorageSync?: (key: string, value: string) => void;
} | undefined;

export class WxAdapter extends PlatformAdapter {
  public override isWechat(): boolean {
    return typeof wx !== 'undefined';
  }

  public override getSystemInfo(): Record<string, unknown> | null {
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
    } else {
      super.showToast(message);
    }
  }

  public override showLoading(title?: string): void {
    if (this.isWechat() && typeof wx?.showLoading === 'function') {
      wx.showLoading({
        title: title || '加载中...',
        mask: true,
      });
    } else {
      super.showLoading(title);
    }
  }

  public override hideLoading(): void {
    if (this.isWechat() && typeof wx?.hideLoading === 'function') {
      wx.hideLoading();
    } else {
      super.hideLoading();
    }
  }

  public override share(title: string, imageUrl: string): void {
    if (this.isWechat() && typeof wx?.shareAppMessage === 'function') {
      wx.shareAppMessage(() => ({
        title,
        imageUrl,
        path: '/pages/index/index',
      }));
    } else {
      super.share(title, imageUrl);
    }
  }

  public override async login(): Promise<UserInfo> {
    if (this.isWechat() && typeof wx?.login === 'function') {
      return new Promise((resolve, reject) => {
        wx.login!({
          success: () => {
            // 登录成功后获取用户信息
            if (typeof wx?.getUserInfo === 'function') {
              wx.getUserInfo!({
                success: (res: UserInfo) => {
                  resolve(res);
                },
                fail: () => {
                  resolve({});
                },
              });
            } else {
              resolve({});
            }
          },
          fail: () => {
            reject(new Error('Login failed'));
          },
        });
      });
    } else {
      return super.login();
    }
  }

  public override getUserInfo(): UserInfo | null {
    if (this.isWechat() && typeof wx?.getUserInfo === 'function') {
      let userInfo: UserInfo | null = null;
      wx.getUserInfo!({
        success: (res: UserInfo) => {
          userInfo = res;
        },
        fail: () => {
          userInfo = null;
        },
      });
      return userInfo;
    } else {
      return super.getUserInfo();
    }
  }

  public override getStorage(key: string): string | null {
    if (this.isWechat() && typeof wx?.getStorageSync === 'function') {
      try {
        const value = wx.getStorageSync(key);
        return value !== undefined ? value : null;
      } catch (e) {
        console.error('[WxAdapter] getStorage error:', e);
        return null;
      }
    } else {
      return super.getStorage(key);
    }
  }

  public override setStorage(key: string, value: string): void {
    if (this.isWechat() && typeof wx?.setStorageSync === 'function') {
      try {
        wx.setStorageSync(key, value);
      } catch (e) {
        console.error('[WxAdapter] setStorage error:', e);
      }
    } else {
      super.setStorage(key, value);
    }
  }

  public override requestAnimationFrame(callback: () => void): void {
    // 微信小游戏也支持requestAnimationFrame
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(callback);
    } else {
      super.requestAnimationFrame(callback);
    }
  }
}
