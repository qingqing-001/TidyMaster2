import { _decorator, Component, Label } from 'cc';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/Constants';

const { ccclass, property } = _decorator;

/**
 * 计时控制器
 * 控制关卡倒计时
 * 每秒更新倒计时，时间耗尽时触发 LEVEL_FAILED 事件
 */
@ccclass('TimerController')
export class TimerController extends Component {
    @property({ type: Label, tooltip: '时间显示标签' })
    timeLabel: Label | null = null;

    @property({ type: Label, tooltip: '时间显示标签（备选）' })
    timerLabel: Label | null = null;

    private _timeLimit: number = 0;
    private _currentTime: number = 0;
    private _isRunning: boolean = false;
    private _timerInterval: number | null = null;
    private _eventManager: EventManager | null = null;

    onLoad(): void {
        this._eventManager = EventManager.getInstance();
        // 默认尝试获取 timeLabel 和 timerLabel
        if (!this.timeLabel) {
            this.timeLabel = this.timerLabel;
        }
    }

    start(): void {
        // 可选的自动开始计时（如果有设置时间限制）
        if (this._timeLimit > 0 && this._isRunning) {
            this.startCountdown();
        }
    }

    /**
     * 开始计时
     * @param timeLimit 时间限制（秒）
     */
    startTimer(timeLimit: number): void {
        this._timeLimit = timeLimit;
        this._currentTime = timeLimit;
        this._isRunning = true;
        
        this.updateTimeLabel();
        this.startCountdown();
        
        console.log(`[TimerController] 计时开始：${timeLimit}秒`);
    }

    /**
     * 开始倒计时循环
     */
    private startCountdown(): void {
        // 清除之前的计时器
        this.stopCountdown();

        // 每秒更新一次倒计时
        this._timerInterval = setInterval(() => {
            this.tick();
        }, 1000) as unknown as number;
    }

    /**
     * 停止倒计时
     */
    private stopCountdown(): void {
        if (this._timerInterval !== null) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
    }

    /**
     * 每秒tick
     */
    private tick(): void {
        if (!this._isRunning) {
            return;
        }

        this._currentTime--;
        this.updateTimeLabel();

        // 检查时间是否耗尽
        if (this._currentTime <= 0) {
            this.onTimeOut();
        }
    }

    /**
     * 时间耗尽处理
     */
    private onTimeOut(): void {
        this._currentTime = 0;
        this._isRunning = false;
        this.stopCountdown();
        this.updateTimeLabel();

        // 触发 LEVEL_FAILED 事件
        if (this._eventManager) {
            this._eventManager.emit(GAME_EVENTS.LEVEL_FAILED, {
                levelId: this.node.name || undefined
            });
        }

        console.log('[TimerController] 时间耗尽！触发 LEVEL_FAILED');
    }

    /**
     * 暂停计时
     */
    pauseTimer(): void {
        this._isRunning = false;
        this.stopCountdown();
        console.log('[TimerController] 计时已暂停');
    }

    /**
     * 恢复计时
     */
    resumeTimer(): void {
        if (this._currentTime > 0) {
            this._isRunning = true;
            this.startCountdown();
            console.log('[TimerController] 计时已恢复');
        }
    }

    /**
     * 增加时间（用于广告续命）
     * @param seconds 增加的秒数
     */
    addTime(seconds: number): void {
        this._currentTime += seconds;
        this.updateTimeLabel();
        console.log(`[TimerController] 增加时间：+${seconds}秒，当前剩余：${this._currentTime}秒`);
    }

    /**
     * 获取当前剩余时间
     */
    getRemainingTime(): number {
        return this._currentTime;
    }

    /**
     * 获取时间限制
     */
    getTimeLimit(): number {
        return this._timeLimit;
    }

    /**
     * 是否正在运行
     */
    isRunning(): boolean {
        return this._isRunning;
    }

    /**
     * 更新UI显示
     */
    private updateTimeLabel(): void {
        const label = this.timeLabel || this.timerLabel;
        if (!label) {
            return;
        }

        const minutes = Math.floor(this._currentTime / 60);
        const seconds = this._currentTime % 60;
        
        if (minutes > 0) {
            label.string = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
            label.string = `${seconds}`;
        }

        // 时间不足10秒时显示警告效果（通过在字符串前后添加标记）
        if (this._currentTime <= 10 && this._currentTime > 0) {
            // 添加警告前缀，如 "⚠️ 5"
            if (!label.string.startsWith('⚠️')) {
                label.string = '⚠️ ' + label.string;
            }
        } else {
            // 移除警告前缀
            if (label.string.startsWith('⚠️ ')) {
                label.string = label.string.substring(2);
            }
        }
    }

    onDestroy(): void {
        this.stopCountdown();
    }
}