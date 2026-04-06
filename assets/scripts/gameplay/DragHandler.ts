import { _decorator, Component, EventTouch, Node, Vec3, UITransform, Camera, tween, easing, v3, director } from 'cc';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';
import { AudioManager } from '../audio/AudioManager';
import { ParticleEffects } from '../effects/ParticleEffects';
import { ItemController, ItemState } from './ItemController';
import { SlotController } from './SlotController';

const { ccclass, property } = _decorator;

@ccclass('DragHandler')
export class DragHandler extends Component {
  private readonly eventManager = EventManager.getInstance();
  private readonly audioManager = AudioManager.getInstance();

  private isDragging = false;
  private originalPosition: Vec3 = v3(0, 0, 0);
  private targetSlot: SlotController | null = null;
  private dragOffset: Vec3 = v3(0, 0, 0);
  private itemController: ItemController | null = null;
  private uiCamera: Camera | null = null;

  onEnable(): void {
    // 注册触摸事件
    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

    // 获取物品控制器
    this.itemController = this.node.getComponent(ItemController);

    // 获取UI摄像机
    const scene = director.getScene();
    if (scene) {
      this.uiCamera = scene.getComponentInChildren(Camera) || null;
    }
  }

  onDisable(): void {
    // 取消触摸事件
    this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
  }

  /**
   * 触摸开始
   */
  private onTouchStart(event: EventTouch): void {
    event.propagationStopped = true;

    if (this.isDragging) {
      return;
    }

    this.isDragging = true;
    this.originalPosition = { x: this.node.position.x, y: this.node.position.y, z: this.node.position.z };

    // 记录触摸偏移
    const touchPos = this.getTouchWorldPosition(event);
    const nodePos = this.node.worldPosition;
    this.dragOffset.x = nodePos.x - touchPos.x;
    this.dragOffset.y = nodePos.y - touchPos.y;
    this.dragOffset.z = nodePos.z - touchPos.z;

    // 播放拿起音效
    this.audioManager.playSFX('sfx_item_pickup');

    // 更新物品状态
    if (this.itemController) {
      this.itemController.setState(ItemState.DRAGGING);
    }

    // 发送拖拽开始事件
    this.eventManager.emit(GAME_EVENTS.ITEM_DRAG_START, this.node.name);
  }

  /**
   * 触摸移动
   */
  private onTouchMove(event: EventTouch): void {
    if (!this.isDragging) {
      return;
    }

    // 物品跟随手指移动
    const touchPos = this.getTouchWorldPosition(event);
    const targetPos: Vec3 = {
      x: touchPos.x + this.dragOffset.x,
      y: touchPos.y + this.dragOffset.y,
      z: touchPos.z + this.dragOffset.z
    };

    // 将世界坐标转换为本地坐标
    const parent = this.node.parent;
    if (parent) {
      const parentTransform = parent.getComponent(UITransform);
      if (parentTransform) {
        // 使用父节点的UITransform进行坐标转换
        // 注意：convertToNodeSpaceAR 方法需要在运行时由Cocos提供
        // 这里暂时使用简化逻辑
        this.node.position = { x: targetPos.x, y: targetPos.y, z: targetPos.z };
      } else {
        this.node.position = { x: targetPos.x, y: targetPos.y, z: targetPos.z };
      }
    } else {
      this.node.position = { x: targetPos.x, y: targetPos.y, z: targetPos.z };
    }

    // 检测目标槽位
    this.checkTargetSlot();
  }

  /**
   * 触摸结束
   */
  private onTouchEnd(_event: EventTouch): void {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;

    // 判断是否在目标区域
    if (this.targetSlot) {
      const itemType = this.itemController?.itemType || '';
      const canPlace = this.targetSlot.canAcceptItem(itemType) && !this.targetSlot.isFull();

      if (canPlace) {
        // 吸附归位
        this.snapToSlot();
      } else {
        // 类型不匹配或槽位已满，播放错误音效
        this.audioManager.playSFX('sfx_item_wrong');
        this.bounceBack();
      }
    } else {
      // 不在目标区域，弹回原位
      this.bounceBack();
    }

    // 隐藏所有高亮
    this.hideAllSlotHighlights();

    // 发送拖拽结束事件
    this.eventManager.emit(GAME_EVENTS.ITEM_DRAG_END, this.node.name);
  }

