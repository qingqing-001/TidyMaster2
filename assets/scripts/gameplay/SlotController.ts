import { _decorator, Component } from 'cc';
import { GAME_CONFIG } from '../../data/constants';

const { ccclass } = _decorator;

@ccclass('SlotController')
export class SlotController extends Component {
  private readonly itemIds: string[] = [];

  public addItem(itemId: string): boolean {
    if (this.itemIds.length >= GAME_CONFIG.SLOT_CAPACITY) {
      return false;
    }

    this.itemIds.push(itemId);
    return true;
  }

  public getItems(): string[] {
    return [...this.itemIds];
  }

  public clear(): void {
    this.itemIds.length = 0;
  }
}
