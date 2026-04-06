import { _decorator, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ItemController')
export class ItemController extends Component {
  @property()
  public itemId = '';

  public setup(itemId: string): void {
    this.itemId = itemId;
  }
}
