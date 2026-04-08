import { _decorator, Component, Node } from 'cc';
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
export class RankingManager extends Component {
    private static _instance: RankingManager;
    
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

    static get instance(): RankingManager {
        if (!this._instance) {
            this._instance = new RankingManager();
        }
        return this._instance;
    }

    private constructor() {
        super();
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
            // 非微信环境模拟
            console.log('[RankingManager] 模拟上传分数:', key, value);
            this._rankingData.push({
                openId: 'mock_user_' + Date.now(),
                nickname: this._userInfo?.nickName || '玩家',
                avatarUrl: this._userInfo?.avatarUrl || '',
                score: value,
                rank: this._rankingData.length + 1
            });
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
            // 非微信环境显示模拟数据
            this.showMockRanking();
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
                    
                    // 模拟收到数据（实际需要通过消息接收）
                    setTimeout(() => {
                        // 这里应该通过开放域返回的数据来更新
                        // 暂时使用本地模拟数据
                        this._rankingData = this.getMockRankingData();
                        resolve();
                    }, 500);
                } else {
                    this._rankingData = this.getMockRankingData();
                    resolve();
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 获取模拟排行榜数据
     */
    private getMockRankingData(): RankData[] {
        return [
            { openId: 'user1', nickname: '收纳小能手', avatarUrl: '', score: 50, rank: 1 },
            { openId: 'user2', nickname: '整理达人', avatarUrl: '', score: 45, rank: 2 },
            { openId: 'user3', nickname: '清洁大师', avatarUrl: '', score: 40, rank: 3 },
            { openId: 'user4', nickname: '房间整理师', avatarUrl: '', score: 35, rank: 4 },
            { openId: 'user5', nickname: '强迫症患者', avatarUrl: '', score: 30, rank: 5 },
        ];
    }

    /**
     * 显示模拟排行榜
     */
    private showMockRanking(): void {
        this._rankingData = this.getMockRankingData();
        
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
                return this.getMockRankingData();
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
            return this.getMockRankingData();
        }

        try {
            const wxAny = wx as any;
            
            if (typeof wxAny.getOpenDataContext === 'function') {
                const openDataContext = wxAny.getOpenDataContext();
                
                openDataContext.postMessage({
                    type: 'GET_GROUP_RANKING',
                    groupId: groupId
                });
                
                return this.getMockRankingData();
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