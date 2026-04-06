import { _decorator, Component, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 星级评价组件
 */
@ccclass('StarRating')
export class StarRating extends Component {
    @property([Sprite])
    stars: Sprite[] = [];

    @property()
    maxStars: number = 3;

    private _currentStars: number = 0;

    onLoad() {
        // TODO: 初始化星星UI
    }

    /**
     * 设置星级
     */
    setStars(stars: number): void {
        this._currentStars = Math.min(stars, this.maxStars);
        // TODO: 更新星星显示
        // TODO: 逐个点亮星星动画
    }

    /**
     * 播放星级动画
     */
    playStarAnimation(): void {
        // TODO: 播放星星逐个点亮动画
    }
}
