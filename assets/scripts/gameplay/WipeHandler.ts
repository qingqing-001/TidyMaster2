import { _decorator, Component, EventTouch, Node, Vec3, Sprite, tween, easing, v3, director, UITransform, UIOpacity } from 'cc';
import { EventManager } from '../core/EventManager';
import { AudioManager } from '../audio/AudioManager';
import { ParticleEffects } from '../effects/ParticleEffects';

const { ccclass, property } = _decorator;

/**
 * 擦洗操作处理器
 * 处理手指滑动去污渍的交互
 */
@ccclass('WipeHandler')
export class WipeHandler extends Component {
    @property(Node)
    wipeTarget: Node = null!;

    @property(Sprite)
    stainSprite: Sprite = null!;

    @property(Number)
    wipeThreshold: number = 80;

    @property(Number)
    wipeSpeed: number = 0.5;

    private _isWiping: boolean = false;
    private _wipeProgress: number = 0;
    private _lastTouchPos: Vec3 = v3(0, 0, 0);
    private _touchStartPos: Vec3 = v3(0, 0, 0);
    private _totalDistance: number = 0;
    private _requiredDistance: number = 200;
    private _stainOpacity: UIOpacity | null = null;
    private _audioManager: AudioManager | null = null;
    private _eventManager: EventManager | null = null;

    onLoad() {
        this._audioManager = AudioManager.getInstance();
        this._eventManager = EventManager.getInstance();
        this._initTouchEvents();
    }

    start() {
        this._initStainVisual();
    }

    /**
     * 初始化触摸事件
     */
    private _initTouchEvents(): void {
        if (!this.wipeTarget) return;
        
        this.wipeTarget.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.wipeTarget.on(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.wipeTarget.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.wipeTarget.on(Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    }

    /**
     * 初始化污渍视觉
     */
    private _initStainVisual(): void {
        if (this.stainSprite && this.stainSprite.node) {
            this._stainOpacity = this.stainSprite.node.getComponent(UIOpacity);
            if (!this._stainOpacity) {
                this._stainOpacity = this.stainSprite.node.addComponent(UIOpacity);
            }
            // 初始完全不透明
            if (this._stainOpacity) {
                this._stainOpacity.opacity = 255;
            }
        }
    }

    /**
     * 获取触摸位置
     */
    private getTouchPositionInParent(event: EventTouch): Vec3 {
        const parent = this.wipeTarget.parent;
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
        if (!this.wipeTarget) return;

        event.propagationStopped = true;
        
        const touchPos = this.getTouchPositionInParent(event);
        
        this._isWiping = true;
        this._touchStartPos = v3(touchPos.x, touchPos.y, 0);
        this._lastTouchPos = v3(touchPos.x, touchPos.y, 0);
        this._totalDistance = 0;
        this.startWipe();
    }

    /**
     * 触摸移动
     */
    private _onTouchMove(event: EventTouch): void {
        if (!this._isWiping) return;

        const touchPos = this.getTouchPositionInParent(event);
        const dx = touchPos.x - this._lastTouchPos.x;
        const dy = touchPos.y - this._lastTouchPos.y;
        const moveDistance = Math.sqrt(dx * dx + dy * dy);
        
        this._totalDistance += moveDistance;
        this._lastTouchPos = v3(touchPos.x, touchPos.y, 0);
        
        // 更新进度
        const progress = (this._totalDistance / this._requiredDistance) * 100;
        this.updateWipeProgress(progress);
    }

    /**
     * 触摸结束
     */
    private _onTouchEnd(_event: EventTouch): void {
        if (!this._isWiping) return;
        
        this._isWiping = false;
        
        // 检查是否完成擦洗
        if (this._wipeProgress >= this.wipeThreshold) {
            this.onWipeComplete();
        } else {
            // 未完成，重置进度
            this._resetWipe();
        }
    }

    /**
     * 开始擦洗
     */
    startWipe(): void {
        this._isWiping = true;
        // 播放擦洗循环音效
        this._playWipeSound();
    }

    /**
     * 更新擦洗进度
     */
    updateWipeProgress(deltaProgress: number): void {
        this._wipeProgress = Math.min(deltaProgress, 100);
        
        // 更新污渍透明度
        if (this._stainOpacity) {
            const opacity = 255 * (1 - this._wipeProgress / 100);
            this._stainOpacity.opacity = Math.floor(opacity);
        }
        
        // 持续播放擦洗音效
        if (Math.floor(this._totalDistance) % 50 < 10) {
            this._playWipeSound();
        }
    }

    /**
     * 擦洗完成
     */
    onWipeComplete(): void {
        this._isWiping = false;
        
        // 播放完成音效
        this._playCompleteSound();
        
        // 播放完成特效
        this._playCompleteEffect();
        
        // 隐藏污渍
        if (this.stainSprite && this.stainSprite.node) {
            tween(this.stainSprite.node)
                .to(0.3, { scale: v3(1.2, 1.2, 1) })
                .to(0.2, { scale: v3(0, 0, 1) })
                .call(() => {
                    if (this.stainSprite && this.stainSprite.node) {
                        this.stainSprite.node.active = false;
                    }
                })
                .start();
        }
        
        // 触发物品归位事件
        this._triggerItemComplete();
    }

    /**
     * 重置擦洗
     */
    private _resetWipe(): void {
        this._wipeProgress = 0;
        this._totalDistance = 0;
        
        if (this._stainOpacity) {
            this._stainOpacity.opacity = 255;
        }
    }

    /**
     * 播放擦洗音效
     */
    private _playWipeSound(): void {
        if (this._audioManager) {
            this._audioManager.playSFX('sfx_item_wipe');
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
            this._eventManager.emit('item-wiped', { 
                node: this.wipeTarget,
                progress: this._wipeProgress 
            });
        }
    }

    /**
     * 获取当前进度
     */
    getProgress(): number {
        return this._wipeProgress;
    }

    /**
     * 重置状态
     */
    reset(): void {
        this._isWiping = false;
        this._wipeProgress = 0;
        this._totalDistance = 0;
        
        if (this._stainOpacity) {
            this._stainOpacity.opacity = 255;
        }
        
        if (this.stainSprite && this.stainSprite.node) {
            this.stainSprite.node.active = true;
            this.stainSprite.node.setScale(v3(1, 1, 1));
        }
    }

    onDestroy() {
        if (this.wipeTarget) {
            this.wipeTarget.off(Node.EventType.TOUCH_START, this._onTouchStart, this);
            this.wipeTarget.off(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
            this.wipeTarget.off(Node.EventType.TOUCH_END, this._onTouchEnd, this);
            this.wipeTarget.off(Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
        }
    }
}