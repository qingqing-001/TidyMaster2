import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 合成面板
 * 3x4格子的合成棋盘
 */
@ccclass('MergeBoard')
export class MergeBoard extends Component {
    @property() readonly BOARD_WIDTH: number = 3;
    @property() readonly BOARD_HEIGHT: number = 4;

    private _slots: Node[][] = [];

    onLoad() {
        // TODO: 初始化合成格子
        // TODO: 创建3x12个格子节点
    }

    /**
     * 尝试合并两个工具
     */
    tryMerge(fromX: number, fromY: number, toX: number, toY: number): boolean {
        // TODO: 检查两个位置是否有相同等级的工具
        // TODO: 合并升级到下一等级
        // TODO: 播放合成音效和特效
        return true;
    }

    /**
     * 获取空格子
     */
    getEmptySlot(): { x: number, y: number } | null {
        // TODO: 查找第一个空格子
        return null;
    }

    /**
     * 添加新工具
     */
    addTool(toolLevel: number): void {
        // TODO: 在空格子中放置工具
    }
}
