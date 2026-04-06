import { PlatformAdapter, UserInfo } from './PlatformAdapter';

export class WebAdapter extends PlatformAdapter {
  public override isWechat(): boolean {
    return false;
  }

  public override getSystemInfo(): Record<string, unknown> | null {
    // 返回浏览器系统信息
    const info: Record<string, unknown> = {
      platform: 'web',
      system: navigator.userAgent,
      model: 'browser',
      pixelRatio: window.devicePixelRatio || 1,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      language: navigator.language,
    };
    return info;
  }

  public override vibrateShort(): void {
    // 浏览器振动API
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  }

  public override showToast(message: string): void {
    // 在Web上可以使用alert或创建自定义toast
    // 这里使用alert作为简单实现
    console.log('[WebAdapter] Toast:', message);
    // 实际项目中可以实现一个自定义的toast组件
  }

  public override showLoading(title?: string): void {
    console.log('[WebAdapter] Loading:', title);
    // 实际项目中可以显示一个loading遮罩层
  }

  public override hideLoading(): void {
    console.log('[WebAdapter] Hide loading');
    // 实际项目中可以隐藏loading遮罩层
  }

  public override share(title: string, imageUrl: string): void {
    console.log('[WebAdapter] Share:', title, imageUrl);
    // Web平台可以使用Web Share API（如果支持）
    if (navigator.share) {
      navigator.share({
        title,
        // 由于Web Share API的局限性，可能无法直接分享图片
      }).catch((err) => {
        console.log('Share failed:', err);
      });
    } else {
      // 降级处理：复制链接到剪贴板等
      console.log('Web Share API not supported');
    }
  }

  public override async login(): Promise<UserInfo> {
    console.log('[WebAdapter] Login');
    // Web平台通常有自己的登录系统
    // 这里返回一个模拟的用户信息
    return {
      nickName: 'Web User',
      avatarUrl: '',
      language: navigator.language,
    };
  }

  public override getUserInfo(): UserInfo | null {
    console.log('[WebAdapter] Get user info');
    // 从localStorage或其他地方获取用户信息
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      try {
        return JSON.parse(userInfoStr) as UserInfo;
      } catch (e) {
        console.error('Failed to parse userInfo:', e);
      }
    }
    return null;
  }

  public override getStorage(key: string): string | null {
    try {
      const value = localStorage.getItem(key);
      return value;
    } catch (e) {
      console.error('[WebAdapter] getStorage error:', e);
      return null;
    }
  }

  public override setStorage(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('[WebAdapter] setStorage error:', e);
    }
  }

  public override requestAnimationFrame(callback: () => void): void {
    // 浏览器原生支持requestAnimationFrame
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(callback);
    } else {
      // 降级到setTimeout
      setTimeout(callback, 16);
    }
  }
}
