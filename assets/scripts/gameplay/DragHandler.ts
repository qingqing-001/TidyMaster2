import { _decorator, Component, EventTouch, Node, Vec3, UITransform, tween, easing, v3, director } from 'cc';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';
import { AudioManager } from '../audio/AudioManager';
import { ParticleEffects } from '../effects/ParticleEffects';
import { ItemController, ItemState } from './ItemController';
import { SlotController } from './SlotController';

const { ccclass } = _decorator;

@ccclass('DragHandler')
export class DragHandler extends Component {
  private readonly eventManager = EventManager.getInstance();
  private readonly audioManager = AudioManager.getInstance();

  private isDragging = false;
  private originalPosition: Vec3 = v3(0, 0, 0);
  private targetSlot: SlotController | null = null;
  private dragOffset: Vec3 = v3(0, 0, 0);
  private itemController: ItemController | null = null;

  onEnable(): void {
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

    this.itemController = this.node.getComponent(ItemController);
  }

  onDisable(): void {
    this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
  }

  private onTouchStart(event: EventTouch): void {
    event.propagationStopped = true;

    if (this.isDragging) {
      return;
    }

    // 检查物品是否已经放置，如果是则从原槽位移除
    if (this.itemController && this.itemController.getState() === ItemState.PLACED) {
      this.removeFromCurrentSlot();
    }

    this.isDragging = true;
    this.originalPosition = v3(this.node.position.x, this.node.position.y, this.node.position.z);

    const touchParentPos = this.getTouchPositionInParent(event);
    this.dragOffset = v3(
      this.node.position.x - touchParentPos.x,
      this.node.position.y - touchParentPos.y,
      this.node.position.z
    );

    this.audioManager.playSFX('sfx_item_pickup');

    if (this.itemController) {
      this.itemController.setState(ItemState.DRAGGING);
    }

    this.eventManager.emit(GAME_EVENTS.ITEM_DRAG_START, this.node.name);
  }

  /**
   * 从当前槽位移除物品（处理重新拖拽已放置物品的情况）
   */
  private removeFromCurrentSlot(): void {
    if (!this.itemController) {
      return;
    }

    const itemId = this.itemController.itemId;
    if (!itemId) {
      return;
    }

    const scene = director.getScene();
    if (!scene) {
      return;
    }

    const slots = scene.getComponentsInChildren(SlotController) as SlotController[];
    for (const slot of slots) {
      if (slot.getItems().includes(itemId)) {
        const slotId = slot.slotId;
        slot.removeItem(itemId);
        console.log(`[DragHandler] 从槽位 ${slotId} 移除物品 ${itemId}`);

        // 发送物品移除事件，以便 LevelManager 更新进度
        this.eventManager.emit(GAME_EVENTS.ITEM_REMOVED, {
          itemId: itemId,
          slotId: slotId
        });
        break;
      }
    }
  }

  private onTouchMove(event: EventTouch): void {
    if (!this.isDragging) {
      return;
    }

    const touchParentPos = this.getTouchPositionInParent(event);
    this.node.setPosition(
      touchParentPos.x + this.dragOffset.x,
      touchParentPos.y + this.dragOffset.y,
      this.originalPosition.z
    );

    this.checkTargetSlot();
  }

  private onTouchEnd(_event: EventTouch): void {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;

    if (this.targetSlot) {
      const itemType = this.itemController?.itemType || '';
      const canPlace = this.targetSlot.canAcceptItem(itemType) && !this.targetSlot.isFull();

      if (canPlace) {
        this.snapToSlot();
      } else {
        this.audioManager.playSFX('sfx_item_wrong');
        this.bounceBack();
      }
    } else {
      this.bounceBack();
    }

    this.hideAllSlotHighlights();
    this.eventManager.emit(GAME_EVENTS.ITEM_DRAG_END, this.node.name);
  }

  private onTouchCancel(_event: EventTouch): void {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;
    this.bounceBack();
    this.hideAllSlotHighlights();
  }

