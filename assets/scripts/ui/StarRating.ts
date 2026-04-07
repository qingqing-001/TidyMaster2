import { _decorator, Component, Sprite, SpriteFrame, tween, Node, Vec3, resources, Color } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 星级评价组件
 */
@ccclass('StarRating')
export class StarRating extends Component {
    @property({ type: [Sprite], tooltip: '星星精灵数组' })
    stars: Sprite[] = [];

    @property({ tooltip: '最大星星数量' })
    maxStars: number = 3;

    @property({ tooltip: '星星间距' })
    spacing: number = 10;

    @property({ tooltip: '每个星星动画延迟(秒)' })
    animationDelay: number = 0.2;

    @property({ tooltip: '动画持续时间(秒)' })
    animationDuration: number = 0.3;

    @property({ tooltip: '未点亮颜色' })
    emptyColor: Color = new Color(100, 100, 100, 255);

    @property({ tooltip: '点亮颜色' })
    filledColor: Color = new Color(255, 215, 0, 255);

    @property({ type: SpriteFrame, tooltip: '空星星精灵' })
    emptyStarFrame: SpriteFrame | null = null;

    @property({ type: SpriteFrame, tooltip: '满星星精灵' })
    filledStarFrame: SpriteFrame | null = null;

    private _currentStars: number = 0;
    private _isAnimating: boolean = false;
    private _starNodes: Node[] = [];

    onLoad() {
        this.initStars();
    }

    /**
     * 初始化星星
     */
    private initStars(): void {
        // 如果没有在编辑器中配置星星，则动态创建
        if (this.stars.length === 0) {
            this.createStarNodes();
        }

        // 设置初始状态
        this.updateStarDisplay(0, false);
    }

    /**
     * 动态创建星星节点
     */
    private createStarNodes(): void {
        // 清除旧的节点
        this._starNodes.forEach(node => {
            if (node && node.isValid) {
                node.destroy();
            }
        });
        this._starNodes = [];

        // 创建新节点
        for (let i = 0; i < this.maxStars; i++) {
            const starNode = new Node('Star_' + i);
            starNode.setParent(this.node);
            
            // 计算位置
            const x = i * (this.spacing + 50); // 假设星星默认大小50
            starNode.setPosition(new Vec3(x, 0, 0));

            // 添加Sprite组件
            const sprite = starNode.addComponent(Sprite);
            this.stars.push(sprite);
            this._starNodes.push(starNode);
        }
    }

    /**
     * 更新星星显示
     * @param count 点亮的星星数量
     * @param animate 是否播放动画
     */
    setStars(count: number, animate: boolean = true): void {
        this._currentStars = Math.max(0, Math.min(count, this.maxStars));
        
        if (animate) {
            this.playStarAnimation();
        } else {
            this.updateStarDisplay(this._currentStars, false);
        }
    }

    /**
     * 更新星星显示状态
     */
    private updateStarDisplay(count: number, animated: boolean): void {
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            if (!star || !star.node) continue;

            const isFilled = i < count;

            if (isFilled) {
                // 点亮星星
                if (this.filledStarFrame) {
                    star.spriteFrame = this.filledStarFrame;
                }
                star.color = this.filledColor;
            } else {
                // 熄灭星星
                if (this.emptyStarFrame) {
                    star.spriteFrame = this.emptyStarFrame;
                }
                star.color = this.emptyColor;
            }
        }
    }

    /**
     * 播放星级动画
     * 星星逐个点亮，带有缩放和弹性效果
     */
    playStarAnimation(): void {
        if (this._isAnimating) {
            return;
        }

        this._isAnimating = true;

        // 先重置所有星星状态
        this.updateStarDisplay(0, false);

        // 逐个播放星星点亮动画
        for (let i = 0; i < this._currentStars; i++) {
            const star = this.stars[i];
            if (!star || !star.node) continue;

            // 延迟播放每个星星的动画
            const delay = i * this.animationDelay;

            // 延迟后执行动画
            setTimeout(() => {
                this.animateStar(star.node, true, () => {
                    // 最后一个星星动画完成后
                    if (i === this._currentStars - 1) {
                        this._isAnimating = false;
                        // 触发完成回调
                        this.onAnimationComplete();
                    }
                });
            }, delay * 1000);
        }
    }

    /**
     * 动画单个星星
     */
    private animateStar(node: Node, isFilled: boolean, onComplete?: () => void): void {
        // 设置精灵和颜色
        const sprite = node.getComponent(Sprite);
        if (sprite) {
            if (isFilled && this.filledStarFrame) {
                sprite.spriteFrame = this.filledStarFrame;
            } else if (!isFilled && this.emptyStarFrame) {
                sprite.spriteFrame = this.emptyStarFrame;
            }
            sprite.color = isFilled ? this.filledColor : this.emptyColor;
        }

        // 缩放动画: 小 -> 大 -> 正常
        const originalScale = node.scale.clone();
        const bigScale = new Vec3(
            originalScale.x * 1.3,
            originalScale.y * 1.3,
            originalScale.z * 1.3
        );

        // 第一阶段：放大
        tween(node)
            .to(this.animationDuration / 2, { scale: bigScale }, { easing: 'backOut' })
            // 第二阶段：恢复正常大小
            .to(this.animationDuration / 2, { scale: originalScale }, { easing: 'backIn' })
            .call(() => {
                if (onComplete) {
                    onComplete();
                }
            })
            .start();
    }

    /**
     * 动画完成回调
     */
    private onAnimationComplete(): void {
        console.log('[StarRating] 动画完成，当前星级:', this._currentStars);
    }

    /**
     * 播放星星消失动画（用于重新评分）
     */
    playResetAnimation(callback?: () => void): void {
        if (this._isAnimating) {
            return;
        }

        this._isAnimating = true;

        // 从当前星级逐个消失
        for (let i = this._currentStars - 1; i >= 0; i--) {
            const star = this.stars[i];
            if (!star || !star.node) continue;

            const delay = (this._currentStars - 1 - i) * this.animationDelay;

            setTimeout(() => {
                this.animateStar(star.node, false, () => {
                    if (i === 0 && callback) {
                        this._isAnimating = false;
                        callback();
                    }
                });
            }, delay * 1000);
        }

        // 重置当前星级
        this._currentStars = 0;
    }

    /**
     * 设置星星精灵
     */
    setStarSprites(empty: SpriteFrame, filled: SpriteFrame): void {
        this.emptyStarFrame = empty;
        this.filledStarFrame = filled;
        
        // 立即更新显示
        this.updateStarDisplay(this._currentStars, false);
    }

    /**
     * 获取当前星级
     */
    getStars(): number {
        return this._currentStars;
    }

    /**
     * 是否正在动画中
     */
    isAnimating(): boolean {
        return this._isAnimating;
    }

    /**
     * 重置星星
     */
    reset(): void {
        this._currentStars = 0;
        this._isAnimating = false;
        this.updateStarDisplay(0, false);
    }

    /**
     * 添加星星（用于连续评分）
     */
    addStar(): void {
        if (this._currentStars < this.maxStars) {
            this.setStars(this._currentStars + 1, true);
        }
    }

    /**
     * 移除星星
     */
    removeStar(): void {
        if (this._currentStars > 0) {
            // 播放消失动画后再更新
            const star = this.stars[this._currentStars - 1];
            if (star && star.node) {
                this.animateStar(star.node, false, () => {
                    this._currentStars--;
                });
            }
        }
    }
}