import { _decorator, Component, Node, tween, v3, Vec3, UIOpacity } from 'cc';
import { MergeBoard } from '../merge/MergeBoard';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';

const { ccclass, property } = _decorator;

/**
 * 合成面板UI组件
 * 响应 OPEN_MERGE_PANEL 事件，显示3x4合成棋盘
 */
@ccclass('MergePanel')
export class MergePanel extends Component {
    @property({ type: Node })
    public mergeBoardNode: Node | null = null;

    @property({ type: Node })
    public closeBtn: Node | null = null;

    @property({ type: Node })
    public background: Node | null = null;

    private mergeBoard!: MergeBoard;
    private eventManager!: EventManager;
    private isVisible: boolean = false;

    onLoad() {
        this.eventManager = EventManager.getInstance();
        
        // 隐藏面板
        this.node.active = false;
        
        if (this.background) {
            this.background.active = false;
        }

        // 获取 MergeBoard 组件
        if (this.mergeBoardNode) {
            this.mergeBoard = this.mergeBoardNode.getComponent(MergeBoard) || this.mergeBoardNode.addComponent(MergeBoard);
        }
    }

    start() {
        // 监听打开合成面板事件
        this.eventManager.on(GAME_EVENTS.OPEN_MERGE_PANEL, this.onOpenMergePanel as any, this);

        // 绑定关闭按钮事件
        this.bindCloseButton();
    }

    /**
     * 打开合成面板
     */
    private onOpenMergePanel(): void {
        console.log('[MergePanel] 收到打开合成面板事件');
        this.show();
    }

    /**
     * 显示面板
     */
    public show(): void {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.node.active = true;
        
        if (this.background) {
            this.background.active = true;
            // 背景淡入
            const opacity = this.background.getComponent(UIOpacity);
            if (opacity) {
                opacity.opacity = 0;
                tween(opacity)
                    .to(0.2, { opacity: 180 })
                    .start();
            }
        }

        // 面板弹出动画
        this.node.setScale(0.8, 0.8, 1);
        tween(this.node)
            .to(0.3, { scale: v3(1, 1, 1) }, { easing: 'backOut' })
            .start();

        // 如果有MergeBoard，初始化工具
        if (this.mergeBoard) {
            this.initDefaultTools();
        }
        
        console.log('[MergePanel] 显示合成面板');
    }

    /**
     * 隐藏面板
     */
    public hide(): void {
        if (!this.isVisible) return;
        
        this.isVisible = false;

        // 面板收起动画
        tween(this.node)
            .to(0.2, { scale: v3(0.8, 0.8, 1) })
            .call(() => {
                this.node.active = false;
                if (this.background) {
                    this.background.active = false;
                }
            })
            .start();

        console.log('[MergePanel] 隐藏合成面板');
    }

    /**
     * 初始化默认工具（用于测试）
     */
    private initDefaultTools(): void {
        if (!this.mergeBoard) return;

        // 如果棋盘为空，添加一些默认工具
        if (this.mergeBoard.getAllTools().length === 0) {
            // 添加一个1级工具
            this.mergeBoard.addTool(1);
        }
    }

    /**
     * 绑定关闭按钮
     */
    private bindCloseButton(): void {
        if (this.closeBtn) {
            this.closeBtn.on(Node.EventType.TOUCH_START, this.onCloseClick, this);
            this.closeBtn.on('click', this.onCloseClick, this);
        }

        // 点击背景也可以关闭
        if (this.background) {
            this.background.on(Node.EventType.TOUCH_START, this.onCloseClick, this);
        }
    }

    /**
     * 关闭按钮点击
     */
    private onCloseClick(): void {
        this.hide();
    }

    /**
     * 获取 MergeBoard 实例
     */
    public getMergeBoard(): MergeBoard | null {
        return this.mergeBoard;
    }

    onDestroy() {
        this.eventManager.off(GAME_EVENTS.OPEN_MERGE_PANEL, this.onOpenMergePanel as any, this);
    }
}