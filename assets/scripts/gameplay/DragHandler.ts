import { _decorator, Component, EventTouch, Node } from 'cc';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';

const { ccclass } = _decorator;

@ccclass('DragHandler')
export class DragHandler extends Component {
  private readonly eventManager = EventManager.getInstance();

  onEnable(): void {
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  }

  onDisable(): void {
    this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  }

  private onTouchStart(_event: EventTouch): void {
    this.eventManager.emit(GAME_EVENTS.ITEM_DRAG_START, this.node.name);
  }

  private onTouchEnd(_event: EventTouch): void {
    this.eventManager.emit(GAME_EVENTS.ITEM_DRAG_END, this.node.name);
  }
}
