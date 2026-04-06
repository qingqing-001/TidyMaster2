import { _decorator, Component, Label } from 'cc';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('LaunchScene')
export class LaunchScene extends Component {
  @property(Label)
  public statusLabel: Label | null = null;

  start(): void {
    GameManager.getInstance().initialize();

    if (this.statusLabel) {
      this.statusLabel.string = 'TidyMaster2 Phase 1 Scaffold Ready';
    }
  }
}
