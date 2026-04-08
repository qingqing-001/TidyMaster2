import { _decorator, Component, Node, Sprite, Label, Button, Color } from 'cc';
import { DataManager, PlayerProgress } from '../core/DataManager';
import { AudioManager } from '../audio/AudioManager';
import { EventManager } from '../core/EventManager';
import { GAME_EVENTS } from '../../data/constants';
import { getLevelConfig, CHAPTER_1_LEVELS } from '../data/levels';
import type { LevelDataConfig } from '../data/types';

const { ccclass, property } = _decorator;

/**
 * 主界面场景
 * 负责显示关卡选择、商店入口、社交功能等
 */
@ccclass('HomeScene')
export class HomeScene extends Component {
    // UI节点引用
    @property({ type: Node })
    public levelSelectPanel: Node | null = null;

    @property({ type: Node })
    public levelGrid: Node | null = null;

    @property({ type: Node })
    public startGameBtn: Node | null = null;

    @property({ type: Node })
    public dailyCheckinBtn: Node | null = null;

    @property({ type: Node })
    public shopBtn: Node | null = null;

    @property({ type: Node })
    public settingsBtn: Node | null = null;

    @property({ type: Node })
    public dailyCheckinPanel: Node | null = null;

    @property({ type: Node })
    public shopPanel: Node | null = null;

    @property({ type: Node })
    public settingsPanel: Node | null = null;

    // 数据
    private currentLevelId: number = 1;
    private playerProgress: PlayerProgress | null = null;
    private levelButtons: Node[] = [];

    onLoad() {
        // 初始化数据管理器
        this.playerProgress = DataManager.getInstance().getProgress();

        // 解析当前关卡ID
        const levelIdStr = this.playerProgress.currentLevelId;
        this.currentLevelId = parseInt(levelIdStr.replace('level-', '')) || 1;

        // 加载玩家进度
        this.loadPlayerProgress();

        // 显示关卡选择
        this.showLevelSelect();
    }

    start() {
        // 监听事件
        const eventManager = EventManager.getInstance();
        eventManager.on(GAME_EVENTS.LEVEL_COMPLETE, this.onLevelComplete);

        // 绑定按钮事件
        this.bindButtonEvents();

        // 检查是否显示每日签到弹窗
        this.checkDailyCheckin();
    }

    /**
     * 加载玩家进度
     */
    private loadPlayerProgress(): void {
        // 从DataManager获取玩家进度
        console.log('[HomeScene] 加载玩家进度，当前关卡:', this.currentLevelId);
    }

    /**
     * 显示关卡选择
     */
    private showLevelSelect(): void {
        if (!this.levelGrid) {
            console.warn('[HomeScene] levelGrid 节点未配置');
            return;
        }

        // 清空现有按钮
        this.levelGrid.removeAllChildren();
        this.levelButtons = [];

        // 获取第1章关卡（教学关）
        const levels = CHAPTER_1_LEVELS;

        // 为每个关卡创建按钮
        for (let i = 0; i < levels.length; i++) {
            const levelConfig = levels[i];
            this.createLevelButton(levelConfig, i);
        }
    }

    /**
     * 创建关卡按钮
     */
    private createLevelButton(levelConfig: LevelDataConfig, index: number): void {
        if (!this.levelGrid) return;

        // 创建按钮节点（使用代码创建，实际项目中应由prefab实例化）
        const levelBtn = new Node('LevelBtn_' + levelConfig.id);
        levelBtn.setParent(this.levelGrid);

        // 设置位置（网格布局：每行5个）
        const col = index % 5;
        const row = Math.floor(index / 5);
        const spacingX = 120;
        const spacingY = -120;
        const startX = -240;
        const startY = 100;

        levelBtn.setPosition(startX + col * spacingX, startY + row * spacingY, 0);

        // 添加按钮组件
        const button = levelBtn.addComponent(Button);

        // 添加图片组件（占位，实际应有sprite）
        const sprite = levelBtn.addComponent(Sprite);

        // 添加关卡号标签
        const labelNode = new Node('Label');
        labelNode.setParent(levelBtn);
        labelNode.setPosition(0, 0, 0);
        const label = labelNode.addComponent(Label);
        label.string = levelConfig.id.toString();
        label.fontSize = 32;

        // 标记已解锁的关卡
        const isUnlocked = levelConfig.id <= this.currentLevelId;
        this.updateLevelButtonState(levelBtn, isUnlocked, levelConfig.id === this.currentLevelId);

        // 绑定点击事件
        button.node.on('click', () => this.onLevelButtonClick(levelConfig.id), this);

        // 存储引用
        this.levelButtons.push(levelBtn);
    }

    /**
     * 更新关卡按钮状态
     */
    private updateLevelButtonState(btnNode: Node, isUnlocked: boolean, isCurrent: boolean): void {
        // 根据状态设置颜色
        // 已完成：绿色
        // 当前：蓝色
        // 未解锁：灰色
        const sprite = btnNode.getComponent(Sprite);
        if (sprite) {
            if (isCurrent) {
                sprite.color = new Color(100, 149, 237); // 蓝色 - 当前关卡
            } else if (isUnlocked) {
                sprite.color = new Color(144, 238, 144); // 绿色 - 已完成
            } else {
                sprite.color = new Color(128, 128, 128); // 灰色 - 未解锁
            }
        }
    }

