import { _decorator, Component, Node, Vec3, UITransform, Sprite, v3, Color, UIOpacity, tween } from 'cc';
import { GAME_CONFIG } from '../../data/constants';

const { ccclass, property } = _decorator;

@ccclass('SlotController')
export class SlotController extends Component {
  @property
  public slotId = '';

  @property([String])
  public allowedItemTypes: string[] = [];

  private readonly itemIds: string[] = [];
  private highlightNode: Node | null = null;
  private highlightOpacity: UIOpacity | null = null;
  private highlightSprite: Sprite | null = null;

  onLoad(): void {
    this.createHighlightNode();
  }

  public setAllowedItemTypes(types: string[]): void {
    this.allowedItemTypes = [...types];
  }

  private createHighlightNode(): void {
    if (this.highlightNode) {
      return;
    }

    this.highlightNode = new Node();
    this.highlightNode.name = 'Highlight';
    this.highlightNode.setParent(this.node);
    this.highlightNode.setPosition(v3(0, 0, 0));
    this.highlightNode.setSiblingIndex(this.node.children.length);

    const slotTransform = this.node.getComponent(UITransform) as UITransform | null;
    const highlightTransform = this.highlightNode.addComponent(UITransform) as UITransform;
    if (slotTransform) {
      highlightTransform.contentSize = slotTransform.contentSize;
      highlightTransform.anchorX = slotTransform.anchorX;
      highlightTransform.anchorY = slotTransform.anchorY;
    }

    const sprite = this.highlightNode.addComponent(Sprite) as Sprite;
    sprite.color = new Color(255, 235, 140, 255);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    this.highlightSprite = sprite;

    const opacity = this.highlightNode.addComponent(UIOpacity);
    opacity.opacity = 0;
    this.highlightOpacity = opacity;
    this.highlightNode.active = false;
  }

  public canAcceptItem(itemType: string): boolean {
    if (this.allowedItemTypes.length === 0) {
      return true;
    }
    return this.allowedItemTypes.includes(itemType);
  }

  public containsItem(itemNode: Node): boolean {
    if (!itemNode.isValid) {
      return false;
    }

    const slotTransform = this.node.getComponent(UITransform) as UITransform | null;
    if (!slotTransform) {
      return false;
    }

    const itemTransform = itemNode.getComponent(UITransform) as UITransform | null;
    const slotPos = this.node.worldPosition;
    const itemPos = itemNode.worldPosition;
    const slotSize = slotTransform.contentSize;
    const itemSize = itemTransform?.contentSize;

    const thresholdX = (slotSize.width + (itemSize?.width ?? 0)) / 2;
    const thresholdY = (slotSize.height + (itemSize?.height ?? 0)) / 2;

    return Math.abs(itemPos.x - slotPos.x) <= thresholdX && Math.abs(itemPos.y - slotPos.y) <= thresholdY;
  }

  public showHighlight(): void {
    if (!this.highlightNode || !this.highlightSprite || !this.highlightOpacity) {
      return;
    }

    this.highlightNode.active = true;
    this.highlightNode.setScale(0.96, 0.96, 1);
    this.highlightSprite.color = new Color(255, 235, 140, 255);
    tween(this.highlightOpacity).stop();
    tween(this.highlightNode).stop();
    tween(this.highlightOpacity).to(0.12, { opacity: 170 }).start();
    tween(this.highlightNode).to(0.12, { scale: v3(1.03, 1.03, 1) }).start();
  }

  public hideHighlight(): void {
    if (!this.highlightNode || !this.highlightOpacity) {
      return;
    }

    tween(this.highlightOpacity).stop();
    tween(this.highlightNode).stop();
    tween(this.highlightOpacity)
      .to(0.1, { opacity: 0 })
      .call(() => {
        if (this.highlightNode) {
          this.highlightNode.active = false;
        }
      })
      .start();
  }

  public addItem(itemId: string): boolean {
    if (this.itemIds.includes(itemId)) {
      return false;
    }

    if (this.itemIds.length >= GAME_CONFIG.level.maxStarsPerLevel) {
      return false;
    }

    this.itemIds.push(itemId);
    return true;
  }

  public removeItem(itemId: string): boolean {
    const index = this.itemIds.indexOf(itemId);
    if (index !== -1) {
      this.itemIds.splice(index, 1);
      return true;
    }
    return false;
  }

  public getItems(): string[] {
    return [...this.itemIds];
  }

  public clear(): void {
    this.itemIds.length = 0;
  }

  public getWorldPosition(): Vec3 {
    const pos = this.node.worldPosition;
    return v3(pos.x, pos.y, pos.z);
  }

  public isFull(): boolean {
    return this.itemIds.length >= GAME_CONFIG.level.maxStarsPerLevel;
  }

  public isEmpty(): boolean {
    return this.itemIds.length === 0;
  }
}
