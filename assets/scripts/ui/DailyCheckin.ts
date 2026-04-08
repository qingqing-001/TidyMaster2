import { _decorator, Component, Node, Label, Button, Color, Sprite } from 'cc';
import { DataManager } from '../core/DataManager';
import { AudioManager } from '../audio/AudioManager';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';

const { ccclass, property } = _decorator;

// 签到奖励配置
interface CheckinReward {
    day: number;
    rewardId: string;
    rewardAmount: number;
    rewardType: 'coin' | 'tool_fragment' | 'gem';
}

// 签到数据接口
interface CheckinData {
    consecutiveDays: number;  // 连续签到天数
    lastCheckinDate: string;  // 上次签到日期 (YYYY-MM-DD)
    totalCheckinDays: number; // 累计签到天数
    toolFragments: number;    // 工具碎片数量
    gems: number;             // 宝石数量
}

const CHECKIN_REWARDS: CheckinReward[] = [
    { day: 1, rewardId: 'coin_100', rewardAmount: 100, rewardType: 'coin' },
    { day: 2, rewardId: 'coin_150', rewardAmount: 150, rewardType: 'coin' },
    { day: 3, rewardId: 'tool_fragment_1', rewardAmount: 1, rewardType: 'tool_fragment' },
    { day: 4, rewardId: 'coin_200', rewardAmount: 200, rewardType: 'coin' },
    { day: 5, rewardId: 'tool_fragment_2', rewardAmount: 2, rewardType: 'tool_fragment' },
    { day: 6, rewardId: 'coin_300', rewardAmount: 300, rewardType: 'coin' },
    { day: 7, rewardId: 'gem_10', rewardAmount: 10, rewardType: 'gem' },
];

// 存储键名
const STORAGE_KEY = 'tidy_master_checkin';

/**
 * 每日签到组件
 * 管理7天循环签到奖励
 */
@ccclass('DailyCheckin')
export class DailyCheckin extends Component {
    // UI节点引用
    @property({ type: Node })
    public closeBtn: Node | null = null;

    @property({ type: Node })
    public checkinBtn: Node | null = null;

    @property({ type: Node })
    public dayLabelsContainer: Node | null = null;

    @property({ type: Node })
    public titleLabel: Node | null = null;

    // 签到数据
    private _consecutiveDays: number = 0;
    private _lastCheckinDate: string = '';
    private _totalCheckinDays: number = 0;
    private _toolFragments: number = 0;
    private _gems: number = 0;
    private _checkinData: CheckinData | null = null;

    // 获取今天是第几天 (1-7)
    private _currentDay: number = 1;

    onLoad() {
        // 加载签到数据
        this.loadCheckinData();
        
        // 检查是否可以签到
        this.checkCanCheckin();
    }

    start() {
        // 绑定按钮事件
        this.bindButtonEvents();
        
        // 更新UI显示
        this.updateUI();
    }

