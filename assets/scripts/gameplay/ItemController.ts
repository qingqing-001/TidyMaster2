import { _decorator, Component, Vec3, Sprite, v3, Node, Color, UIOpacity, tween, UITransform, Layers } from 'cc';
import { DragHandler } from './DragHandler';
import { OperationType } from '../data/LevelData';

const { ccclass, property } = _decorator;

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
  private operation: OperationType = OperationType.DRAG;
  private targetSlotId = '';
  private rotationStep = 0;
  private rotationDegrees = 0;
  private originalPosition: Vec3 = v3(0, 0, 0);
  private dragHandler: DragHandler | null = null;
  private sprite: Sprite | null = null;
  private shadowNode: Node | null = null;
  private shadowSprite: Sprite | null = null;
  private shadowOpacity: UIOpacity | null = null;
  private originalColor: Color = new Color(255, 255, 255, 255);

  onLoad(): void {
    this.dragHandler = this.node.getComponent(DragHandler);
    this.sprite = this.node.getComponent(Sprite);
    this.originalPosition = v3(this.node.position.x, this.node.position.y, this.node.position.z);
    this.originalColor = this.sprite ? this.sprite.color.clone() : new Color(255, 255, 255, 255);
    this.ensureShadowNode();
    this.updateVisualFeedback();
  }

  public setup(itemId: string, itemType: string): void {
    this.itemId = itemId;
    this.itemType = itemType;
  }

  public setOperation(operation: OperationType, targetSlotId = ''): void {
    this.operation = operation;
    this.targetSlotId = targetSlotId;
  }

  public getOperation(): OperationType {
    return this.operation;
  }

  public getTargetSlotId(): string {
    return this.targetSlotId;
  }

  public setRotationState(step: number, degrees: number): void {
    this.rotationStep = step;
    this.rotationDegrees = degrees;
    this.node.angle = degrees;
    if (this.shadowNode) {
      this.shadowNode.angle = degrees;
    }
  }

  public getRotationStep(): number {
    return this.rotationStep;
  }

  public getRotationDegrees(): number {
    return this.rotationDegrees;
  }

  public setState(state: ItemState): void {
    this.state = state;
    this.updateVisualFeedback();
  }

  public getState(): ItemState {
    return this.state;
  }

  public getOriginalPosition(): Vec3 {
    return v3(this.originalPosition.x, this.originalPosition.y, this.originalPosition.z);
  }

  public setPosition(position: Vec3): void {
    this.node.setPosition(position);
  }

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

  private applyDraggingVisuals(): void {
    tween(this.node).stop();
    this.node.setScale(1.1, 1.1, 1.1);
    this.setShadowVisible(true, 140);

    if (this.sprite) {
      this.sprite.color = this.originalColor.clone();
    }
  }

  private applyPlacedVisuals(): void {
    tween(this.node).stop();
    this.node.setScale(1.0, 1.0, 1.0);
    this.setShadowVisible(false, 0);

    if (this.sprite) {
      this.sprite.color = new Color(255, 248, 200, 255);
      tween(this.sprite)
        .to(0.12, { color: new Color(255, 255, 160, 255) })
        .to(0.18, { color: this.originalColor.clone() })
        .start();
    }
  }

  private applyIdleVisuals(): void {
    tween(this.node).stop();
    this.node.setScale(1.0, 1.0, 1.0);
    this.setShadowVisible(false, 0);

    if (this.sprite) {
      this.sprite.color = this.originalColor.clone();
    }
  }

  public resetToOriginalPosition(): void {
    this.node.setPosition(this.originalPosition);
  }

  private ensureShadowNode(): void {
    if (this.shadowNode || !this.sprite) {
      return;
    }

    const shadowNode = new Node('ItemShadow');
    shadowNode.layer = this.node.layer || Layers.Enum.UI_2D;
    shadowNode.setParent(this.node.parent);
    shadowNode.setSiblingIndex(Math.max(this.node.getSiblingIndex(), 0));
    shadowNode.setPosition(this.node.position.x + 10, this.node.position.y - 12, this.node.position.z - 1);
    shadowNode.setScale(1.04, 1.04, 1);

    const transform = shadowNode.addComponent(UITransform);
    const sourceTransform = this.node.getComponent(UITransform);
    if (sourceTransform) {
      transform.setContentSize(sourceTransform.contentSize);
      transform.anchorX = sourceTransform.anchorX;
      transform.anchorY = sourceTransform.anchorY;
    }

    const shadowSprite = shadowNode.addComponent(Sprite);
    shadowSprite.spriteFrame = this.sprite.spriteFrame;
    shadowSprite.color = new Color(0, 0, 0, 255);
    shadowSprite.grayscale = this.sprite.grayscale;
    shadowSprite.sizeMode = this.sprite.sizeMode;
    shadowSprite.trim = this.sprite.trim;
    shadowSprite.type = this.sprite.type;

    const opacity = shadowNode.addComponent(UIOpacity);
    opacity.opacity = 0;
    shadowNode.active = false;

    this.shadowNode = shadowNode;
    this.shadowSprite = shadowSprite;
    this.shadowOpacity = opacity;
    this.syncShadowTransform();
  }

  private setShadowVisible(visible: boolean, opacity: number): void {
    if (!this.shadowNode || !this.shadowOpacity) {
      return;
    }

    this.syncShadowTransform();
    this.shadowNode.active = visible || opacity > 0;
    tween(this.shadowOpacity).stop();
    tween(this.shadowOpacity)
      .to(0.12, { opacity })
      .call(() => {
        if (this.shadowNode) {
          this.shadowNode.active = visible;
        }
      })
      .start();
  }

  private syncShadowTransform(): void {
    if (!this.shadowNode) {
      return;
    }

    const position = this.node.position;
    const scale = this.node.scale;
    this.shadowNode.setPosition(position.x + 10, position.y - 12, position.z - 1);
    this.shadowNode.setScale(scale.x * 1.04, scale.y * 1.04, scale.z);
    this.shadowNode.setSiblingIndex(Math.max(this.node.getSiblingIndex(), 0));

    if (this.shadowSprite && this.sprite) {
      this.shadowSprite.spriteFrame = this.sprite.spriteFrame;
      this.shadowSprite.grayscale = this.sprite.grayscale;
      this.shadowSprite.sizeMode = this.sprite.sizeMode;
      this.shadowSprite.trim = this.sprite.trim;
      this.shadowSprite.type = this.sprite.type;
    }
  }

  lateUpdate(): void {
    this.syncShadowTransform();
  }

  onDestroy(): void {
    if (this.shadowNode?.isValid) {
      this.shadowNode.destroy();
    }
    this.shadowNode = null;
    this.shadowSprite = null;
    this.shadowOpacity = null;
  }
}
