import { _decorator, Component, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 加载进度条组件
 */
@ccclass('LoadingBar')
export class LoadingBar extends Component {
    @property(Sprite)
    barSprite: Sprite = null!;

    @property()
    total: number = 100;

    private _current: number = 0;

    onLoad() {
        // TODO: 初始化进度条UI
    }

    /**
     * 设置总进度
     */
    setTotal(total: number): void {
        this.total = total;
    }

    /**
     * 更新进度
     */
    updateProgress(current: number): void {
        this._current = current;
        const progress = Math.min(this._current / this.total, 1);
        // TODO: 更新进度条显示
    }

    /**
     * 重置进度
     */
    reset(): void {
        this._current = 0;
        this.updateProgress(0);
    }
}
