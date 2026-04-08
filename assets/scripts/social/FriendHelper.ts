import { _decorator, Component, Node } from 'cc';
import { isWx, shareAppMessage, getUserInfo, UserInfo, showToast, showModal } from '../utils/WxUtil';
import { RankingManager, RankData } from './RankingManager';
const { ccclass, property } = _decorator;

/**
 * 好友互动管理器
 * 处理好友助力、访问等功能
 */
@ccclass('FriendHelper')
export class FriendHelper extends Component {
    private static _instance: FriendHelper;
    
    // 好友列表缓存
    private _friendList: RankData[] = [];
    
    // 赠送记录缓存
    private _giftRecords: Map<string, number> = new Map();
    
    // 点赞记录缓存
    private _likeRecords: Map<string, number> = new Map();

    static get instance(): FriendHelper {
        if (!this._instance) {
            this._instance = new FriendHelper();
        }
        return this._instance;
    }

    private constructor() {
        super();
    }

    /**
     * 初始化好友助手
     */
    async init(): Promise<void> {
        console.log('[FriendHelper] 初始化');
        
        if (isWx()) {
            // 加载好友列表
            await this.loadFriendList();
            
            // 加载赠送记录
            this.loadGiftRecords();
            
            // 加载点赞记录
            this.loadLikeRecords();
        }
    }

    /**
     * 加载好友列表
     */
    private async loadFriendList(): Promise<void> {
        try {
            const rankingManager = RankingManager.instance;
            this._friendList = await rankingManager.getFriendList();
            console.log('[FriendHelper] 好友列表加载成功:', this._friendList.length);
        } catch (e) {
            console.error('[FriendHelper] 加载好友列表失败:', e);
        }
    }

    /**
     * 加载赠送记录
     */
    private loadGiftRecords(): void {
        if (!isWx()) return;
        
        try {
            const records = wx.getStorageSync('gift_records');
            if (records) {
                this._giftRecords = new Map(Object.entries(records));
            }
        } catch (e) {
            console.error('[FriendHelper] 加载赠送记录失败:', e);
        }
    }

    /**
     * 保存赠送记录
     */
    private saveGiftRecords(): void {
        if (!isWx()) return;
        
        try {
            const records = Object.fromEntries(this._giftRecords);
            wx.setStorageSync('gift_records', JSON.stringify(records));
        } catch (e) {
            console.error('[FriendHelper] 保存赠送记录失败:', e);
        }
    }

    /**
     * 加载点赞记录
     */
    private loadLikeRecords(): void {
        if (!isWx()) return;
        
        try {
            const records = wx.getStorageSync('like_records');
            if (records) {
                this._likeRecords = new Map(Object.entries(records));
            }
        } catch (e) {
            console.error('[FriendHelper] 加载点赞记录失败:', e);
        }
    }

    /**
     * 保存点赞记录
     */
    private saveLikeRecords(): void {
        if (!isWx()) return;
        
        try {
            const records = Object.fromEntries(this._likeRecords);
            wx.setStorageSync('like_records', JSON.stringify(records));
        } catch (e) {
            console.error('[FriendHelper] 保存点赞记录失败:', e);
        }
    }

    /**
     * 赠送工具碎片给好友
     * @param friendId 好友ID
     * @param fragmentType 碎片类型（可选，默认1）
     */
    async sendToolFragment(friendId: string, fragmentType: number = 1): Promise<boolean> {
        console.log('[FriendHelper] 赠送工具碎片给好友:', friendId, fragmentType);
        
        // 检查是否已经赠送过
        const lastSendTime = this._giftRecords.get(friendId) || 0;
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        
        if (now - lastSendTime < ONE_DAY) {
            showToast('今天已经给这位好友送过礼物了~');
            return false;
        }

        if (!isWx()) {
            // 非微信环境模拟
            this._giftRecords.set(friendId, now);
            this.saveGiftRecords();
            showToast('已赠送工具碎片给好友~');
            return true;
        }

        try {
            // 使用分享功能赠送
            const wxAny = wx as any;
            
            if (typeof wxAny.shareAppMessage === 'function') {
                // 设置带有参数的分享
                wxAny.shareAppMessage({
                    title: '帮我收下这个工具碎片~',
                    imageUrl: '',
                    query: `action=gift&friendId=${friendId}&type=${fragmentType}`,
                    path: 'pages/index/index'
                });
                
                // 记录赠送时间
                this._giftRecords.set(friendId, now);
                this.saveGiftRecords();
                
                console.log('[FriendHelper] 赠送请求已发送');
                return true;
            }
        } catch (e) {
            console.error('[FriendHelper] 赠送工具碎片失败:', e);
        }
        
        return false;
    }

    /**
     * 接收好友赠送
     * @param friendId 好友ID
     */
    async receiveToolFragment(friendId: string): Promise<boolean> {
        console.log('[FriendHelper] 接收好友赠送:', friendId);
        
        if (!isWx()) {
            showToast('收到好友赠送的工具碎片！');
            return true;
        }

        try {
            // 获取好友信息
            const friend = this._friendList.find(f => f.openId === friendId);
            const friendName = friend?.nickname || '好友';
            
            // 增加工具碎片（通过DataManager）
            // const fragmentCount = DataManager.instance.getToolFragmentCount();
            // DataManager.instance.addToolFragmentCount(fragmentCount + 1);
            
            showToast(`收到${friendName}赠送的工具碎片！`);
            
            // 记录到本地存储
            this.addReceivedGift(friendId);
            
            return true;
        } catch (e) {
            console.error('[FriendHelper] 接收工具碎片失败:', e);
        }
        
        return false;
    }