  private getTouchPositionInParent(event: EventTouch): Vec3 {
    const parent = this.node.parent;
    const uiPos = event.getUILocation();

    if (!parent) {
      return v3(uiPos.x, uiPos.y, 0);
    }

    const parentWorldPos = parent.worldPosition;
    const parentTransform = parent.getComponent(UITransform) as UITransform | null;

    if (!parentTransform) {
      return v3(uiPos.x - parentWorldPos.x, uiPos.y - parentWorldPos.y, 0);
    }

    const localX = uiPos.x - parentWorldPos.x - parentTransform.contentSize.width * (0.5 - parentTransform.anchorX);
    const localY = uiPos.y - parentWorldPos.y - parentTransform.contentSize.height * (0.5 - parentTransform.anchorY);
    return v3(localX, localY, 0);
  }

  private convertWorldToParentLocal(worldPos: Vec3): Vec3 {
    const parent = this.node.parent;
    if (!parent) {
      return v3(worldPos.x, worldPos.y, worldPos.z);
    }

    const parentWorldPos = parent.worldPosition;
    const parentTransform = parent.getComponent(UITransform) as UITransform | null;

    if (!parentTransform) {
      return v3(worldPos.x - parentWorldPos.x, worldPos.y - parentWorldPos.y, worldPos.z - parentWorldPos.z);
    }

    const localX = worldPos.x - parentWorldPos.x - parentTransform.contentSize.width * (0.5 - parentTransform.anchorX);
    const localY = worldPos.y - parentWorldPos.y - parentTransform.contentSize.height * (0.5 - parentTransform.anchorY);
    const localZ = worldPos.z - parentWorldPos.z;
    return v3(localX, localY, localZ);
  }

  private checkTargetSlot(): void {
    if (this.targetSlot) {
      this.targetSlot.hideHighlight();
    }
    this.targetSlot = null;

    const scene = director.getScene();
    if (!scene) {
      return;
    }

    const slots = scene.getComponentsInChildren(SlotController) as SlotController[];
    for (const slot of slots) {
      if (!slot.containsItem(this.node)) {
        continue;
      }

      this.targetSlot = slot;
      const itemType = this.itemController?.itemType || '';
      if (slot.canAcceptItem(itemType) && !slot.isFull()) {
        slot.showHighlight();
      } else {
        slot.hideHighlight();
      }
      break;
    }
  }

  private hideAllSlotHighlights(): void {
    const scene = director.getScene();
    if (!scene) {
      return;
    }

    const slots = scene.getComponentsInChildren(SlotController) as SlotController[];
    for (const slot of slots) {
      slot.hideHighlight();
    }
  }

  private snapToSlot(): void {
    if (!this.targetSlot) {
      this.bounceBack();
      return;
    }

    const targetPos = this.convertWorldToParentLocal(this.targetSlot.getWorldPosition());
    const slotId = this.targetSlot.slotId;

    tween(this.node)
      .to(0.3, { position: targetPos }, { easing: easing.backOut })
      .call(() => {
        // 播放连击音效（带音高递增效果）
        this.audioManager.playCombo();
        ParticleEffects.showSuccessParticles(this.node.worldPosition);

        if (this.itemController) {
          this.itemController.setState(ItemState.PLACED);
          this.targetSlot?.addItem(this.itemController.itemId);

          // 发送物品归位成功事件
          this.eventManager.emit(GAME_EVENTS.ITEM_PLACED, {
            itemId: this.itemController.itemId,
            slotId: slotId
          });
        }
      })
      .start();
  }

  private bounceBack(): void {
    this.audioManager.playSFX('sfx_item_bounce');

    tween(this.node)
      .to(0.3, { position: this.originalPosition }, { easing: easing.backOut })
      .call(() => {
        if (this.itemController) {
          this.itemController.setState(ItemState.IDLE);
        }
      })
      .start();
  }
}
