import { _decorator, Component, director, SceneAsset, Node, Graphics, Color, tween, UIOpacity, Canvas, view } from 'cc';
import { AudioManager } from '../audio/AudioManager';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { LevelManager } from '../gameplay/LevelManager';
import { GAME_CONFIG, GAME_EVENTS } from '../../data/constants';
import { PlatformAdapter } from '../platform/PlatformAdapter';
import { WxAdapter } from '../platform/WxAdapter';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
  private static instance: GameManager | null = null;

  private readonly eventManager = EventManager.getInstance();
  private readonly dataManager = DataManager.getInstance();
  private readonly audioManager = AudioManager.getInstance();
  private readonly levelManager = new LevelManager();
  private readonly platformAdapter: PlatformAdapter = new WxAdapter();

  // 场景过渡相关
  private fadeOverlay: Node | null = null;
  private isTransitioning: boolean = false;
  private readonly FADE_DURATION: number = 0.3; // 淡入淡出持续时间（秒）
  private readonly FADE_COLOR: Color = new Color(0, 0, 0, 255); // 黑色遮罩

  @property({ type: SceneAsset })
  public launchScene: SceneAsset | null = null;

  @property({ type: SceneAsset })
  public homeScene: SceneAsset | null = null;

  @property({ type: SceneAsset })
  public gameScene: SceneAsset | null = null;

  @property({ type: SceneAsset })
  public resultScene: SceneAsset | null = null;

  @property({ type: SceneAsset })
  public myRoomScene: SceneAsset | null = null;

  public static getInstance(): GameManager {
    if (GameManager.instance === null) {
      GameManager.instance = new GameManager();
    }

    return GameManager.instance;
  }

  public onLoad(): void {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // 监听场景切换事件
    this.eventManager.on(GAME_EVENTS.CHANGE_SCENE, this.onChangeScene, this);
  }

  public initialize(): void {
    const progress = this.dataManager.getProgress();
    this.audioManager.setEnabled(progress.soundEnabled);
    this.levelManager.loadLevel({
      id: progress.currentLevelId || '1',
      levelId: Number(progress.currentLevelId || 1),
      chapter: 1,
      name: 'Default Level',
      sceneName: 'default',
      items: [],
      slots: [],
      requiredItems: 3,
      operations: [],
    });
    this.eventManager.emit(GAME_EVENTS.GAME_INIT, {
      platform: this.platformAdapter.isWechat() ? 'wechat' : 'default',
      systemInfo: this.platformAdapter.getSystemInfo(),
    });
  }

  /**
   * 场景切换处理
   */
  private onChangeScene(sceneName?: string): void {
    if (sceneName) {
      this.loadScene(sceneName);
    }
  }

  /**
   * 加载场景
   * @param sceneName 场景名称
   */
  public loadScene(sceneName: string): void {
    // 播放切换音效
    this.audioManager.playSFX('ui_click');

    // 淡入淡出过渡效果
    this.transitionToScene(sceneName);
  }

  /**
   * 带过渡效果的场景切换
   * 1. 创建黑色遮罩层并淡入
   * 2. 加载新场景
   * 3. 遮罩层淡出
   */
  private transitionToScene(sceneName: string): void {
    if (this.isTransitioning) {
      console.warn('Transition already in progress, ignore duplicate request');
      return;
    }

    this.isTransitioning = true;

    // 创建遮罩层
    const overlay = this.createFadeOverlay();
    if (!overlay) {
      // 如果无法创建遮罩，直接加载场景
      this.doLoadScene(sceneName);
      return;
    }

    // 步骤1: 淡入遮罩 (从透明到黑色)
    tween(overlay)
      .to(this.FADE_DURATION, { opacity: 255 })
      .call(() => {
        // 步骤2: 遮罩完全显示后，加载新场景
        this.doLoadScene(sceneName, overlay);
      })
      .start();
  }

  /**
   * 创建场景过渡用的遮罩层
   */
  private createFadeOverlay(): Node | null {
    const scene = director.getScene();
    if (!scene) {
      console.error('No active scene found');
      return null;
    }

    // 查找Canvas节点
    const canvas = scene.getChildByName('Canvas');
    if (!canvas) {
      console.warn('Canvas not found, using root node');
    }

    const parent = canvas || scene;
    const overlay = new Node('FadeOverlay');
    
    // 添加Graphics组件用于绘制黑色矩形
    const graphics = overlay.addComponent(Graphics);
    if (graphics) {
      graphics.fillColor = this.FADE_COLOR;
      graphics.fillRect(0, 0, 2000, 2000); // 使用足够大的尺寸覆盖屏幕
    }

    // 添加UIOpacity组件用于控制透明度
    const uiOpacity = overlay.addComponent(UIOpacity);
    if (uiOpacity) {
      uiOpacity.opacity = 0; // 初始完全透明
    }

    // 设置位置到屏幕中心（相对于Canvas）
    const screenSize = view.getVisibleSize();
    overlay.setPosition(screenSize.width / 2, screenSize.height / 2, 0);
    overlay.setAnchorPoint(0.5, 0.5);

    parent.addChild(overlay);
    this.fadeOverlay = overlay;

    return overlay;
  }

  /**
   * 执行场景加载，加载完成后淡出遮罩
   */
  private doLoadScene(sceneName: string, overlay: Node | null = null): void {
    director.loadScene(sceneName, (err) => {
      if (err) {
        console.error(`Failed to load scene ${sceneName}:`, err);
        this.isTransitioning = false;
        // 移除遮罩层
        if (overlay && overlay.isValid) {
          overlay.destroy();
        }
        return;
      }

      console.log(`Scene ${sceneName} loaded successfully`);

      // 步骤3: 场景加载完成后，淡出遮罩
      if (overlay && overlay.isValid) {
        tween(overlay)
          .to(this.FADE_DURATION, { opacity: 0 })
          .call(() => {
            // 淡出完成后移除遮罩
            if (overlay && overlay.isValid) {
              overlay.destroy();
            }
            this.fadeOverlay = null;
            this.isTransitioning = false;
            
            // 触发场景加载完成事件
            this.eventManager.emit('scene-loaded', sceneName);
          })
          .start();
      } else {
        this.isTransitioning = false;
      }
    });
  }

  /**
   * 切换到启动场景
   */
  public goToLaunchScene(): void {
    this.loadScene('Launch');
  }

  /**
   * 切换到主界面
   */
  public goToHomeScene(): void {
    this.loadScene('Home');
  }

  /**
   * 切换到游戏场景
   */
  public goToGameScene(): void {
    this.loadScene('Game');
  }

  /**
   * 切换到结算场景
   */
  public goToResultScene(): void {
    this.loadScene('Result');
  }

  /**
   * 切换到我的房间场景
   */
  public goToMyRoomScene(): void {
    this.loadScene('MyRoom');
  }

  public getLevelManager(): LevelManager {
    return this.levelManager;
  }

  public onDestroy(): void {
    this.eventManager.off(GAME_EVENTS.CHANGE_SCENE, this.onChangeScene, this);
  }
}
