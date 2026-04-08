import { _decorator, Component, view } from 'cc';
import { isWx, shareAppMessage, getSystemInfoSync } from '../utils/WxUtil';
const { ccclass, property } = _decorator;

/**
 * 微信分享管理器
 * 处理微信小游戏分享功能，包括生成before/after对比图
 */
@ccclass('WxShareManager')
export class WxShareManager extends Component {
    private static _instance: WxShareManager;
    
    // 分享回调
    private _shareCallback: ((success: boolean) => void) | null = null;
    
    // 当前分享的图片临时路径
    private _tempImagePath: string = '';

    static get instance(): WxShareManager {
        if (!this._instance) {
            this._instance = new WxShareManager();
        }
        return this._instance;
    }

    private constructor() {
        super();
    }

    /**
     * 初始化分享管理器
     */
    init(): void {
        if (isWx()) {
            this.setupShareButton({});
            console.log('[WxShareManager] 初始化完成');
        }
    }

    /**
     * 分享关卡完成截图
     * @param levelId 关卡ID
     * @param stars 获得的星星数
     * @param beforeImage 整理前图片（Base64或资源路径）
     * @param afterImage 整理后图片（Base64或资源路径）
     */
    async shareLevelComplete(levelId: number, stars: number, beforeImage: string, afterImage: string): Promise<void> {
        console.log('[WxShareManager] 分享关卡完成:', levelId, stars);

        try {
            // 生成对比图
            const compareImagePath = await this.generateCompareImage(beforeImage, afterImage);
            
            // 构建分享文案
            const title = this.buildShareTitle(levelId, stars);
            
            // 调用分享接口
            this.doShare(title, compareImagePath, `pages/game/game?level=${levelId}`);
            
        } catch (error) {
            console.error('[WxShareManager] 分享失败:', error);
            // 即使失败也尝试分享
            this.doShare(`我通过了第${levelId}关，获得了${stars}星！`, '', `pages/game/game?level=${levelId}`);
        }
    }

    /**
     * 生成前后对比图
     * @param beforeImagePath 整理前图片路径
     * @param afterImagePath 整理后图片路径
     * @returns 生成图片的临时路径
     */
    private async generateCompareImage(beforeImagePath: string, afterImagePath: string): Promise<string> {
        // 在微信环境中，使用wx.createCanvas创建对比图
        if (isWx()) {
            return this.generateCompareImageForWx(beforeImagePath, afterImagePath);
        }
        
        // 非微信环境返回空字符串，使用默认分享图
        console.log('[WxShareManager] 非微信环境，使用默认分享图');
        return '';
    }

