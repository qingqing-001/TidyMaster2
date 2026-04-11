import { _decorator, Node } from 'cc';
import { isWx, postScore as wxPostScore, getUserInfo, UserInfo } from '../utils/WxUtil';
const { ccclass, property } = _decorator;

/**
 * 排行榜数据类型
 */
export interface RankData {
    openId: string;
    nickname: string;
    avatarUrl: string;
    score: number;
    rank: number;
}

/**
 * 排行榜管理器
 * 使用微信开放域实现好友排行榜
 */
@ccclass('RankingManager')
export class RankingManager {
    private static _instance: RankingManager | null = null;
    
    // 当前用户信息
    private _userInfo: UserInfo | null = null;
    
    // 当前排行榜数据
    private _rankingData: RankData[] = [];
    
    // 排行榜UI节点
    private _rankingNode: Node | null = null;
    
    // 是否正在显示排行榜
    private _isShowing: boolean = false;
    
    // 开放域ID
    private readonly OPEN_DATA_CONTEXT_KEY = 'openDataContext';
    private readonly RANKING_GROUP_ID = 'ranking_group_1';

    private static readonly FALLBACK_USER_ID_PREFIX = 'local_user_';
    private static readonly FALLBACK_DISPLAY_NAME = '本地玩家';
    private static readonly LOCAL_SCORE_STORAGE_KEY = 'tidy_master_local_rankings';

    static get instance(): RankingManager {
        if (!this._instance) {
            this._instance = new RankingManager();
        }
        return this._instance;
    }

    private constructor() {
    }

    /**
     * 初始化排行榜管理器
     */
    async init(): Promise<void> {
        if (isWx()) {
            // 获取用户信息
            try {
                this._userInfo = await getUserInfo();
                console.log('[RankingManager] 用户信息获取成功:', this._userInfo?.nickName);
            } catch (e) {
                console.warn('[RankingManager] 获取用户信息失败:', e);
            }
            
            // 设置开放域数据
            this.setupOpenDataContext();
        }
    }

    /**
     * 设置开放域数据
     */
    private setupOpenDataContext(): void {
        if (!isWx()) return;
        
        try {
            const wxAny = wx as any;
            
            // 获取开放域上下文
            if (typeof wxAny.getOpenDataContext === 'function') {
                const openDataContext = wxAny.getOpenDataContext();
                
                // 发送初始数据
                openDataContext.postMessage({
                    type: 'INIT',
                    data: {
                        groupId: this.RANKING_GROUP_ID,
                        userInfo: this._userInfo
                    }
                });
                
                console.log('[RankingManager] 开放域初始化完成');
            }
        } catch (e) {
            console.error('[RankingManager] 设置开放域失败:', e);
        }
    }

    /**
     * 上传分数到排行榜
     * @param key 分数的键名（如 'level', 'score', 'stars'）
     * @param value 分数值
     */
    postScore(key: string, value: number): void {
        console.log('[RankingManager] 上传分数:', key, value);

        if (!isWx()) {
            console.log('[RankingManager] 当前环境不支持开放域，分数将保存在本地排行榜缓存中');
            this.saveLocalScore(key, value);
            this._rankingData = this.buildLocalRankingSnapshot();
            return;
        }

        try {
            const wxAny = wx as any;
            
            // 获取开放域上下文
            if (typeof wxAny.getOpenDataContext === 'function') {
                const openDataContext = wxAny.getOpenDataContext();
                
                // 发送分数更新消息
                openDataContext.postMessage({
                    type: 'UPDATE_SCORE',
                    key: key,
                    value: value,
                    timestamp: Date.now()
                });
                
                console.log('[RankingManager] 分数已发送到开放域');
            }
            
            // 同时保存到本地存储作为备份
            const localKey = `score_${key}`;
            const currentHighScore = wx.getStorageSync(localKey) || 0;
            if (value > currentHighScore) {
                wx.setStorageSync(localKey, value);
            }
            this.saveLocalScore(key, value);
            
        } catch (e) {
            console.error('[RankingManager] 上传分数失败:', e);
        }
    }

