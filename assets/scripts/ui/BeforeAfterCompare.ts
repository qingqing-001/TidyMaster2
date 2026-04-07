import { _decorator, Component, Sprite, SpriteFrame, tween, Node, Vec3, resources } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 前后对比组件
 * 显示关卡完成时的整理前后对比
 */
@ccclass('BeforeAfterCompare')
export class BeforeAfterCompare extends Component {
    @property(Sprite)
    beforeImage: Sprite = null!;

    @property(Sprite)
    afterImage: Sprite = null!;

    @property(Sprite)
    compareImage: Sprite = null!;

    @property(Node)
    sliderHandle: Node = null!;

    @property({ tooltip: '对比图宽度' })
    compareWidth: number = 400;

    @property({ tooltip: '对比图高度' })
    compareHeight: number = 300;

    @property({ tooltip: '滑动阈值灵敏度' })
    sensitivity: number = 0.01;

    private _currentProgress: number = 0.5;
    private _isDragging: boolean = false;
    private _beforeFrame: SpriteFrame | null = null;
    private _afterFrame: SpriteFrame | null = null;

    onLoad() {
        this.initSliderEvents();
    }

    /**
     * 初始化滑动事件
     */
    private initSliderEvents(): void {
        if (!this.sliderHandle || !this.compareImage) return;

        // 监听滑块拖动
        this.sliderHandle.on('touchmove', this.onSliderMove, this);
        this.sliderHandle.on('touchstart', this.onSliderStart, this);
        this.sliderHandle.on('touchend', this.onSliderEnd, this);
    }

    /**
     * 滑块开始拖动
     */
    private onSliderStart(): void {
        this._isDragging = true;
    }

    /**
     * 滑块结束拖动
     */
    private onSliderEnd(): void {
        this._isDragging = false;
    }

    /**
     * 滑块移动
     */
    private onSliderMove(event: any): void {
        if (!this.compareImage || !this.compareImage.node) return;

        const node = this.compareImage.node;
        const pos = event.getUILocation();

        // 简单计算进度
        const parent = node.parent;
        if (parent) {
            const parentWidth = this.compareWidth;
            const localX = pos.x - parent.position.x - node.position.x;
            
            // 计算进度 (0-1)
            const progress = (localX + parentWidth / 2) / parentWidth;
            this._currentProgress = Math.max(0, Math.min(1, progress));

            // 更新滑块位置
            if (this.sliderHandle) {
                this.sliderHandle.setPosition(new Vec3(
                    (this._currentProgress - 0.5) * this.compareWidth,
                    0,
                    0
                ));
            }

            // 更新遮罩显示
            this.updateMask(this._currentProgress);
        }
    }

    /**
     * 更新遮罩显示
     */
    private updateMask(progress: number): void {
        // 简单实现：隐藏before/after其中一个
        if (this.beforeImage) {
            this.beforeImage.node.active = progress > 0.5;
        }
        if (this.afterImage) {
            this.afterImage.node.active = progress <= 0.5;
        }
    }

    /**
     * 设置对比图
     * @param beforeUrl 整理前图片路径 (resources路径)
     * @param afterUrl 整理后图片路径 (resources路径)
     */
    setImages(beforeUrl: string, afterUrl: string): void {
        // 加载整理前图片
        resources.load(beforeUrl, SpriteFrame, (err, asset) => {
            if (err || !asset) {
                console.error('[BeforeAfterCompare] 加载整理前图片失败:', err);
                return;
            }
            this._beforeFrame = asset as SpriteFrame;
            if (this.beforeImage) {
                this.beforeImage.spriteFrame = asset as SpriteFrame;
            }
        });

        // 加载整理后图片
        resources.load(afterUrl, SpriteFrame, (err, asset) => {
            if (err || !asset) {
                console.error('[BeforeAfterCompare] 加载整理后图片失败:', err);
                return;
            }
            this._afterFrame = asset as SpriteFrame;
            if (this.afterImage) {
                this.afterImage.spriteFrame = asset as SpriteFrame;
            }
        });

        console.log('[BeforeAfterCompare] 加载图片:', beforeUrl, afterUrl);
    }

    /**
     * 生成对比图
     * @param beforeData 整理前数据
     * @param afterData 整理后数据
     */
    generateCompareImage(beforeData: any, afterData: any): void {
        // 生成对比图数据
        console.log('[BeforeAfterCompare] 生成对比图:', beforeData, afterData);

        // 根据数据生成缩略图
        // 实际项目中可能需要使用RenderTexture将场景渲染为图片
        if (beforeData && beforeData.screenshot) {
            this.setImages(beforeData.screenshot, afterData.screenshot);
        }

        // 播放切换动画
        this.playCompareAnimation();
    }

    /**
     * 播放对比图切换动画
     */
    private playCompareAnimation(): void {
        // 滑块从左到右移动的动画
        if (!this.sliderHandle) return;

        const startPos = new Vec3(-this.compareWidth / 2, 0, 0);
        const endPos = new Vec3(this.compareWidth / 2, 0, 0);

        tween(this.sliderHandle)
            .to(1.5, { position: endPos }, { easing: 'backOut' })
            .call(() => {
                // 动画完成后重置
                this.sliderHandle.setPosition(startPos);
            })
            .start();
    }

    /**
     * 设置滑动进度
     */
    setProgress(progress: number): void {
        this._currentProgress = Math.max(0, Math.min(1, progress));
        
        // 更新滑块位置
        if (this.sliderHandle) {
            this.sliderHandle.setPosition(new Vec3(
                (this._currentProgress - 0.5) * this.compareWidth,
                0,
                0
            ));
        }

        this.updateMask(this._currentProgress);
    }

    /**
     * 获取当前进度
     */
    getProgress(): number {
        return this._currentProgress;
    }

    /**
     * 重置对比图
     */
    reset(): void {
        this._currentProgress = 0.5;
        this._beforeFrame = null;
        this._afterFrame = null;

        if (this.beforeImage) {
            this.beforeImage.spriteFrame = null;
        }
        if (this.afterImage) {
            this.afterImage.spriteFrame = null;
        }

        // 重置滑块位置
        if (this.sliderHandle) {
            this.sliderHandle.setPosition(new Vec3(0, 0, 0));
        }
    }
}