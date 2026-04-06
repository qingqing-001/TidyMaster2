import { _decorator, Component, Vec3, Sprite, v3 } from 'cc';
import { DragHandler } from './DragHandler';

const { ccclass, property } = _decorator;

/**
 * 物品状态枚举
 */
export enum ItemState {
  IDLE = 'idle',
  DRAGGING = 'dragging',
  PLACED = 'placed'
}

@ccclass('ItemController')
export class ItemController extends Component {
  @property
  public itemId = '';

  @property
  public itemType = '';

  private state: ItemState = ItemState.IDLE;
  private originalPosition: Vec3 = v3(0, 0, 0);
  private dragHandler: DragHandler | null = null;
  private sprite: Sprite | null = null;

  onLoad(): void {
    this.dragHandler = this.node.getComponent(DragHandler);
    this.sprite = this.node.getComponent(Sprite);
    this.originalPosition = { x: this.node.position.x, y: this.node.position.y, z: this.node.position.z };
  }

  /**
   * 设置物品信息
   */
  public setup(itemId: string, itemType: string): void {
    this.itemId = itemId;
    this.itemType = itemType;
  }

  /**
   * 设置物品状态
   */
  public setState(state: ItemState): void {
    this.state = state;
    this.updateVisualFeedback();
  }

  /**
   * 获取当前状态
   */
  public getState(): ItemState {
    return this.state;
  }

  /**
   * 获取原始位置
   */
  public getOriginalPosition(): Vec3 {
    return { x: this.originalPosition.x, y: this.originalPosition.y, z: this.originalPosition.z };
  }

  /**
   * 更新物品位置
   */
  public setPosition(position: Vec3): void {
    this.node.position = { x: position.x, y: position.y, z: position.z };
  }

  /**
   * 更新视觉反馈
   */
  private updateVisualFeedback(): void {
    switch (this.state) {
      case ItemState.DRAGGING:
        this.applyDraggingVisuals();
        break;
      case ItemState.PLACED:
        this.applyPlacedVisuals();
        break;
      case ItemState.IDLE:
      default:
        this.applyIdleVisuals();
        break;
    }
  }

  /**
   * 拖拽中视觉效果：放大1.1倍 + 阴影
   */
  private applyDraggingVisuals(): void {
    this.node.setScale(1.1, 1.1, 1.1);
    if (this.sprite) {
      // TODO: 添加阴影效果
      // 可以通过修改颜色透明度或添加阴影子节点实现
    }
  }

  /**
   * 归位成功视觉效果
   */
  private applyPlacedVisuals(): void {
    this.node.setScale(1.0, 1.0, 1.0);
    if (this.sprite) {
      // TODO: 添加成功高亮效果
    }
  }

  /**
   * 恢复原始状态视觉效果
   */
  private applyIdleVisuals(): void {
    this.node.setScale(1.0, 1.0, 1.0);
    if (this.sprite) {
      // 恢复原始颜色
    }
  }

  /**
   * 重置物品到原始位置
   */
  public resetToOriginalPosition(): void {
    this.node.setPosition(this.originalPosition);
  }
}
