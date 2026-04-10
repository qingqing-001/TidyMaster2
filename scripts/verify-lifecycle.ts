import { GameManager } from '../assets/scripts/core/GameManager';
import { LevelManager } from '../assets/scripts/gameplay/LevelManager';
import { EventManager } from '../assets/scripts/core/EventManager';
import { DataManager } from '../assets/scripts/core/DataManager';
import { AudioManager } from '../assets/scripts/audio/AudioManager';
import { GAME_EVENTS } from '../assets/data/constants';

declare const global: {
  localStorage?: Storage;
};

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  public get length(): number {
    return this.store.size;
  }

  public clear(): void {
    this.store.clear();
  }

  public getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  public key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  public removeItem(key: string): void {
    this.store.delete(key);
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function resetRuntime(): void {
  global.localStorage = new MemoryStorage();
  EventManager.getInstance().clear();
  DataManager.getInstance().clearAllData();
  const audioManager = AudioManager.getInstance();
  audioManager.setEnabled(false);
  audioManager.onLoad = () => undefined;
  (audioManager as unknown as { preloadStarted: boolean }).preloadStarted = true;
}

function main(): void {
  resetRuntime();

  let emittedInitPayload: unknown;
  EventManager.getInstance().on(GAME_EVENTS.GAME_INIT, (payload) => {
    emittedInitPayload = payload;
  });

  let missingInstanceError: unknown;
  try {
    GameManager.getInstance();
  } catch (error) {
    missingInstanceError = error;
  }

  assert(missingInstanceError instanceof Error, '应在未挂载 GameManager 时抛出明确错误');

  const gameManager = GameManager.createForTesting();
  gameManager.onLoad();
  gameManager.initialize();

  const singletonManager = GameManager.getInstance();
  const levelManager = LevelManager.getInstance();
  const progress = DataManager.getInstance().getProgress();
  const currentLevel = levelManager.getCurrentLevel();

  assert(singletonManager === gameManager, 'GameManager.getInstance 应返回已挂载运行时实例');
  assert(currentLevel !== null, 'initialize 后应完成默认关卡装载');
  assert(currentLevel?.levelId === 1, `默认关卡编号应为 1，实际为 ${currentLevel?.levelId}`);
  assert(progress.currentLevelId === 'level-001', `默认进度应为 level-001，实际为 ${progress.currentLevelId}`);
  assert(emittedInitPayload !== undefined, 'initialize 应发出 GAME_INIT 事件');

  gameManager.onDestroy();

  console.log('生命周期/初始化自检通过');
  console.log(JSON.stringify({
    runtimeSingletonBound: singletonManager === gameManager,
    levelManagerSingletonBound: levelManager === LevelManager.getInstance(),
    currentLevel,
    progress,
    emittedInitPayload,
  }, null, 2));
}

main();