    /**
     * 打开排行榜
     * @param rankingNode 排行榜UI节点（可选）
     */
    async openRanking(rankingNode?: Node): Promise<void> {
        if (this._isShowing) {
            console.log('[RankingManager] 排行榜已在显示中');
            return;
        }

        console.log('[RankingManager] 打开排行榜');
        this._isShowing = true;

        if (rankingNode) {
            this._rankingNode = rankingNode;
            this._rankingNode.active = true;
        }

        if (!isWx()) {
            this.showLocalRanking();
            return;
        }

        try {
            // 请求排行榜数据
            await this.requestRankingData();
            
            // 更新UI
            this.updateRankingUI();
            
        } catch (e) {
            console.error('[RankingManager] 打开排行榜失败:', e);
            this.closeRanking();
        }
    }

    /**
     * 请求排行榜数据
     */
    private async requestRankingData(): Promise<void> {
        if (!isWx()) return;

        return new Promise((resolve, reject) => {
            try {
                const wxAny = wx as any;
                
                if (typeof wxAny.getOpenDataContext === 'function') {
                    const openDataContext = wxAny.getOpenDataContext();
                    
                    // 发送获取排行榜请求
                    openDataContext.postMessage({
                        type: 'GET_RANKING',
                        key: 'level',
                        groupId: this.RANKING_GROUP_ID
                    });
                    
                    setTimeout(() => {
                        this._rankingData = this.buildLocalRankingSnapshot();
                        resolve();
                    }, 500);
                } else {
                    this._rankingData = this.buildLocalRankingSnapshot();
                    resolve();
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 构建本地排行榜快照
     */
    private buildLocalRankingSnapshot(): RankData[] {
        const localScores = this.readLocalScores();
        const entries = Object.entries(localScores)
            .map(([scoreKey, score]) => ({ scoreKey, score }))
            .filter((entry) => Number.isFinite(entry.score) && entry.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);

        if (entries.length === 0) {
            const myScore = this.getMyScore();
            if (myScore > 0) {
                entries.push({ scoreKey: 'level', score: myScore });
            }
        }

        return entries.map((entry, index) => ({
            openId: `${RankingManager.FALLBACK_USER_ID_PREFIX}${entry.scoreKey}`,
            nickname: this.formatLocalRankingName(entry.scoreKey),
            avatarUrl: this._userInfo?.avatarUrl || '',
            score: entry.score,
            rank: index + 1,
        }));
    }

    private formatLocalRankingName(scoreKey: string): string {
        const nickname = this._userInfo?.nickName || RankingManager.FALLBACK_DISPLAY_NAME;
        return scoreKey === 'level' ? nickname : `${nickname}(${scoreKey})`;
    }

    private readLocalScores(): Record<string, number> {
        try {
            const raw = localStorage.getItem(RankingManager.LOCAL_SCORE_STORAGE_KEY);
            if (!raw) {
                return {};
            }

            const parsed = JSON.parse(raw) as Record<string, unknown>;
            const result: Record<string, number> = {};
            for (const [key, value] of Object.entries(parsed)) {
                if (typeof value === 'number' && Number.isFinite(value)) {
                    result[key] = value;
                }
            }
            return result;
        } catch (e) {
            console.warn('[RankingManager] 读取本地排行榜失败，将使用空榜单:', e);
            return {};
        }
    }

    private saveLocalScore(key: string, value: number): void {
        if (value <= 0) {
            return;
        }

        const scores = this.readLocalScores();
        const current = scores[key] || 0;
        if (value <= current) {
            return;
        }

        scores[key] = value;

        try {
            localStorage.setItem(RankingManager.LOCAL_SCORE_STORAGE_KEY, JSON.stringify(scores));
        } catch (e) {
            console.warn('[RankingManager] 保存本地排行榜失败:', e);
        }
    }

    /**
     * 显示本地排行榜
     */
    private showLocalRanking(): void {
        this._rankingData = this.buildLocalRankingSnapshot();
        
        // 如果有UI节点，更新它
        if (this._rankingNode) {
            this.updateRankingUI();
        }
    }

    /**
     * 更新排行榜UI
     */
    private updateRankingUI(): void {
        if (!this._rankingNode) {
            console.log('[RankingManager] 排行榜UI节点未设置');
            return;
        }

        console.log('[RankingManager] 更新排行榜UI，数据条数:', this._rankingData.length);
        
        // 遍历子节点更新排名显示
        // 实际实现需要根据具体的UI结构来编写
        const listNode = this._rankingNode.getChildByName('List');
        if (listNode) {
            const children = listNode.children;
            for (let i = 0; i < children.length && i < this._rankingData.length; i++) {
                const item = children[i];
                const data = this._rankingData[i];
                
                // 更新排名
                const rankLabel = item.getChildByName('RankLabel');
                if (rankLabel) {
                    // rankLabel.getComponent(Label).string = data.rank.toString();
                }
                
                // 更新昵称
                const nameLabel = item.getChildByName('NameLabel');
                if (nameLabel) {
                    // nameLabel.getComponent(Label).string = data.nickname;
                }
                
                // 更新分数
                const scoreLabel = item.getChildByName('ScoreLabel');
                if (scoreLabel) {
                    // scoreLabel.getComponent(Label).string = data.score.toString();
                }
            }
        }
    }

    /**
     * 关闭排行榜
     */
    closeRanking(): void {
        console.log('[RankingManager] 关闭排行榜');
        
        this._isShowing = false;

        if (this._rankingNode) {
            this._rankingNode.active = false;
        }

        // 通知开放域关闭
        if (isWx()) {
            try {
                const wxAny = wx as any;
                if (typeof wxAny.getOpenDataContext === 'function') {
                    const openDataContext = wxAny.getOpenDataContext();
                    openDataContext.postMessage({
                        type: 'CLOSE_RANKING'
                    });
                }
            } catch (e) {
                console.error('[RankingManager] 关闭排行榜失败:', e);
            }
        }
    }

    /**
     * 获取当前排行榜数据
     */
    getRankingData(): RankData[] {
        return this._rankingData;
    }

    /**
     * 获取自己的排名
     */
    getMyRank(key: string = 'level'): number {
        const myScore = this.getMyScore(key);
        
        // 计算排名
        let rank = 1;
        for (const data of this._rankingData) {
            if (data.score > myScore) {
                rank++;
            }
        }
        
        return rank;
    }

    /**
     * 获取自己的分数
     */
    getMyScore(key: string = 'level'): number {
        if (!isWx()) {
            return 0;
        }
        
        const localKey = `score_${key}`;
        return wx.getStorageSync(localKey) || 0;
    }

    /**
     * 是否有新纪录
     */
    hasNewHighScore(key: string, newScore: number): boolean {
        const localKey = `score_${key}`;
        const highScore = wx.getStorageSync(localKey) || 0;
        return newScore > highScore;
    }

    /**
     * 获取好友列表
     */
    async getFriendList(): Promise<any[]> {
        if (!isWx()) {
            return [];
        }

        try {
            const wxAny = wx as any;
            
            if (typeof wxAny.getOpenDataContext === 'function') {
                const openDataContext = wxAny.getOpenDataContext();
                
                // 发送获取好友列表请求
                openDataContext.postMessage({
                    type: 'GET_FRIEND_LIST'
                });
                
                // 返回模拟数据
                return this.buildLocalRankingSnapshot();
            }
        } catch (e) {
            console.error('[RankingManager] 获取好友列表失败:', e);
        }
        
        return [];
    }

    /**
     * 获取群排行榜
     */
    async getGroupRanking(groupId: string): Promise<RankData[]> {
        if (!isWx()) {
            return this.buildLocalRankingSnapshot();
        }

        try {
            const wxAny = wx as any;
            
            if (typeof wxAny.getOpenDataContext === 'function') {
                const openDataContext = wxAny.getOpenDataContext();
                
                openDataContext.postMessage({
                    type: 'GET_GROUP_RANKING',
                    groupId: groupId
                });
                
                return this.buildLocalRankingSnapshot();
            }
        } catch (e) {
            console.error('[RankingManager] 获取群排行榜失败:', e);
        }
        
        return [];
    }

    /**
     * 上报成绩（带社交推荐）
     */
    reportScoreWithShare(key: string, value: number, levelId: number): void {
        // 上传分数
        this.postScore(key, value);
        
        // 检查是否有新纪录
        if (this.hasNewHighScore(key, value)) {
            // 可以提示玩家分享
            console.log('[RankingManager] 新纪录！可以分享炫耀一下~');
        }
        
        // 更新到开放域
        if (isWx()) {
            try {
                const wxAny = wx as any;
                const openDataContext = wxAny.getOpenDataContext();
                
                openDataContext.postMessage({
                    type: 'REPORT_SCORE',
                    key: key,
                    value: value,
                    levelId: levelId,
                    timestamp: Date.now()
                });
            } catch (e) {
                console.error('[RankingManager] 上报成绩失败:', e);
            }
        }
    }

    /**
     * 是否正在显示排行榜
     */
    isShowing(): boolean {
        return this._isShowing;
    }
}