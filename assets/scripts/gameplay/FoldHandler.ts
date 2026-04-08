import { _decorator, Component, EventTouch, Node, Vec3, Sprite, tween, easing, v3, director, UITransform, UIOpacity, Graphics, Color } from 'cc';
import { EventManager } from '../core/EventManager';
import { AudioManager } from '../audio/AudioManager';
import { ParticleEffects } from '../effects/ParticleEffects';
import { GAME_EVENTS } from '../data/constants';
import { OperationType } from '../data/LevelData';

const { ccclass, property } = _decorator;

interface FoldMetadata {
    levelId?: number;
    itemId?: string;
    slotId?: string;
    operation?: OperationType;
    targetLabel?: string;
}

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
    private _metadata: FoldMetadata = {};

    onLoad() {
        this._audioManager = AudioManager.getInstance();
        this._eventManager = EventManager.getInstance();
        this._initFoldLines();
        this._initTouchEvents();
    }

    start() {
        this._initFoldVisual();
    }

    public setFoldMetadata(metadata: FoldMetadata): void {
        this._metadata = { ...metadata };
    }

    private _initFoldLines(): void {
        if (!this.foldLineGraphics) {
            const graphicsNode = new Node('FoldLines');
            this.node.addChild(graphicsNode);
            this.foldLineGraphics = graphicsNode.addComponent(Graphics);
        }
    }

    private _initTouchEvents(): void {
        if (!this.foldItem) return;
        this.foldItem.on(Node.EventType.TOUCH_START, this._onTouchStart, this);
    }

    private _initFoldVisual(): void {
        if (this.foldItem) {
            this._foldItemOpacity = this.foldItem.getComponent(UIOpacity);
            if (!this._foldItemOpacity) {
                this._foldItemOpacity = this.foldItem.addComponent(UIOpacity);
            }
        }
        this._drawFoldLines();
    }

    private _drawFoldLines(): void {
        if (!this.foldLineGraphics) return;

        const graphics = this.foldLineGraphics;
        graphics.clear();

        const uiTransform = this.foldItem ? this.foldItem.getComponent(UITransform) : null;
        const itemWidth = uiTransform ? uiTransform.contentSize.width : 100;
        const itemHeight = uiTransform ? uiTransform.contentSize.height : 100;
        const centerX = 0;
        const centerY = 0;

        if (this._currentFoldStep === 0 && !this._completedSteps.has(0)) {
            this._drawFoldLine(centerX - itemWidth / 2, centerY, centerX + itemWidth / 2, centerY);
        }

        if (this._currentFoldStep === 1 && !this._completedSteps.has(1)) {
            this._drawFoldLine(centerX, centerY - itemHeight / 2, centerX, centerY + itemHeight / 2);
        }

        if (this._currentFoldStep >= 2 && this._currentFoldStep < this.totalFoldSteps && !this._completedSteps.has(this._currentFoldStep)) {
            this._drawFoldLine(centerX - itemWidth / 2, centerY - itemHeight / 2, centerX + itemWidth / 2, centerY + itemHeight / 2);
        }
    }

    private _drawFoldLine(x1: number, y1: number, x2: number, y2: number): void {
        if (!this.foldLineGraphics) return;

        const graphics = this.foldLineGraphics;
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

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        graphics.arc(midX, midY, 25, 0, Math.PI * 2);
        graphics.strokeColor = new Color(255, 200, 0, 150);
        graphics.lineWidth = 2;
        graphics.stroke();
    }

    private _onTouchStart(event: EventTouch): void {
        if (this._isAnimating) return;
        if (!this.foldItem) return;

        event.propagationStopped = true;
        this.onFoldLineClick(this._currentFoldStep);
    }

    onFoldLineClick(step: number): void {
        if (step !== this._currentFoldStep) {
            this._playErrorFeedback();
            return;
        }

        if (this._completedSteps.has(step)) {
            return;
        }

        this._executeFold(step);
    }

    private _executeFold(step: number): void {
        this._isAnimating = true;
        this._completedSteps.add(step);
        this._playFoldSound();

        switch (step) {
            case 0:
                this._foldHorizontal();
                break;
            case 1:
                this._foldVertical();
                break;
            default:
                this._foldDiagonal();
                break;
        }

        this._currentFoldStep++;
        this._emitProgress();

        this._foldTimeoutId = setTimeout(() => {
            this._drawFoldLines();
            this._isAnimating = false;
        }, this.foldTime * 1000);

        if (this._currentFoldStep >= this.totalFoldSteps) {
            this._foldTimeoutId = setTimeout(() => {
                this.onFoldComplete();
            }, this.foldTime * 1000 + 100);
        }
    }

    private _foldHorizontal(): void {
        if (!this.foldItem) return;
        const originalScale = this.foldItem.scale.clone();
        tween(this.foldItem)
            .to(this.foldTime, { scale: v3(originalScale.x * 0.5, originalScale.y, originalScale.z) }, { easing: easing.backOut })
            .start();
    }

    private _foldVertical(): void {
        if (!this.foldItem) return;
        const originalScale = this.foldItem.scale.clone();
        tween(this.foldItem)
            .to(this.foldTime, { scale: v3(originalScale.x, originalScale.y * 0.5, originalScale.z) }, { easing: easing.backOut })
            .start();
    }

    private _foldDiagonal(): void {
        if (!this.foldItem) return;
        const originalScale = this.foldItem.scale.clone();
        tween(this.foldItem)
            .to(this.foldTime, { scale: v3(originalScale.x * 0.85, originalScale.y * 0.85, originalScale.z) }, { easing: easing.backOut })
            .start();
    }

    onFoldComplete(): void {
        this._playCompleteSound();
        this._playCompleteEffect();

        if (this.foldLineGraphics) {
            this.foldLineGraphics.clear();
        }

        this._emitProgress(true);
        this._triggerItemComplete();
    }

    private _playFoldSound(): void {
        this._audioManager?.playSFX('sfx_item_fold');
    }

    private _playCompleteSound(): void {
        this._audioManager?.playSFX('sfx_success');
    }

    private _playErrorFeedback(): void {
        this._audioManager?.playSFX('sfx_item_wrong');

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

    private _playCompleteEffect(): void {
        if (this.node) {
            ParticleEffects.showSuccessParticles(this.node.worldPosition);
        }
    }

    private _triggerItemComplete(): void {
        this._eventManager?.emit(GAME_EVENTS.OPERATION_COMPLETE, {
            ...this._metadata,
            node: this.foldItem,
            progress: 100,
        });
    }

    private _emitProgress(completed = false): void {
        const progress = Math.min((this._currentFoldStep / Math.max(this.totalFoldSteps, 1)) * 100, 100);
        this._eventManager?.emit(GAME_EVENTS.OPERATION_PROGRESS, {
            ...this._metadata,
            progress,
            completed,
        });
    }

    getCurrentStep(): number {
        return this._currentFoldStep;
    }

    getTotalSteps(): number {
        return this.totalFoldSteps;
    }

    isCompleted(): boolean {
        return this._currentFoldStep >= this.totalFoldSteps;
    }

    reset(): void {
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

        this._drawFoldLines();
        this._emitProgress();
    }

    onDestroy() {
        if (this._foldTimeoutId) {
            clearTimeout(this._foldTimeoutId);
            this._foldTimeoutId = null;
        }

        if (this.foldItem) {
            this.foldItem.off(Node.EventType.TOUCH_START, this._onTouchStart, this);
        }
    }
}