    /**
     * 加载签到数据 (本地存储)
     */
    private loadCheckinData(): void {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                this._consecutiveDays = data.consecutiveDays || 0;
                this._lastCheckinDate = data.lastCheckinDate || '';
                this._totalCheckinDays = data.totalCheckinDays || 0;
                this._toolFragments = data.toolFragments || 0;
                this._gems = data.gems || 0;
            }
        } catch (e) {
            console.error('[DailyCheckin] 加载签到数据失败:', e);
        }

        this._checkinData = {
            consecutiveDays: this._consecutiveDays,
            lastCheckinDate: this._lastCheckinDate,
            totalCheckinDays: this._totalCheckinDays,
            toolFragments: this._toolFragments,
            gems: this._gems,
        };
    }

    /**
     * 保存签到数据 (本地存储)
     */
    private saveCheckinData(): void {
        try {
            const data = {
                consecutiveDays: this._consecutiveDays,
                lastCheckinDate: this._lastCheckinDate,
                totalCheckinDays: this._totalCheckinDays,
                toolFragments: this._toolFragments,
                gems: this._gems,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            
            // 同时保存到DataManager
            DataManager.getInstance().saveCheckinData(data);
            
            console.log('[DailyCheckin] 保存签到数据:', data);
        } catch (e) {
            console.error('[DailyCheckin] 保存签到数据失败:', e);
        }
    }

    /**
     * 检查是否可以签到
     */
    private checkCanCheckin(): void {
        const today = this.getTodayDate();
        
        if (this._lastCheckinDate === today) {
            // 今日已签到
            // 计算今天是签到周期的第几天
            this._currentDay = (this._consecutiveDays % 7) || 7;
        } else {
            // 检查是否是连续签到
            const yesterday = this.getYesterdayDate();
            if (this._lastCheckinDate === yesterday) {
                // 连续签到
                this._currentDay = (this._consecutiveDays % 7) + 1;
            } else {
                // 签到中断，重新开始
                this._currentDay = 1;
                this._consecutiveDays = 0;
            }
        }
    }

    /**
     * 获取今天的日期字符串 (YYYY-MM-DD)
     */
    private getTodayDate(): string {
        const now = new Date();
        return this.formatDate(now);
    }

    /**
     * 获取昨天的日期字符串
     */
    private getYesterdayDate(): string {
        const now = new Date();
        now.setDate(now.getDate() - 1);
        return this.formatDate(now);
    }

    /**
     * 格式化日期为 YYYY-MM-DD
     */
    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * 绑定按钮事件
     */
    private bindButtonEvents(): void {
        // 关闭按钮
        if (this.closeBtn) {
            const btn = this.closeBtn.getComponent(Button);
            if (btn) {
                btn.node.on('click', this.onCloseClick, this);
            }
        }

        // 签到按钮
        if (this.checkinBtn) {
            const btn = this.checkinBtn.getComponent(Button);
            if (btn) {
                btn.node.on('click', this.onCheckinClick, this);
            }
        }
    }

    /**
     * 更新UI显示
     */
    private updateUI(): void {
        // 更新签到按钮状态
        this.updateCheckinButton();

        // 更新奖励显示
        this.updateRewardDisplay();

        // 更新标题
        this.updateTitle();
    }

    /**
     * 更新签到按钮状态
     */
    private updateCheckinButton(): void {
        if (!this.checkinBtn) return;

        const btnComp = this.checkinBtn.getComponent(Button);
        if (!btnComp) return;

        const canCheckin = this.canCheckin();
        
        // 可签到：亮色；不可签到：灰色
        const label = this.checkinBtn.getComponent(Label);
        if (label) {
            if (canCheckin) {
                label.string = '签到';
            } else {
                label.string = '已签到';
            }
        }
    }

    /**
     * 更新奖励显示
     */
    private updateRewardDisplay(): void {
        if (!this.dayLabelsContainer) return;

        // 遍历7天的奖励
        for (let i = 0; i < 7; i++) {
            const day = i + 1;
            const reward = CHECKIN_REWARDS[i];
            
            // 获取对应天的节点
            const dayNode = this.dayLabelsContainer.getChildByName('Day_' + day);
            if (!dayNode) continue;

            // 检查这天的奖励是否已领取
            const isReceived = day <= this._consecutiveDays % 7 || 
                              (this._consecutiveDays > 0 && this._consecutiveDays % 7 === 0 && day === 7);
            const isToday = day === this._currentDay;

            // 更新显示状态
            this.updateDayNodeState(dayNode, isReceived, isToday, reward);
        }
    }

    /**
     * 更新单天节点状态
     */
    private updateDayNodeState(node: Node, isReceived: boolean, isToday: boolean, reward: CheckinReward): void {
        const label = node.getComponent(Label);
        if (label) {
            let rewardText = '';
            switch (reward.rewardType) {
                case 'coin':
                    rewardText = '💰' + reward.rewardAmount;
                    break;
                case 'tool_fragment':
                    rewardText = '🔧' + reward.rewardAmount;
                    break;
                case 'gem':
                    rewardText = '💎' + reward.rewardAmount;
                    break;
            }
            
            label.string = `第${reward.day}天\n${rewardText}`;
        }
    }

    /**
     * 更新标题
     */
    private updateTitle(): void {
        if (!this.titleLabel) return;

        const label = this.titleLabel.getComponent(Label);
        if (label) {
            const consecutive = this._consecutiveDays;
            if (consecutive > 0) {
                label.string = `连续签到 ${consecutive} 天`;
            } else {
                label.string = '每日签到';
            }
        }
    }

    // ==================== 按钮回调 ====================

    /**
     * 关闭按钮点击
     */
    private onCloseClick(): void {
        console.log('[DailyCheckin] 点击关闭');
        
        // 隐藏签到面板
        if (this.node) {
            this.node.active = false;
        }
    }

    /**
     * 签到按钮点击
     */
    private onCheckinClick(): void {
        if (!this.canCheckin()) {
            console.log('[DailyCheckin] 今日已签到');
            return;
        }

        console.log('[DailyCheckin] 签到');
        
        // 执行签到
        this.checkin();
    }

    // ==================== 公共方法 ====================

    /**
     * 执行签到
     */
    public checkin(): void {
        // 获取今日奖励
        const reward = CHECKIN_REWARDS[this._currentDay - 1];
        
        // 更新签到数据
        this._consecutiveDays++;
        this._totalCheckinDays++;
        this._lastCheckinDate = this.getTodayDate();
        
        // 保存数据
        this._checkinData = {
            consecutiveDays: this._consecutiveDays,
            lastCheckinDate: this._lastCheckinDate,
            totalCheckinDays: this._totalCheckinDays,
            toolFragments: this._toolFragments,
            gems: this._gems,
        };
        this.saveCheckinData();

        // 发放奖励
        this.grantReward(reward);

        // 显示奖励弹窗
        this.showRewardPopup(reward);

        // 更新UI
        this.updateUI();

        // 发送签到完成事件
        const eventManager = EventManager.getInstance();
        eventManager.emit(GAME_EVENTS.COLLECTION_UPDATE, {
            type: 'checkin',
            day: this._currentDay,
            reward: reward,
        });
    }

    /**
     * 发放奖励
     */
    private grantReward(reward: CheckinReward): void {
        console.log('[DailyCheckin] 发放奖励:', reward);
        
        const dataManager = DataManager.getInstance();
        
        switch (reward.rewardType) {
            case 'coin':
                dataManager.addCoins(reward.rewardAmount);
                break;
                
            case 'tool_fragment':
                this._toolFragments += reward.rewardAmount;
                console.log(`[DailyCheckin] 获得工具碎片 x${reward.rewardAmount}, 总计: ${this._toolFragments}`);
                // 发送收集更新事件
                const eventManager = EventManager.getInstance();
                eventManager.emit(GAME_EVENTS.COLLECTION_UPDATE, {
                    type: 'tool_fragment',
                    amount: this._toolFragments,
                });
                break;
                
            case 'gem':
                this._gems += reward.rewardAmount;
                console.log(`[DailyCheckin] 获得宝石 x${reward.rewardAmount}, 总计: ${this._gems}`);
                // 发送收集更新事件
                const eventMgr = EventManager.getInstance();
                eventMgr.emit(GAME_EVENTS.COLLECTION_UPDATE, {
                    type: 'gem',
                    amount: this._gems,
                });
                break;
        }
        
        // 保存更新后的数据
        this.saveCheckinData();
    }

    /**
     * 显示奖励弹窗
     */
    private showRewardPopup(reward: CheckinReward): void {
        console.log('[DailyCheckin] 获得奖励:', reward.rewardAmount, reward.rewardType);
        
        // 构建奖励显示文本
        let rewardText = '';
        let iconText = '';
        switch (reward.rewardType) {
            case 'coin':
                iconText = '💰';
                rewardText = `${reward.rewardAmount} 金币`;
                break;
            case 'tool_fragment':
                iconText = '🔧';
                rewardText = `工具碎片 x${reward.rewardAmount}`;
                break;
            case 'gem':
                iconText = '💎';
                rewardText = `宝石 x${reward.rewardAmount}`;
                break;
        }
        
        // 显示系统提示（实际项目中可以替换为自定义弹窗）
        if (typeof window !== 'undefined' && (window as any).wx) {
            // 微信小游戏环境
            console.log(`[DailyCheckin] 获得奖励: ${rewardText}`);
        } else {
            // 浏览器环境
            // alert(`${iconText} 签到成功！\n获得: ${rewardText}`);
        }
    }

    /**
     * 广告补签
     */
    public advertiseCheckin(): void {
        console.log('[DailyCheckin] 广告补签');
        
        // 检查是否已经签到过
        if (!this.canCheckin()) {
            console.log('[DailyCheckin] 今日已签到，无法补签');
            return;
        }

        // 获取今日奖励
        const reward = CHECKIN_REWARDS[this._currentDay - 1];
        
        // 更新签到数据（补签不增加连续天数）
        this._totalCheckinDays++;
        
        // 保存数据
        this._checkinData = {
            consecutiveDays: this._consecutiveDays,
            lastCheckinDate: this._lastCheckinDate,
            totalCheckinDays: this._totalCheckinDays,
            toolFragments: this._toolFragments,
            gems: this._gems,
        };
        this.saveCheckinData();

        // 发放奖励（补签奖励减半）
        const halfReward = { ...reward, rewardAmount: Math.floor(reward.rewardAmount / 2) };
        this.grantReward(halfReward);

        // 显示奖励弹窗
        this.showRewardPopup(halfReward);

        // 更新UI
        this.updateUI();

        // 发送补签完成事件
        const eventManager = EventManager.getInstance();
        eventManager.emit(GAME_EVENTS.COLLECTION_UPDATE, {
            type: 'checkin_advertise',
            day: this._currentDay,
            reward: halfReward,
        });
    }

    /**
     * 是否可以签到
     */
    public canCheckin(): boolean {
        const today = this.getTodayDate();
        return this._lastCheckinDate !== today;
    }

    /**
     * 检查今天是否已签到
     */
    public isCheckedInToday(): boolean {
        const today = this.getTodayDate();
        return this._lastCheckinDate === today;
    }

    /**
     * 获取工具碎片数量
     */
    public getToolFragments(): number {
        return this._toolFragments;
    }

    /**
     * 获取宝石数量
     */
    public getGems(): number {
        return this._gems;
    }

    /**
     * 获取连续签到天数
     */
    public getConsecutiveDays(): number {
        return this._consecutiveDays;
    }

    /**
     * 获取累计签到天数
     */
    public getTotalCheckinDays(): number {
        return this._totalCheckinDays;
    }

    /**
     * 获取当前是第几天签到周期
     */
    public getCurrentDay(): number {
        return this._currentDay;
    }

    /**
     * 获取签到奖励配置
     */
    public static getCheckinRewards(): CheckinReward[] {
        return CHECKIN_REWARDS;
    }

    /**
     * 获取指定天的奖励
     */
    public static getRewardForDay(day: number): CheckinReward | undefined {
        return CHECKIN_REWARDS[day - 1];
    }
}