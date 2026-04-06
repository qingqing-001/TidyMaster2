import { _decorator, Component, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 工具物品
 * 合成系统中的可拖拽工具
 */
@ccclass('ToolItem')
export class ToolItem extends Component {
    @property(Sprite)
    toolSprite: Sprite = null!;

    @property() toolLevel: number = 1;

    @property() readonly MAX_LEVEL: number = 7;

    onLoad() {
        // TODO: 根据等级加载对应的工具图标
        // TODO: 初始化拖拽交互
    }

    /**
     * 升级工具
     */
    upgrade(): boolean {
        if (this.toolLevel >= this.MAX_LEVEL) {
            return false;
        }
        this.toolLevel++;
        // TODO: 更新工具图标
        // TODO: 播放升级特效
        return true;
    }

    /**
     * 是否可以合并
     */
    canMergeWith(other: ToolItem): boolean {
        return other && other.toolLevel === this.toolLevel;
    }
}
