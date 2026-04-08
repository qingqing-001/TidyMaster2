import { PlatformAdapter, SystemInfo, UserInfo } from './PlatformAdapter';

export class WebAdapter extends PlatformAdapter {
  private cachedUserInfo: UserInfo | null = null;

  public override isWechat(): boolean {
    return false;
  }

  public override getSystemInfo(): SystemInfo | null {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        platform: 'web',
      };
    }

    return {
      platform: 'web',
      system: navigator.userAgent,
      model: 'browser',
      pixelRatio: window.devicePixelRatio || 1,
      screenWidth: window.screen?.width,
      screenHeight: window.screen?.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      language: navigator.language,
    };
  }

  public override vibrateShort(): void {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(15);
    }
  }

  public override showToast(message: string): void {
    console.log('[WebAdapter] Toast:', message);
  }

  public override showLoading(title = '加载中...'): void {
    console.log('[WebAdapter] Loading:', title);
  }

  public override hideLoading(): void {
    console.log('[WebAdapter] Hide loading');
  }

  public override share(title: string, imageUrl: string): void {
    console.log('[WebAdapter] Share:', title, imageUrl);

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      navigator.share({ title }).catch((error) => {
        console.log('[WebAdapter] Share failed:', error);
      });
    }
  }

  public override async login(): Promise<UserInfo> {
    const userInfo: UserInfo = {
      nickName: 'Web User',
      avatarUrl: '',
      language: typeof navigator !== 'undefined' ? navigator.language : undefined,
    };

    this.cachedUserInfo = userInfo;

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      } catch (error) {
        console.error('[WebAdapter] cache userInfo error:', error);
      }
    }

    return userInfo;
  }

  public override getUserInfo(): UserInfo | null {
    if (this.cachedUserInfo) {
      return this.cachedUserInfo;
    }

    if (typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) {
        return null;
      }

      this.cachedUserInfo = JSON.parse(userInfoStr) as UserInfo;
      return this.cachedUserInfo;
    } catch (error) {
      console.error('[WebAdapter] Failed to parse userInfo:', error);
      return null;
    }
  }

  public override getStorage(key: string): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('[WebAdapter] getStorage error:', error);
      return null;
    }
  }

  public override setStorage(key: string, value: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('[WebAdapter] setStorage error:', error);
    }
  }

  public override requestAnimationFrame(callback: () => void): void {
    const raf = typeof globalThis !== 'undefined' ? globalThis.requestAnimationFrame : undefined;
    if (typeof raf === 'function') {
      raf.call(globalThis, callback);
      return;
    }

    setTimeout(callback, 16);
  }
}
