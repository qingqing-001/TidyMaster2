import { PlatformAdapter } from './PlatformAdapter';

declare const wx: {
  getSystemInfoSync?: () => Record<string, unknown>;
  vibrateShort?: () => void;
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
}
