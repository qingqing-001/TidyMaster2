import { _decorator, Component, director, SceneAsset } from 'cc';
import { AudioManager } from '../audio/AudioManager';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { LevelManager } from '../gameplay/LevelManager';
import { GAME_CONFIG, GAME_EVENTS } from '../../data/Constants';
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
      id: progress.currentLevelId || 1,
      name: 'Default Level',
      items: [],
      slots: [],
      requiredItems: 3,
    });
    this.eventManager.emit(GAME_EVENTS.GAME_INIT, {
      platform: this.platformAdapter.isWechat() ? 'wechat' : 'default',
      systemInfo: this.platformAdapter.getSystemInfo(),
    });
  }

  /**
   * 场景切换处理
   */
  private onChangeScene(sceneName: string): void {
    this.loadScene(sceneName);
  }

  /**
   * 加载场景
   * @param sceneName 场景名称
   */
  public loadScene(sceneName: string): void {
    // 播放切换音效
    this.audioManager.playSfx('ui_click');

    // 淡入淡出过渡效果
    this.transitionToScene(sceneName);
  }

  /**
   * 带过渡效果的场景切换
   */
  private transitionToScene(sceneName: string): void {
    director.once('director:after-scene-start', () => {
      // 场景加载完成后可以添加后处理效果
    });

    // 使用淡入淡出过渡
    director.loadScene(sceneName, (err) => {
      if (err) {
        console.error(`Failed to load scene ${sceneName}:`, err);
        return;
      }
      console.log(`Scene ${sceneName} loaded successfully`);
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
