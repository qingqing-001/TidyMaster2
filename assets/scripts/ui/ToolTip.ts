import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 工具提示组件
 * 用于新手引导
 */
@ccclass('ToolTip')
export class ToolTip extends Component {
    @property(Node)
    targetNode: Node = null!;

    @property(Label)
    textLabel: Label = null!;

    private _arrowDirection: string = 'up';

    onLoad() {
        // TODO: 初始化提示UI
    }

    /**
     * 显示提示
     */
    show(text: string, target: Node, direction: string = 'up'): void {
        this._arrowDirection = direction;
        this.textLabel.string = text;
        this.targetNode = target;
        // TODO: 显示提示框
        // TODO: 定位到目标节点
    }

    /**
     * 隐藏提示
     */
    hide(): void {
        // TODO: 隐藏提示框
    }
}