    /**
     * 为微信环境生成对比图
     */
    private generateCompareImageForWx(beforeImagePath: string, afterImagePath: string): Promise<string> {
        return new Promise((resolve) => {
            try {
                const wxAny = wx as any;
                
                // 创建离屏Canvas
                const canvas = wxAny.createCanvas();
                const ctx = canvas.getContext('2d');
                const width = canvas.width = 500;
                const height = canvas.height = 400;

                // 绘制背景
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);

                // 绘制标题
                ctx.fillStyle = '#333333';
                ctx.font = 'bold 24px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('收纳前后对比', width / 2, 40);

                // 绘制分隔线
                ctx.strokeStyle = '#CCCCCC';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(width / 2, 60);
                ctx.lineTo(width / 2, height - 60);
                ctx.stroke();

                // 绘制左侧"整理前"
                ctx.fillStyle = '#666666';
                ctx.font = '20px sans-serif';
                ctx.fillText('整理前', width / 4, 80);

                // 绘制右侧"整理后"
                ctx.fillText('整理后', width * 3 / 4, 80);

                // 绘制分割线（水平）
                ctx.beginPath();
                ctx.moveTo(20, height - 30);
                ctx.lineTo(width - 20, height - 30);
                ctx.stroke();

                // 绘制底部文字
                ctx.fillStyle = '#999999';
                ctx.font = '16px sans-serif';
                ctx.fillText('快来帮我打分吧~', width / 2, height - 10);

                // 注意：实际项目中，这里应该加载beforeImage和afterImage并绘制到Canvas上
                // 由于图片加载是异步的，这里简化处理
                
                // 导出为临时文件
                canvas.toTempFilePath({
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    destWidth: width,
                    destHeight: height,
                    success: (res: any) => {
                        console.log('[WxShareManager] 对比图生成成功:', res.tempFilePath);
                        resolve(res.tempFilePath);
                    },
                    fail: (err: any) => {
                        console.error('[WxShareManager] 对比图生成失败:', err);
                        resolve('');
                    }
                });
            } catch (error) {
                console.error('[WxShareManager] 生成对比图异常:', error);
                resolve('');
            }
        });
    }

    /**
     * 构建分享标题
     */
    private buildShareTitle(levelId: number, stars: number): string {
        const starEmoji = '⭐'.repeat(stars);
        const titles = [
            `我成功通过了第${levelId}关！${starEmoji}`,
            `收纳大师第${levelId}关完成！${starEmoji}`,
            `第${levelId}关获得${stars}星，快来挑战！`,
            `整理达人第${levelId}关展示${starEmoji}`,
        ];
        
        // 随机选择一个标题
        return titles[Math.floor(Math.random() * titles.length)];
    }

    /**
     * 执行分享
     */
    private doShare(title: string, imageUrl: string, path: string): void {
        if (isWx()) {
            const wxAny = wx as any;
            
            // 设置分享菜单
            if (typeof wxAny.updateShareMenu === 'function') {
                wxAny.updateShareMenu({
                    withShareTicket: true,
                    success: () => {
                        console.log('[WxShareManager] 分享菜单设置成功');
                    }
                });
            }

            // 触发分享
            wxAny.shareAppMessage({
                title: title,
                imageUrl: imageUrl,
                path: path,
                query: '',
                extra: {
                    videoPath: ''
                }
            });
            
            console.log('[WxShareManager] 分享已触发:', title);
        } else {
            console.log('[WxShareManager] 模拟分享:', { title, imageUrl, path });
        }
    }

    /**
     * 分享我的房间
     */
    async shareMyRoom(): Promise<void> {
        console.log('[WxShareManager] 分享我的房间');

        // 生成房间截图
        const roomImagePath = await this.generateRoomImage();
        
        // 分享
        this.doShare('快来参观我的收纳小屋~', roomImagePath, 'pages/room/room');
    }

    /**
     * 生成房间截图
     */
    private async generateRoomImage(): Promise<string> {
        // 类似generateCompareImage的实现
        return new Promise((resolve) => {
            if (!isWx()) {
                resolve('');
                return;
            }

            try {
                const wxAny = wx as any;
                const canvas = wxAny.createCanvas();
                const ctx = canvas.getContext('2d');
                const width = canvas.width = 500;
                const height = canvas.height = 400;

                // 绘制背景
                ctx.fillStyle = '#FFF8E7';
                ctx.fillRect(0, 0, width, height);

                // 绘制标题
                ctx.fillStyle = '#8B4513';
                ctx.font = 'bold 28px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('我的收纳小屋', width / 2, 50);

                // 绘制房间信息
                ctx.fillStyle = '#666666';
                ctx.font = '18px sans-serif';
                ctx.fillText('点击查看我的房间', width / 2, height / 2);

                canvas.toTempFilePath({
                    success: (res: any) => resolve(res.tempFilePath),
                    fail: () => resolve('')
                });
            } catch (e) {
                resolve('');
            }
        });
    }

    /**
     * 设置转发按钮
     */
    setupShareButton(buttonInfo: any): void {
        if (!isWx()) return;

        try {
            const wxAny = wx as any;
            
            // 启用分享
            if (typeof wxAny.showShareMenu === 'function') {
                wxAny.showShareMenu({
                    withShareTicket: true,
                    success: () => {
                        console.log('[WxShareManager] 分享菜单已显示');
                    },
                    fail: (err: any) => {
                        console.error('[WxShareManager] 显示分享菜单失败:', err);
                    }
                });
            }

            // 监听分享回调
            if (typeof wxAny.onShareAppMessage === 'function') {
                wxAny.onShareAppMessage(() => {
                    return {
                        title: '快来玩收纳大师吧~',
                        imageUrl: '',
                        path: 'pages/index/index'
                    };
                });
            }
        } catch (error) {
            console.error('[WxShareManager] 设置分享按钮失败:', error);
        }
    }

    /**
     * 监听分享回调（主动设置）
     */
    onShareAppMessage(callback: () => { title: string; imageUrl?: string; path?: string }): void {
        this._shareCallback = null;
        
        if (isWx()) {
            const wxAny = wx as any;
            if (typeof wxAny.onShareAppMessage === 'function') {
                wxAny.onShareAppMessage(callback);
            }
        }
    }

    /**
     * 手动触发分享（带回调）
     */
    shareWithCallback(callback: (success: boolean) => void): void {
        this._shareCallback = callback;
        
        if (isWx()) {
            const titles = [
                '快来帮我打分吧~',
                '收纳大师邀你挑战',
                '一起来整理房间吧'
            ];
            const title = titles[Math.floor(Math.random() * titles.length)];
            
            this.doShare(title, '', 'pages/index/index');
        } else {
            // 非微信环境模拟分享成功
            setTimeout(() => {
                if (this._shareCallback) {
                    this._shareCallback(true);
                    this._shareCallback = null;
                }
            }, 500);
        }
    }

    /**
     * 截图功能 - 用于生成分享图
     * @param node 需要截图的节点
     * @returns 截图的临时文件路径
     */
    async captureNode(node: any): Promise<string> {
        return new Promise((resolve) => {
            if (!isWx() || !node) {
                resolve('');
                return;
            }

            try {
                // 使用Canvas截图
                const wxAny = wx as any;
                const canvas = wxAny.createCanvas();
                const ctx = canvas.getContext('2d');
                
                // 这里简化处理，实际需要使用Cocos的RenderTexture
                canvas.toTempFilePath({
                    success: (res: any) => resolve(res.tempFilePath),
                    fail: () => resolve('')
                });
            } catch (e) {
                resolve('');
            }
        });
    }
}