    /**
     * 记录已接收的礼物
     */
    private addReceivedGift(friendId: string): void {
        if (!isWx()) return;
        
        try {
            const key = `received_gift_${friendId}`;
            const count = (wx.getStorageSync(key) || 0) + 1;
            wx.setStorageSync(key, count);
        } catch (e) {
            console.error('[FriendHelper] 记录接收礼物失败:', e);
        }
    }

    /**
     * 访问好友房间
     * @param friendId 好友ID
     */
    async visitFriendRoom(friendId: string): Promise<boolean> {
        console.log('[FriendHelper] 访问好友房间:', friendId);

        if (!isWx()) {
            showToast('访问好友房间功能需要微信环境');
            return false;
        }

        try {
            const wxAny = wx as any;
            
            // 通过开放域获取好友房间数据
            if (typeof wxAny.getOpenDataContext === 'function') {
                const openDataContext = wxAny.getOpenDataContext();
                
                openDataContext.postMessage({
                    type: 'GET_FRIEND_ROOM',
                    friendId: friendId
                });
                
                // 返回成功（实际房间数据会通过消息返回）
                showToast('正在加载好友房间...');
                return true;
            }
        } catch (e) {
            console.error('[FriendHelper] 访问好友房间失败:', e);
        }
        
        return false;
    }

    /**
     * 点赞好友房间
     * @param friendId 好友ID
     */
    async likeFriendRoom(friendId: string): Promise<boolean> {
        console.log('[FriendHelper] 点赞好友房间:', friendId);
        
        // 检查是否已经点赞过
        const lastLikeTime = this._likeRecords.get(friendId) || 0;
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        
        if (now - lastLikeTime < ONE_DAY) {
            showToast('今天已经给这位好友点过赞了~');
            return false;
        }

        if (!isWx()) {
            // 非微信环境模拟
            this._likeRecords.set(friendId, now);
            this.saveLikeRecords();
            showToast('点赞成功！');
            return true;
        }

        try {
            const wxAny = wx as any;
            
            if (typeof wxAny.getOpenDataContext === 'function') {
                const openDataContext = wxAny.getOpenDataContext();
                
                // 发送点赞
                openDataContext.postMessage({
                    type: 'LIKE_FRIEND_ROOM',
                    friendId: friendId,
                    timestamp: now
                });
                
                // 记录点赞时间
                this._likeRecords.set(friendId, now);
                this.saveLikeRecords();
                
                // 动画效果
                showToast('点赞成功！');
                return true;
            }
        } catch (e) {
            console.error('[FriendHelper] 点赞失败:', e);
        }
        
        return false;
    }

    /**
     * 获取好友列表
     */
    getFriendList(): RankData[] {
        return this._friendList;
    }

    /**
     * 刷新好友列表
     */
    async refreshFriendList(): Promise<void> {
        await this.loadFriendList();
    }

    /**
     * 检查今天是否已经赠送
     */
    hasSentGiftToday(friendId: string): boolean {
        const lastSendTime = this._giftRecords.get(friendId) || 0;
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        return (now - lastSendTime) < ONE_DAY;
    }

    /**
     * 检查今天是否已经点赞
     */
    hasLikedToday(friendId: string): boolean {
        const lastLikeTime = this._likeRecords.get(friendId) || 0;
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;
        return (now - lastLikeTime) < ONE_DAY;
    }

    /**
     * 发起好友助力（多人游戏用）
     */
    async requestFriendHelp(levelId: number): Promise<void> {
        console.log('[FriendHelper] 发起好友助力:', levelId);
        
        if (!isWx()) {
            showToast('需要微信环境才能发起助力');
            return;
        }

        const titles = [
            '快来帮我过关吧~',
            '需要你的帮助！',
            '一起完成收纳挑战'
        ];
        
        const title = titles[Math.floor(Math.random() * titles.length)];
        
        const wxAny = wx as any;
        if (typeof wxAny.shareAppMessage === 'function') {
            wxAny.shareAppMessage({
                title: title,
                imageUrl: '',
                query: `action=help&level=${levelId}`,
                path: 'pages/game/game'
            });
        }
    }

    /**
     * 处理分享带来的动作
     */
    handleShareAction(query: Record<string, string>): void {
        const action = query['action'];
        
        if (!action) return;
        
        console.log('[FriendHelper] 处理分享动作:', action);
        
        switch (action) {
            case 'gift':
                // 收到礼物
                const friendId = query['friendId'];
                const type = parseInt(query['type'] || '1', 10);
                if (friendId) {
                    this.receiveToolFragment(friendId);
                }
                break;
                
            case 'help':
                // 好友助力
                const levelId = query['level'];
                if (levelId) {
                    // 进入游戏帮助好友
                    showToast('准备帮助好友过关！');
                }
                break;
                
            default:
                console.log('[FriendHelper] 未知的分享动作:', action);
        }
    }

    /**
     * 显示好友选择器
     */
    async showFriendSelector(): Promise<string | null> {
        if (!isWx()) {
            showToast('好友选择器需要微信环境');
            return null;
        }
        
        // 在微信中可以使用wx.join1v1ChatRoom或其他API
        // 这里简化处理，返回null表示使用默认好友
        console.log('[FriendHelper] 显示好友选择器');
        
        // 模拟返回第一个好友
        if (this._friendList.length > 0) {
            return this._friendList[0].openId;
        }
        
        return null;
    }

    /**
     * 获取可赠送礼物的好友列表
     */
    getCanSendGiftFriends(): RankData[] {
        return this._friendList.filter(friend => !this.hasSentGiftToday(friend.openId));
    }

    /**
     * 获取可点赞的好友列表
     */
    getCanLikeFriends(): RankData[] {
        return this._friendList.filter(friend => !this.hasLikedToday(friend.openId));
    }
}