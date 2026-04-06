import { _decorator, Component, Node, Vec3, UITransform, Color, Sprite, v3 } from 'cc';
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
  private highlightOpacity = 0;

  onLoad(): void {
    this.createHighlightNode();
  }

  /**
   * 创建高亮提示节点
   */
  private createHighlightNode(): void {
    // 创建一个子节点用于高亮显示
    this.highlightNode = new Node();
    this.highlightNode.name = 'Highlight';
    this.highlightNode.setParent(this.node);

    const uiTransform = this.highlightNode.addComponent(UITransform);

    const sprite = this.highlightNode.addComponent(Sprite);
    // TODO: 设置高亮图片资源

    // 高亮初始隐藏
    this.highlightOpacity = 0;
  }

  /**
   * 判断槽位是否可以接受指定类型的物品
   */
  public canAcceptItem(itemType: string): boolean {
    if (this.allowedItemTypes.length === 0) {
      return true; // 如果没有限制，接受所有类型
    }
    return this.allowedItemTypes.includes(itemType);
  }

  /**
   * 检测物品是否在目标区域内
   */
  public containsItem(itemNode: Node): boolean {
    if (!itemNode.isValid) {
      return false;
    }

    const itemPos = itemNode.worldPosition;
    const slotPos = this.node.worldPosition;
    const uiTransform = this.node.getComponent(UITransform);
    const size = (uiTransform as any)?.contentSize;

    if (!size) {
      return false;
    }

    // 计算物品到槽位中心的距离
    const dx = itemPos.x - slotPos.x;
    const dy = itemPos.y - slotPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const threshold = Math.max(size.width, size.height) / 2;

    return distance < threshold;
  }

  /**
   * 显示高亮提示
   */
  public showHighlight(): void {
    if (this.highlightNode) {
      this.highlightOpacity = 150;
      // TODO: 实际实现中可以通过修改Sprite的color.alpha或其他方式
    }
  }

  /**
   * 隐藏高亮提示
   */
  public hideHighlight(): void {
    if (this.highlightNode) {
      this.highlightOpacity = 0;
      // TODO: 实际实现中可以通过修改Sprite的color.alpha或其他方式
    }
  }

  /**
   * 添加物品到槽位
   */
  public addItem(itemId: string): boolean {
    if (this.itemIds.length >= GAME_CONFIG.SLOT_CAPACITY) {
      return false;
    }

    this.itemIds.push(itemId);
    return true;
  }

  /**
   * 从槽位移除物品
   */
  public removeItem(itemId: string): boolean {
    const index = this.itemIds.indexOf(itemId);
    if (index !== -1) {
      this.itemIds.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 获取槽位中的所有物品ID
   */
  public getItems(): string[] {
    return [...this.itemIds];
  }

  /**
   * 清空槽位
   */
  public clear(): void {
    this.itemIds.length = 0;
  }

  /**
   * 获取槽位的世界坐标
   */
  public getWorldPosition(): Vec3 {
    const pos = this.node.worldPosition;
    return { x: pos.x, y: pos.y, z: pos.z };
  }

  /**
   * 判断槽位是否已满
   */
  public isFull(): boolean {
    return this.itemIds.length >= GAME_CONFIG.SLOT_CAPACITY;
  }

  /**
   * 判断槽位是否为空
   */
  public isEmpty(): boolean {
    return this.itemIds.length === 0;
  }
}
