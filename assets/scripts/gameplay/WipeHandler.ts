import { _decorator, Component, EventTouch, Node, Vec3, Sprite, tween, v3, UITransform, UIOpacity } from 'cc';
import { EventManager } from '../core/EventManager';
import { AudioManager } from '../audio/AudioManager';
import { ParticleEffects } from '../effects/ParticleEffects';
import { GAME_EVENTS } from '../../data/constants';

const { ccclass, property } = _decorator;

interface WipeMetadata {
    levelId?: number;
    itemId?: string;
    slotId?: string;
    operation?: string;
    targetLabel?: string;
    requiredDistance?: number;
    wipeThreshold?: number;
    wipeSpeed?: number;
}

@ccclass('WipeHandler')
export class WipeHandler extends Component {
    @property(Node)
    wipeTarget: Node = null!;

    @property(Sprite)
    stainSprite: Sprite = null!;

    @property(Number)
    wipeThreshold = 80;

    @property(Number)
    wipeSpeed = 0.5;

    private _isWiping = false;
    private _wipeProgress = 0;
    private _lastTouchPos: Vec3 = v3(0, 0, 0);
    private _totalDistance = 0;
    private _requiredDistance = 200;
    private _stainOpacity: UIOpacity | null = null;
    private _audioManager: AudioManager | null = null;
    private _eventManager: EventManager | null = null;
    private _metadata: WipeMetadata = {};
    private _completed = false;

    onLoad() {
        this._audioManager = AudioManager.getInstance();
        this._eventManager = EventManager.getInstance();
        this._initTouchEvents();
    }

    start() {
        this._initStainVisual();
    }

    public setWipeMetadata(metadata: WipeMetadata): void {
        this._metadata = { ...metadata };
        if (typeof metadata.requiredDistance === 'number' && metadata.requiredDistance > 0) {
            this._requiredDistance = metadata.requiredDistance;
        }
        if (typeof metadata.wipeThreshold === 'number' && metadata.wipeThreshold > 0) {
            this.wipeThreshold = metadata.wipeThreshold;
        }
        if (typeof metadata.wipeSpeed === 'number' && metadata.wipeSpeed > 0) {
            this.wipeSpeed = metadata.wipeSpeed;
        }
    }

    private _initTouchEvents(): void {
        if (!this.wipeTarget) return;
        this.wipeTarget.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.wipeTarget.on(Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.wipeTarget.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.wipeTarget.on(Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    }

    private _initStainVisual(): void {
        if (this.stainSprite && this.stainSprite.node) {
            this._stainOpacity = this.stainSprite.node.getComponent(UIOpacity);
            if (!this._stainOpacity) {
                this._stainOpacity = this.stainSprite.node.addComponent(UIOpacity);
            }
            this._stainOpacity.opacity = 255;
        }
    }

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

    private _onTouchStart(event: EventTouch): void {
        if (!this.wipeTarget || this._completed) return;
        event.propagationStopped = true;
        const touchPos = this.getTouchPositionInParent(event);
        this._isWiping = true;
        this._lastTouchPos = v3(touchPos.x, touchPos.y, 0);
        this.startWipe();
        this._emitProgress();
    }

    private _onTouchMove(event: EventTouch): void {
        if (!this._isWiping || this._completed) return;

        const touchPos = this.getTouchPositionInParent(event);
        const dx = touchPos.x - this._lastTouchPos.x;
        const dy = touchPos.y - this._lastTouchPos.y;
        const moveDistance = Math.sqrt(dx * dx + dy * dy);

        this._totalDistance += moveDistance;
        this._lastTouchPos = v3(touchPos.x, touchPos.y, 0);

        const progress = (this._totalDistance / this._requiredDistance) * 100 * this.wipeSpeed;
        this.updateWipeProgress(progress);

        if (this._wipeProgress >= this.wipeThreshold) {
            this.onWipeComplete();
        }
    }

    private _onTouchEnd(_event: EventTouch): void {
        if (!this._isWiping || this._completed) return;
        this._isWiping = false;
        if (this._wipeProgress >= this.wipeThreshold) {
            this.onWipeComplete();
        } else {
            this._emitProgress();
        }
    }

    startWipe(): void {
        this._isWiping = true;
        this._playWipeSound();
    }

    updateWipeProgress(deltaProgress: number): void {
        this._wipeProgress = Math.min(Math.max(deltaProgress, 0), 100);
        if (this._stainOpacity) {
            const opacity = 255 * (1 - this._wipeProgress / 100);
            this._stainOpacity.opacity = Math.floor(opacity);
        }
        if (Math.floor(this._totalDistance) % 50 < 10) {
            this._playWipeSound();
        }
        this._emitProgress();
    }

    onWipeComplete(): void {
        if (this._completed) {
            return;
        }
        this._completed = true;
        this._isWiping = false;
        this._wipeProgress = 100;
        this._emitProgress(true);
        this._playCompleteSound();
        this._playCompleteEffect();

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

        this._triggerItemComplete();
    }

    private _playWipeSound(): void {
        this._audioManager?.playSFX('sfx_item_wipe');
    }

    private _playCompleteSound(): void {
        this._audioManager?.playSFX('sfx_success');
    }

    private _playCompleteEffect(): void {
        if (this.node) {
            ParticleEffects.showSuccessParticles(this.node.worldPosition);
        }
    }

    private _triggerItemComplete(): void {
        this._eventManager?.emit(GAME_EVENTS.OPERATION_COMPLETE, {
            ...this._metadata,
            node: this.wipeTarget,
            progress: this._wipeProgress,
        });
    }

    private _emitProgress(completed = false): void {
        this._eventManager?.emit(GAME_EVENTS.OPERATION_PROGRESS, {
            ...this._metadata,
            progress: this._wipeProgress,
            completed,
        });
    }

    getProgress(): number {
        return this._wipeProgress;
    }

    isCompleted(): boolean {
        return this._completed;
    }

    reset(): void {
        this._isWiping = false;
        this._completed = false;
        this._wipeProgress = 0;
        this._totalDistance = 0;

        if (this._stainOpacity) {
            this._stainOpacity.opacity = 255;
        }

        if (this.stainSprite && this.stainSprite.node) {
            this.stainSprite.node.active = true;
            this.stainSprite.node.setScale(v3(1, 1, 1));
        }

        this._emitProgress();
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
