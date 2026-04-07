import { _decorator, Component, EventTouch, Node, Vec3, Sprite, tween, easing, v3, director, UITransform, UIOpacity, Graphics, Color } from 'cc';
import { EventManager } from '../core/EventManager';
import { AudioManager } from '../audio/AudioManager';
import { ParticleEffects } from '../effects/ParticleEffects';

const { ccclass, property } = _decorator;

/**
 * 折叠操作处理器
 * 处理按顺序点击折线折叠物品的交互
 */
@ccclass('FoldHandler')
export class FoldHandler extends Component {
    @property(Node)
    foldItem: Node = null!;

    @property(Graphics)
    foldLineGraphics: Graphics = null!;

    @property(Number)
    totalFoldSteps: number = 3;

    @property(Number)
    foldTime: number = 0.3;

    @property([Node])
    foldPoints: Node[] = [];

    private _currentFoldStep: number = 0;
    private _isAnimating: boolean = false;
    private _completedSteps: Set<number> = new Set();
    private _foldItemOpacity: UIOpacity | null = null;
    private _audioManager: AudioManager | null = null;
    private _eventManager: EventManager | null = null;
    private _foldTimeoutId: ReturnType<typeof setTimeout> | null = null;

    onLoad() {
        this._audioManager = AudioManager.getInstance();
        this._eventManager = EventManager.getInstance();
        this._initFoldLines();
        this._initTouchEvents();
    }

    start() {
        this._initFoldVisual();
    }

    /**
     * 初始化折线显示
     */
    private _initFoldLines(): void {
        if (!this.foldLineGraphics) {
            // 创建 Graphics 节点
            const graphicsNode = new Node('FoldLines');
            this.node.addChild(graphicsNode);
            this.foldLineGraphics = graphicsNode.addComponent(Graphics);
        }
    }

    /**
     * 初始化触摸事件
     */
    private _initTouchEvents(): void {
        if (!this.foldItem) return;
        
        this.foldItem.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
    }

    /**
     * 初始化折叠视觉
     */
    private _initFoldVisual(): void {
        if (this.foldItem) {
            this._foldItemOpacity = this.foldItem.getComponent(UIOpacity);
            if (!this._foldItemOpacity) {
                this._foldItemOpacity = this.foldItem.addComponent(UIOpacity);
            }
        }
        
        // 绘制折线提示
        this._drawFoldLines();
    }

    /**
     * 绘制折线提示
     */
    private _drawFoldLines(): void {
        if (!this.foldLineGraphics) return;
        
        const graphics = this.foldLineGraphics;
        graphics.clear();
        
        // 自动生成折线点
        const uiTransform = this.foldItem ? this.foldItem.getComponent(UITransform) : null;
        const itemWidth = uiTransform ? uiTransform.contentSize.width : 100;
        const itemHeight = uiTransform ? uiTransform.contentSize.height : 100;
        const centerX = 0;
        const centerY = 0;
        
        // 水平折叠线
        const horizontalY = centerY;
        const verticalX = centerX;
        
        // 第一步：水平中线
        if (this._currentFoldStep === 0 && !this._completedSteps.has(0)) {
            this._drawFoldLine(
                centerX - itemWidth / 2,
                horizontalY,
                centerX + itemWidth / 2,
                horizontalY,
                0
            );
        }
        
        // 第二步：垂直中线
        if (this._currentFoldStep === 1 && !this._completedSteps.has(1)) {
            this._drawFoldLine(
                verticalX,
                centerY - itemHeight / 2,
                verticalX,
                centerY + itemHeight / 2,
                1
            );
        }
        
        // 第三步：对角线
        if (this._currentFoldStep === 2 && !this._completedSteps.has(2)) {
            this._drawFoldLine(
                centerX - itemWidth / 2,
                centerY - itemHeight / 2,
                centerX + itemWidth / 2,
                centerY + itemHeight / 2,
                2
            );
        }
    }

