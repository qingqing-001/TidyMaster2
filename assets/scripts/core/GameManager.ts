import { AudioManager } from '../audio/AudioManager';
import { DataManager } from './DataManager';
import { EventManager } from './EventManager';
import { LevelManager } from '../gameplay/LevelManager';
import { GAME_CONFIG, GAME_EVENTS } from '../../data/constants';
import { PlatformAdapter } from '../platform/PlatformAdapter';
import { WxAdapter } from '../platform/WxAdapter';

export class GameManager {
  private static instance: GameManager | null = null;

  private readonly eventManager = EventManager.getInstance();
  private readonly dataManager = DataManager.getInstance();
  private readonly audioManager = AudioManager.getInstance();
  private readonly levelManager = new LevelManager();
  private readonly platformAdapter: PlatformAdapter = new WxAdapter();

  public static getInstance(): GameManager {
    if (GameManager.instance === null) {
      GameManager.instance = new GameManager();
    }

    return GameManager.instance;
  }

  public initialize(): void {
    const progress = this.dataManager.getProgress();
    this.audioManager.setEnabled(progress.soundEnabled);
    this.levelManager.loadLevel({
      id: progress.currentLevelId || GAME_CONFIG.DEFAULT_LEVEL_ID,
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

  public getLevelManager(): LevelManager {
    return this.levelManager;
  }
}
