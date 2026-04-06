import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 好友互动管理器
 * 处理好友助力、访问等功能
 */
@ccclass('FriendHelper')
export class FriendHelper extends Component {
    private static _instance: FriendHelper;

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
     * 赠送工具碎片给好友
     */
    sendToolFragment(friendId: string): void {
        // TODO: 调用微信API分享给好友
        // TODO: 记录赠送记录
    }

    /**
     * 接收好友赠送
     */
    receiveToolFragment(friendId: string): void {
        // TODO: 增加工具碎片
        // TODO: 显示感谢提示
    }

    /**
     * 访问好友房间
     */
    visitFriendRoom(friendId: string): void {
        // TODO: 加载好友房间数据
        // TODO: 显示好友房间
    }

    /**
     * 点赞好友房间
     */
    likeFriendRoom(friendId: string): void {
        // TODO: 提交点赞数据
    }
}
