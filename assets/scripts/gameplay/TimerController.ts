import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 计时控制器
 * 控制关卡倒计时
 */
@ccclass('TimerController')
export class TimerController extends Component {
    @property(Label)
    timeLabel: Label = null!;

    private _timeLimit: number = 0;
    private _currentTime: number = 0;
    private _isRunning: boolean = false;

    onLoad() {
        // TODO: 初始化计时器
    }

    /**
     * 开始计时
     */
    startTimer(timeLimit: number): void {
        this._timeLimit = timeLimit;
        this._currentTime = timeLimit;
        this._isRunning = true;
        // TODO: 开始更新倒计时
    }

    /**
     * 暂停计时
     */
    pauseTimer(): void {
        this._isRunning = false;
    }

    /**
     * 恢复计时
     */
    resumeTimer(): void {
        this._isRunning = true;
    }

    /**
     * 增加时间（用于广告续命）
     */
    addTime(seconds: number): void {
        this._currentTime += seconds;
    }

    /**
     * 更新UI显示
     */
    private updateTimeLabel(): void {
        // TODO: 更新时间显示
        // TODO: 时间不足10秒时显示警告颜色
    }
}
