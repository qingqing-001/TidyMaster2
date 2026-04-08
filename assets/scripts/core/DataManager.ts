import { GAME_EVENTS } from '../../data/constants';
import { EventManager } from './EventManager';

// Player progress data interface
export interface PlayerProgress {
  currentLevelId: string;
  soundEnabled: boolean;
}

// Storage key constants
const STORAGE_KEYS = {
  PLAYER_PROGRESS: 'tidy_master_progress',
  COINS: 'tidy_master_coins',
  CHECKIN_DATA: 'tidy_master_checkin',
};

export class DataManager {
  private static instance: DataManager | null = null;
  private progress: PlayerProgress = {
    currentLevelId: 'level-001',
    soundEnabled: true,
  };
  private _coins: number = 0;

  public static getInstance(): DataManager {
    if (DataManager.instance === null) {
      DataManager.instance = new DataManager();
    }

    return DataManager.instance;
  }

  constructor() {
    this.loadCoins();
  }

  public getProgress(): PlayerProgress {
    return { ...this.progress };
  }

  public setCurrentLevel(levelId: string): void {
    this.progress.currentLevelId = levelId;
    this.saveProgress();
  }

  public setSoundEnabled(enabled: boolean): void {
    this.progress.soundEnabled = enabled;
    this.saveProgress();
  }

  // ==================== 金币系统 ====================

  /**
   * 获取金币数量
   */
  public getCoins(): number {
    return this._coins;
  }

  /**
   * 添加金币
   * @param amount 金币数量
   */
  public addCoins(amount: number): void {
    if (amount <= 0) return;
    
    this._coins += amount;
    this.saveCoins();
    
    // 发送金币变化事件
    const eventManager = EventManager.getInstance();
    eventManager.emit(GAME_EVENTS.COIN_CHANGE, {
      amount: amount,
      currentCoins: this._coins,
      type: 'add',
    });
    
    console.log(`[DataManager] 添加金币: ${amount}, 当前金币: ${this._coins}`);
  }

  /**
   * 扣除金币
   * @param amount 金币数量
   * @returns 是否扣除成功
   */
  public deductCoins(amount: number): boolean {
    if (amount <= 0) return false;
    if (this._coins < amount) {
      console.log(`[DataManager] 金币不足: 需要 ${amount}, 当前 ${this._coins}`);
      return false;
    }

    this._coins -= amount;
    this.saveCoins();

    // 发送金币变化事件
    const eventManager = EventManager.getInstance();
    eventManager.emit(GAME_EVENTS.COIN_CHANGE, {
      amount: amount,
      currentCoins: this._coins,
      type: 'deduct',
    });

    console.log(`[DataManager] 扣除金币: ${amount}, 当前金币: ${this._coins}`);
    return true;
  }

  /**
   * 设置金币数量
   * @param amount 金币数量
   */
  public setCoins(amount: number): void {
    if (amount < 0) amount = 0;
    this._coins = amount;
    this.saveCoins();
    
    const eventManager = EventManager.getInstance();
    eventManager.emit(GAME_EVENTS.COIN_CHANGE, {
      amount: 0,
      currentCoins: this._coins,
      type: 'set',
    });
  }

  // ==================== 本地存储 ====================

  /**
   * 保存玩家进度
   */
  private saveProgress(): void {
    try {
      const data = JSON.stringify(this.progress);
      localStorage.setItem(STORAGE_KEYS.PLAYER_PROGRESS, data);
    } catch (e) {
      console.error('[DataManager] 保存进度失败:', e);
    }
  }

  /**
   * 加载玩家进度
   */
  private loadProgress(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYER_PROGRESS);
      if (data) {
        this.progress = { ...this.progress, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('[DataManager] 加载进度失败:', e);
    }
  }

  /**
   * 保存金币到本地存储
   */
  private saveCoins(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COINS, this._coins.toString());
    } catch (e) {
      console.error('[DataManager] 保存金币失败:', e);
    }
  }

  /**
   * 从本地存储加载金币
   */
  private loadCoins(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COINS);
      if (data) {
        this._coins = parseInt(data, 10) || 0;
      } else {
        // 首次游戏，给予初始金币
        this._coins = 100;
        this.saveCoins();
      }
    } catch (e) {
      console.error('[DataManager] 加载金币失败:', e);
      this._coins = 100;
    }
  }

  // ==================== 签到数据管理 ====================

  /**
   * 保存签到数据
   */
  public saveCheckinData(data: object): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKIN_DATA, JSON.stringify(data));
    } catch (e) {
      console.error('[DataManager] 保存签到数据失败:', e);
    }
  }

  /**
   * 加载签到数据
   */
  public loadCheckinData(): object | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECKIN_DATA);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('[DataManager] 加载签到数据失败:', e);
    }
    return null;
  }

  // ==================== 清理数据 ====================

  /**
   * 清空所有数据（用于测试或重置游戏）
   */
  public clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PLAYER_PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.COINS);
      localStorage.removeItem(STORAGE_KEYS.CHECKIN_DATA);
      
      // 重置为默认值
      this.progress = {
        currentLevelId: 'level-001',
        soundEnabled: true,
      };
      this._coins = 100;
      
      console.log('[DataManager] 所有数据已清空');
    } catch (e) {
      console.error('[DataManager] 清空数据失败:', e);
    }
  }
}
