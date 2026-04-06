import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 成就管理器
 * 管理成就系统的达成和奖励
 */
@ccclass('AchievementManager')
export class AchievementManager extends Component {
    private static _instance: AchievementManager;

    static get instance(): AchievementManager {
        if (!this._instance) {
            this._instance = new AchievementManager();
        }
        return this._instance;
    }

    private _unlockedAchievements: Set<string> = new Set();

    private constructor() {
        super();
    }

    onLoad() {
        // TODO: 加载已解锁成就
    }

    /**
     * 触发成就
     */
    triggerAchievement(achievementId: string): void {
        if (!this._unlockedAchievements.has(achievementId)) {
            this._unlockedAchievements.add(achievementId);
            // TODO: 显示成就解锁提示
            // TODO: 发放奖励
            // TODO: 保存数据
        }
    }

    /**
     * 更新进度类成就
     */
    updateProgress(achievementId: string, currentValue: number): void {
        // TODO: 检查是否达成条件
        // TODO: 达成则触发成就
    }

    /**
     * 是否已解锁
     */
    isUnlocked(achievementId: string): boolean {
        return this._unlockedAchievements.has(achievementId);
    }
}