    /**
     * 绘制单条折线
     */
    private _drawFoldLine(x1: number, y1: number, x2: number, y2: number, step: number): void {
        if (!this.foldLineGraphics) return;
        
        const graphics = this.foldLineGraphics;
        
        // 虚线效果
        const dashLength = 10;
        const gapLength = 5;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        graphics.lineWidth = 3;
        graphics.strokeColor = new Color(255, 200, 0, 255);
        
        let currentLength = 0;
        while (currentLength < length) {
            const startX = x1 + Math.cos(angle) * currentLength;
            const startY = y1 + Math.sin(angle) * currentLength;
            const endX = x1 + Math.cos(angle) * Math.min(currentLength + dashLength, length);
            const endY = y1 + Math.sin(angle) * Math.min(currentLength + dashLength, length);
            
            graphics.moveTo(startX, startY);
            graphics.lineTo(endX, endY);
            graphics.stroke();
            
            currentLength += dashLength + gapLength;
        }
        
        // 绘制目标点击区域（圆形高亮）
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        
        // 外圈动画效果 - 使用 arc 方法
        graphics.arc(midX, midY, 25, 0, Math.PI * 2);
        graphics.strokeColor = new Color(255, 200, 0, 150);
        graphics.lineWidth = 2;
        graphics.stroke();
    }

    /**
     * 获取触摸位置
     */
    private getTouchPositionInParent(event: EventTouch): Vec3 {
        const parent = this.foldItem.parent;
        const uiPos = event.getUILocation();

        if (!parent) {
            return v3(uiPos.x, uiPos.y, 0);
        }

        const parentWorldPos = parent.worldPosition;
        const parentTransform = parent.getComponent(UITransform) as UITransform | null;

        if (!parentTransform) {
            return v3(uiPos.x - parentWorldPos.x, uiPos.y - parentWorldPos.y, 0);
        }

        const localX = uiPos.x - parentWorldPos.x - parentTransform.contentSize.width * (0.5 - parentTransform.anchorX);
        const localY = uiPos.y - parentWorldPos.y - parentTransform.contentSize.height * (0.5 - parentTransform.anchorY);
        return v3(localX, localY, 0);
    }

    /**
     * 触摸开始
     */
    private _onTouchStart(event: EventTouch): void {
        if (this._isAnimating) return;
        if (!this.foldItem) return;

        event.propagationStopped = true;
        
        // 触发当前步骤折叠
        this.onFoldLineClick(this._currentFoldStep);
    }

    /**
     * 点击折线
     */
    onFoldLineClick(step: number): void {
        if (step !== this._currentFoldStep) {
            // 点击的不是当前步骤，播放错误反馈
            this._playErrorFeedback();
            return;
        }

        if (this._completedSteps.has(step)) {
            return;
        }

        // 执行折叠动画
        this._executeFold(step);
    }

    /**
     * 执行折叠动画
     */
    private _executeFold(step: number): void {
        this._isAnimating = true;
        this._completedSteps.add(step);
        
        // 播放折叠音效
        this._playFoldSound();
        
        // 根据步骤执行不同的折叠动画
        switch (step) {
            case 0:
                this._foldHorizontal();
                break;
            case 1:
                this._foldVertical();
                break;
            case 2:
                this._foldDiagonal();
                break;
            default:
                this._foldHorizontal();
                break;
        }
        
        // 更新下一步
        this._currentFoldStep++;
        
        // 延迟后重新绘制折线
        this._foldTimeoutId = setTimeout(() => {
            this._drawFoldLines();
        }, this.foldTime * 1000);
        
        // 检查是否完成全部折叠
        if (this._currentFoldStep >= this.totalFoldSteps) {
            this._foldTimeoutId = setTimeout(() => {
                this.onFoldComplete();
            }, this.foldTime * 1000 + 100);
        }
        
        this._isAnimating = false;
    }

    /**
     * 水平折叠
     */
    private _foldHorizontal(): void {
        if (!this.foldItem) return;
        
        const originalScale = this.foldItem.scale.clone();
        
        tween(this.foldItem)
            .to(this.foldTime, { scale: v3(originalScale.x * 0.5, originalScale.y, originalScale.z) }, { easing: easing.backOut })
            .start();
    }

