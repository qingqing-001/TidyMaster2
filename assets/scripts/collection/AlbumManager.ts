import { _decorator, Component, SpriteFrame } from 'cc';
import { DataManager } from '../core/DataManager';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';

const { ccclass } = _decorator;

/**
 * 家居图鉴管理器
 * 管理家居物品收集系统
 */
@ccclass('AlbumManager')
export class AlbumManager extends Component {
    private static _instance: AlbumManager;

    static get instance(): AlbumManager {
        if (!this._instance) {
            this._instance = new AlbumManager();
        }
        return this._instance;
    }

    // 存储key
    private static readonly STORAGE_KEY = 'tidy_master_album';
    private static readonly COLLECTION_MILESTONE_KEY = 'tidy_master_collection_milestone';

    // 已收集的物品ID集合
    private _collectedItems: Set<string> = new Set();

    // 收集里程碑配置 (收集数量 -> 奖励)
    private readonly COLLECTION_MILESTONES = [
        { count: 5, rewardCoins: 100, name: '初窥门径' },
        { count: 10, rewardCoins: 200, name: '小有所成' },
        { count: 20, rewardCoins: 500, name: '略有小成' },
        { count: 30, rewardCoins: 1000, name: '炉火纯青' },
        { count: 50, rewardCoins: 2000, name: '登堂入室' },
        { count: 100, rewardCoins: 5000, name: '登峰造极' },
    ];

    // 已领取的里程碑索引
    private _claimedMilestones: number[] = [];

    private constructor() {
        super();
        this.loadData();
    }

    onLoad() {
        this.loadData();
    }

    // ==================== 数据加载/保存 ====================

    /**
     * 加载收集数据
     */
    private loadData(): void {
        try {
            const data = localStorage.getItem(AlbumManager.STORAGE_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                this._collectedItems = new Set(parsed.items || []);
                this._claimedMilestones = parsed.claimedMilestones || [];
            }
        } catch (e) {
            console.error('[AlbumManager] 加载数据失败:', e);
        }
    }

    /**
     * 保存收集数据
     */
    private saveData(): void {
        try {
            const data = {
                items: Array.from(this._collectedItems),
                claimedMilestones: this._claimedMilestones,
            };
            localStorage.setItem(AlbumManager.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('[AlbumManager] 保存数据失败:', e);
        }
    }

    // ==================== 收集功能 ====================

    /**
     * 收集物品
     * @param itemId 物品ID
     * @returns 是否新收集
     */
    collectItem(itemId: string): boolean {
        if (this._collectedItems.has(itemId)) {
            return false; // 已经收集过
        }

        this._collectedItems.add(itemId);
        this.saveData();

        // 发送收集事件
        const eventManager = EventManager.getInstance();
        eventManager.emit(GAME_EVENTS.ALBUM_ITEM_COLLECTED, {
            itemId: itemId,
            totalCount: this._collectedItems.size,
        });

        console.log(`[AlbumManager] 新收集物品: ${itemId}, 总计: ${this._collectedItems.size}`);

        // 检查里程碑
        this.checkMilestones();

        return true;
    }

    /**
     * 批量收集物品
     * @param itemIds 物品ID数组
     */
    collectItems(itemIds: string[]): number {
        let newCount = 0;
        for (const itemId of itemIds) {
            if (this.collectItem(itemId)) {
                newCount++;
            }
        }
        return newCount;
    }

    /**
     * 是否已收集
     */
    isCollected(itemId: string): boolean {
        return this._collectedItems.has(itemId);
    }

    /**
     * 获取收集总数
     */
    getTotalCollected(): number {
        return this._collectedItems.size;
    }

    /**
     * 获取收集率
     * @param totalAvailable 可用物品总数
     */
    getCollectionRate(totalAvailable: number): number {
        if (totalAvailable <= 0) return 0;
        return Math.floor((this._collectedItems.size / totalAvailable) * 100);
    }

    /**
     * 获取所有已收集的物品ID
     */
    getCollectedItems(): string[] {
        return Array.from(this._collectedItems);
    }

    // ==================== 里程碑系统 ====================

    /**
     * 检查并发放里程碑奖励
     */
    private checkMilestones(): void {
        const totalCount = this._collectedItems.size;

        for (let i = 0; i < this.COLLECTION_MILESTONES.length; i++) {
            const milestone = this.COLLECTION_MILESTONES[i];

            // 如果达到里程碑且未领取
            if (totalCount >= milestone.count && !this._claimedMilestones.includes(i)) {
                this._claimedMilestones.push(i);

                // 发放奖励
                const dataManager = DataManager.getInstance();
                dataManager.addCoins(milestone.rewardCoins);

                // 发送里程碑事件
                const eventManager = EventManager.getInstance();
                eventManager.emit(GAME_EVENTS.ALBUM_MILESTONE_REACHED, {
                    milestoneIndex: i,
                    name: milestone.name,
                    count: milestone.count,
                    rewardCoins: milestone.rewardCoins,
                });

                console.log(`[AlbumManager] 达成里程碑: ${milestone.name}, 奖励: ${milestone.rewardCoins}金币`);
            }
        }

        this.saveData();
    }

    /**
     * 领取里程碑奖励
     */
    claimMilestoneReward(milestoneIndex: number): boolean {
        if (this._claimedMilestones.includes(milestoneIndex)) {
            return false; // 已领取
        }

        const milestone = this.COLLECTION_MILESTONES[milestoneIndex];
        if (!milestone) {
            return false;
        }

        const totalCount = this._collectedItems.size;
        if (totalCount < milestone.count) {
            return false; // 未达到条件
        }

        this._claimedMilestones.push(milestoneIndex);
        this.saveData();

        // 发放奖励
        const dataManager = DataManager.getInstance();
        dataManager.addCoins(milestone.rewardCoins);

        return true;
    }

    /**
     * 获取当前进度对应的里程碑
     */
    getCurrentMilestone(): { index: number; count: number; name: string } | null {
        const totalCount = this._collectedItems.size;

        for (let i = this.COLLECTION_MILESTONES.length - 1; i >= 0; i--) {
            if (totalCount >= this.COLLECTION_MILESTONES[i].count) {
                const nextIndex = i + 1;
                if (nextIndex < this.COLLECTION_MILESTONES.length) {
                    return {
                        index: nextIndex,
                        count: this.COLLECTION_MILESTONES[nextIndex].count,
                        name: this.COLLECTION_MILESTONES[nextIndex].name,
                    };
                }
                return null; // 已达成所有里程碑
            }
        }

        // 返回第一个里程碑
        return {
            index: 0,
            count: this.COLLECTION_MILESTONES[0].count,
            name: this.COLLECTION_MILESTONES[0].name,
        };
    }

    /**
     * 获取下一个里程碑
     */
    getNextMilestone(): { index: number; count: number; name: string } | null {
        const totalCount = this._collectedItems.size;

        for (let i = 0; i < this.COLLECTION_MILESTONES.length; i++) {
            if (totalCount < this.COLLECTION_MILESTONES[i].count) {
                return {
                    index: i,
                    count: this.COLLECTION_MILESTONES[i].count,
                    name: this.COLLECTION_MILESTONES[i].name,
                };
            }
        }

        return null; // 已达成所有里程碑
    }

    // ==================== 重置 ====================

    /**
     * 重置图鉴数据
     */
    reset(): void {
        this._collectedItems.clear();
        this._claimedMilestones = [];
        this.saveData();
    }
}