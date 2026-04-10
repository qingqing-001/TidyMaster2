import { _decorator, Component, Label } from 'cc';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('LaunchScene')
export class LaunchScene extends Component {
  @property(Label)
  public statusLabel: Label | null = null;

  private ensureGameManagerReady(): void {
    try {
      GameManager.getInstance();
    } catch (error) {
      throw new Error('[LaunchScene] 未检测到已挂载的 GameManager 组件，请先将 GameManager 组件加入启动场景。');
    }
  }

  start(): void {
    this.ensureGameManagerReady();
    GameManager.getInstance().initialize();

    if (this.statusLabel) {
      this.statusLabel.string = 'TidyMaster2 Phase 1 Scaffold Ready';
    }
  }
}
