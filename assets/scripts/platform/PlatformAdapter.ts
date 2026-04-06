export interface IPlatformAdapter {
  isWechat(): boolean;
  getSystemInfo(): Record<string, unknown> | null;
  vibrateShort(): void;
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
}