    /**
     * 绑定按钮事件
     */
    private bindButtonEvents(): void {
        // 开始游戏按钮
        if (this.startGameBtn) {
            const btn = this.startGameBtn.getComponent(Button);
            if (btn) {
                btn.node.on('click', this.onStartGameClick, this);
            }
        }

        // 每日签到按钮
        if (this.dailyCheckinBtn) {
            const btn = this.dailyCheckinBtn.getComponent(Button);
            if (btn) {
                btn.node.on('click', this.onDailyCheckinClick, this);
            }
        }

        // 商店按钮
        if (this.shopBtn) {
            const btn = this.shopBtn.getComponent(Button);
            if (btn) {
                btn.node.on('click', this.onShopClick, this);
            }
        }

        // 设置按钮
        if (this.settingsBtn) {
            const btn = this.settingsBtn.getComponent(Button);
            if (btn) {
                btn.node.on('click', this.onSettingsClick, this);
            }
        }
    }

    /**
     * 检查是否显示每日签到
     */
    private checkDailyCheckin(): void {
        // TODO: 检查是否可以签到，显示签到面板
    }

    // ==================== 按钮回调 ====================

    /**
     * 开始游戏按钮点击
     */
    private onStartGameClick(): void {
        console.log('[HomeScene] 开始游戏，点击关卡:', this.currentLevelId);
        
        // 切换到游戏场景
        this.enterLevel(this.currentLevelId);
    }

    /**
     * 每日签到按钮点击
     */
    private onDailyCheckinClick(): void {
        console.log('[HomeScene] 点击每日签到');
        // 显示签到面板
        this.showDailyCheckinPanel();
    }

    /**
     * 商店按钮点击
     */
    private onShopClick(): void {
        console.log('[HomeScene] 点击商店');
        // 显示商店面板
        this.showShopPanel();
    }

    /**
     * 设置按钮点击
     */
    private onSettingsClick(): void {
        console.log('[HomeScene] 点击设置');
        // 显示设置面板
        this.showSettingsPanel();
    }

    /**
     * 关卡按钮点击
     */
    private onLevelButtonClick(levelId: number): void {
        console.log('[HomeScene] 选择关卡:', levelId);

        // 检查关卡是否解锁
        if (levelId > this.currentLevelId) {
            console.log('[HomeScene] 关卡未解锁');
            return;
        }

        // 更新当前选中的关卡
        this.currentLevelId = levelId;

        // 更新按钮状态
        this.updateAllLevelButtons();
    }

    /**
     * 更新所有关卡按钮状态
     */
    private updateAllLevelButtons(): void {
        for (let i = 0; i < this.levelButtons.length; i++) {
            const btn = this.levelButtons[i];
            const levelId = i + 1; // 关卡ID从1开始
            this.updateLevelButtonState(btn, levelId <= this.currentLevelId, levelId === this.currentLevelId);
        }
    }

    // ==================== 面板显示/隐藏 ====================

    /**
     * 显示每日签到面板
     */
    private showDailyCheckinPanel(): void {
        if (this.dailyCheckinPanel) {
            this.dailyCheckinPanel.active = true;
        }
    }

    /**
     * 隐藏每日签到面板
     */
    public hideDailyCheckinPanel(): void {
        if (this.dailyCheckinPanel) {
            this.dailyCheckinPanel.active = false;
        }
    }

    /**
     * 显示商店面板
     */
    private showShopPanel(): void {
        if (this.shopPanel) {
            this.shopPanel.active = true;
        }
    }

    /**
     * 隐藏商店面板
     */
    public hideShopPanel(): void {
        if (this.shopPanel) {
            this.shopPanel.active = false;
        }
    }

    /**
     * 显示设置面板
     */
    private showSettingsPanel(): void {
        if (this.settingsPanel) {
            this.settingsPanel.active = true;
        }
    }

    /**
     * 隐藏设置面板
     */
    public hideSettingsPanel(): void {
        if (this.settingsPanel) {
            this.settingsPanel.active = false;
        }
    }

    // ==================== 公共方法 ====================

    /**
     * 进入关卡
     */
    public enterLevel(levelId: number): void {
        console.log('[HomeScene] 进入关卡:', levelId);

        // 更新当前关卡
        this.currentLevelId = levelId;
        DataManager.getInstance().setCurrentLevel('level-' + levelId.toString().padStart(3, '0'));

        // 发送切换场景事件
        const eventManager = EventManager.getInstance();
        eventManager.emit(GAME_EVENTS.CHANGE_SCENE, { 
            sceneName: 'GameScene',
            levelId: levelId 
        });
    }

    /**
     * 关卡完成回调
     */
    private onLevelComplete(data?: { levelId: number, stars: number }): void {
        if (!data) return;
        
        console.log('[HomeScene] 关卡完成:', data.levelId, '星级:', data.stars);

        // 更新玩家进度
        const nextLevelId = data.levelId + 1;
        
        // 检查下一关是否解锁
        const nextLevelConfig = getLevelConfig(nextLevelId);
        if (nextLevelConfig) {
            // 解锁下一关
            if (nextLevelId > this.currentLevelId) {
                this.currentLevelId = nextLevelId;
            }
            // 刷新关卡选择界面
            this.showLevelSelect();
        } else {
            console.log('[HomeScene] 已通关所有关卡');
        }
    }

    /**
     * 打开合成面板
     */
    public openMergePanel(): void {
        console.log('[HomeScene] 打开合成面板');
        // 发送打开合成面板事件
        const eventManager = EventManager.getInstance();
        eventManager.emit(GAME_EVENTS.OPEN_MERGE_PANEL, {});
    }

    /**
     * 打开商店
     */
    public openShop(): void {
        console.log('[HomeScene] 打开商店');
        this.showShopPanel();
    }

    /**
     * 销毁时清理
     */
    onDestroy() {
        // 移除事件监听
        const eventManager = EventManager.getInstance();
        eventManager.off(GAME_EVENTS.LEVEL_COMPLETE, this.onLevelComplete);
    }
}