  /**
   * 触摸取消
   */
  private onTouchCancel(_event: EventTouch): void {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;

    // 取消拖拽，弹回原位
    this.bounceBack();
    this.hideAllSlotHighlights();
  }

  /**
   * 获取触摸点的世界坐标
   */
  private getTouchWorldPosition(event: EventTouch): Vec3 {
    const uiTransform = this.node.getComponent(UITransform);
    if (!uiTransform) {
      return { x: event.getUILocation().x, y: event.getUILocation().y, z: 0 };
    }

    const camera = (uiTransform as any).camera || this.uiCamera;
    if (camera) {
      const worldPos: Vec3 = { x: 0, y: 0, z: 0 };
      // camera.convertToUIGLPosition(event.getUILocation(), worldPos);
      // 暂时使用简化的坐标计算
      const loc = event.getUILocation();
      worldPos.x = loc.x;
      worldPos.y = loc.y;
      return worldPos;
    }

    return { x: event.getUILocation().x, y: event.getUILocation().y, z: 0 };
  }

  /**
   * 检测目标槽位
   */
  private checkTargetSlot(): void {
    // 清除之前的高亮
    if (this.targetSlot) {
      this.targetSlot.hideHighlight();
    }
    this.targetSlot = null;

    // 查找所有槽位控制器
    const scene = director.getScene();
    if (!scene) return;
    const slots = scene.getComponentsInChildren(SlotController) as SlotController[];

    for (const slot of slots) {
      if (slot.containsItem(this.node)) {
        // 找到目标槽位
        this.targetSlot = slot;

        // 检查物品类型是否匹配
        const itemType = this.itemController?.itemType || '';
        if (slot.canAcceptItem(itemType) && !slot.isFull()) {
          // 可以放置，显示高亮
          slot.showHighlight();
        }
        break;
      }
    }
  }

  /**
   * 隐藏所有槽位的高亮
   */
  private hideAllSlotHighlights(): void {
    const scene = director.getScene();
    if (!scene) return;
    const slots = scene.getComponentsInChildren(SlotController) as SlotController[];
    for (const slot of slots) {
      slot.hideHighlight();
    }
  }

  /**
   * 吸附到槽位
   */
  private snapToSlot(): void {
    if (!this.targetSlot) {
      this.bounceBack();
      return;
    }

    // 获取槽位的世界坐标
    const slotWorldPos = this.targetSlot.getWorldPosition();

    // 转换为本地坐标
    const parent = this.node.parent;
    let targetPos: Vec3;
    if (parent) {
      const parentTransform = parent.getComponent(UITransform);
      if (parentTransform) {
        // 简化处理：直接使用槽位的世界坐标
        targetPos = slotWorldPos;
      } else {
        targetPos = slotWorldPos;
      }
    } else {
      targetPos = slotWorldPos;
    }

    // 使用easeBackOut动画吸附
    tween(this.node)
      .to(0.3, { position: targetPos }, { easing: easing.backOut })
      .by(0.05, { scale: { x: -0.05, y: -0.05, z: -0.05 } }) // 微微缩小产生吸附感
      .call(() => {
        // 播放归位音效
        this.audioManager.playSFX('sfx_item_place');

        // 触发粒子特效
        ParticleEffects.showSuccessParticles(this.node.position);

        // 更新物品状态
        if (this.itemController) {
          this.itemController.setState(ItemState.PLACED);
        }

        // 将物品添加到槽位
        if (this.itemController) {
          this.targetSlot!.addItem(this.itemController.itemId);
        }
      })
      .start();
  }

  /**
   * 弹回原位
   */
  private bounceBack(): void {
    // 播放弹回音效
    this.audioManager.playSFX('sfx_item_bounce');

    // 使用easeBackOut动画弹回
    tween(this.node)
      .to(0.3, { position: this.originalPosition }, { easing: easing.backOut })
      .call(() => {
        // 更新物品状态
        if (this.itemController) {
          this.itemController.setState(ItemState.IDLE);
        }
      })
      .start();
  }
}