    /**
     * 垂直折叠
     */
    private _foldVertical(): void {
        if (!this.foldItem) return;
        
        const originalScale = this.foldItem.scale.clone();
        
        tween(this.foldItem)
            .to(this.foldTime, { scale: v3(originalScale.x, originalScale.y * 0.5, originalScale.z) }, { easing: easing.backOut })
            .start();
    }

    /**
     * 对角线折叠
     */
    private _foldDiagonal(): void {
        if (!this.foldItem) return;
        
        const originalScale = this.foldItem.scale.clone();
        
        tween(this.foldItem)
            .to(this.foldTime, { scale: v3(originalScale.x * 0.5, originalScale.y * 0.5, originalScale.z) }, { easing: easing.backOut })
            .start();
    }

    /**
     * 折叠完成
     */
    onFoldComplete(): void {
        // 播放完成音效
        this._playCompleteSound();
        
        // 播放完成特效
        this._playCompleteEffect();
        
        // 隐藏折线
        if (this.foldLineGraphics) {
            this.foldLineGraphics.clear();
        }
        
        // 触发物品归位事件
        this._triggerItemComplete();
    }

    /**
     * 播放折叠音效
     */
    private _playFoldSound(): void {
        if (this._audioManager) {
            this._audioManager.playSFX('sfx_item_fold');
        }
    }

    /**
     * 播放完成音效
     */
    private _playCompleteSound(): void {
        if (this._audioManager) {
            this._audioManager.playSFX('sfx_success');
        }
    }

    /**
     * 播放错误反馈
     */
    private _playErrorFeedback(): void {
        if (this._audioManager) {
            this._audioManager.playSFX('sfx_item_wrong');
        }
        
        // 抖动效果
        if (this.foldItem) {
            const originalPos = this.foldItem.position.clone();
            tween(this.foldItem)
                .to(0.05, { position: v3(originalPos.x + 10, originalPos.y, originalPos.z) })
                .to(0.05, { position: v3(originalPos.x - 10, originalPos.y, originalPos.z) })
                .to(0.05, { position: v3(originalPos.x + 5, originalPos.y, originalPos.z) })
                .to(0.05, { position: originalPos })
                .start();
        }
    }

    /**
     * 播放完成特效
     */
    private _playCompleteEffect(): void {
        if (this.node) {
            ParticleEffects.showSuccessParticles(this.node.worldPosition);
        }
    }

    /**
     * 触发物品完成事件
     */
    private _triggerItemComplete(): void {
        if (this._eventManager) {
            this._eventManager.emit('item-folded', { 
                node: this.foldItem,
                steps: this.totalFoldSteps 
            });
        }
    }

    /**
     * 获取当前步骤
     */
    getCurrentStep(): number {
        return this._currentFoldStep;
    }

    /**
     * 获取总步骤数
     */
    getTotalSteps(): number {
        return this.totalFoldSteps;
    }

    /**
     * 是否完成
     */
    isCompleted(): boolean {
        return this._currentFoldStep >= this.totalFoldSteps;
    }

    /**
     * 重置状态
     */
    reset(): void {
        // 清除超时
        if (this._foldTimeoutId) {
            clearTimeout(this._foldTimeoutId);
            this._foldTimeoutId = null;
        }
        
        this._currentFoldStep = 0;
        this._isAnimating = false;
        this._completedSteps.clear();
        
        if (this.foldItem) {
            this.foldItem.setScale(v3(1, 1, 1));
        }
        
        // 重新绘制折线
        this._drawFoldLines();
    }

    onDestroy() {
        // 清除超时
        if (this._foldTimeoutId) {
            clearTimeout(this._foldTimeoutId);
            this._foldTimeoutId = null;
        }
        
        if (this.foldItem) {
            this.foldItem.off(Node.EventType.TOUCH_START, this._onTouchStart, this);
        }
    }
}