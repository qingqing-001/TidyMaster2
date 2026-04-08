import { DataManager } from '../assets/scripts/core/DataManager';
import { EventManager } from '../assets/scripts/core/EventManager';
import { HomeScene } from '../assets/scripts/scenes/HomeScene';
import { GameScene } from '../assets/scripts/scenes/GameScene';
import { ResultScene } from '../assets/scripts/scenes/ResultScene';
import { GAME_EVENTS } from '../assets/data/constants';
import { getLevelConfig } from '../assets/scripts/data/levels';
import { AudioManager } from '../assets/scripts/audio/AudioManager';
import { Node } from 'cc';
import type { ChangeScenePayload, LevelCompletePayload } from '../assets/scripts/core/eventPayloads';

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

function formatLevel(levelId: number): string {
    return `level-${levelId.toString().padStart(3, '0')}`;
}

function createMinimalHomeSceneUi(): Pick<HomeScene, 'levelGrid' | 'coinLabel'> {
    const levelGrid = new Node('LevelGrid');
    const coinLabel = new Node('CoinLabel');
    return { levelGrid, coinLabel };
}

function resetSingletonState(): void {
    const audioManager = AudioManager.getInstance();
    audioManager.setEnabled(false);
}

function main(): void {
    global.localStorage = new MemoryStorage();
    resetSingletonState();

    const dataManager = DataManager.getInstance();
    dataManager.clearAllData();

    const eventManager = EventManager.getInstance();
    eventManager.clear();

    const homeScene = new HomeScene();
    Object.assign(homeScene, createMinimalHomeSceneUi());
    const gameScene = new GameScene();
    const resultScene = new ResultScene();

    const sceneTransitions: ChangeScenePayload[] = [];
    const loadSceneCalls: string[] = [];
    const completions: LevelCompletePayload[] = [];
    const coinEvents: Array<{ currentCoins: number; amount: number; type: string }> = [];

    eventManager.on<ChangeScenePayload>(GAME_EVENTS.CHANGE_SCENE, (payload) => {
        if (!payload) {
            return;
        }
        sceneTransitions.push(payload);
        loadSceneCalls.push(payload.sceneName);
    });
    eventManager.on<LevelCompletePayload>(GAME_EVENTS.LEVEL_COMPLETE, (payload) => {
        if (!payload) {
            return;
        }
        if (typeof payload.levelId !== 'number') {
            throw new Error('verify:main-loop 断言失败：LEVEL_COMPLETE.levelId 必须为 number');
        }
        if (typeof payload.stars !== 'number') {
            throw new Error('verify:main-loop 断言失败：LEVEL_COMPLETE.stars 必须为 number');
        }
        if (typeof payload.rewardCoins !== 'number') {
            throw new Error('verify:main-loop 断言失败：LEVEL_COMPLETE.rewardCoins 必须为 number');
        }
        if (payload.nextLevelId !== undefined && typeof payload.nextLevelId !== 'number') {
            throw new Error('verify:main-loop 断言失败：LEVEL_COMPLETE.nextLevelId 必须为 number | undefined');
        }
        completions.push(payload);
    });
    eventManager.on<{ currentCoins: number; amount: number; type: string }>(GAME_EVENTS.COIN_CHANGE, (payload) => {
        if (payload) {
            coinEvents.push(payload);
        }
    });

    homeScene.onLoad();
    resultScene.onLoad();
    resultScene.start();

    const startLevelId = 1;
    const levelConfig = getLevelConfig(startLevelId);
    assert(levelConfig, 'level 1 config missing');

    homeScene.enterLevel(startLevelId);

    const currentAfterEnter = dataManager.getProgress().currentLevelId;
    assert(currentAfterEnter === formatLevel(startLevelId), `expected entered level ${formatLevel(startLevelId)}, got ${currentAfterEnter}`);

    gameScene.onLevelComplete(3);

    assert(completions.length >= 1, `expected at least 1 completion, got ${completions.length}`);
    const completion = completions[0];
    const rewardCoins = levelConfig.rewards.baseCoin;
    const nextLevelId = startLevelId + 1;

    assert(completion.levelId === startLevelId, `expected levelId ${startLevelId}, got ${completion.levelId}`);
    assert(completion.rewardCoins === rewardCoins, `expected reward coins ${rewardCoins}, got ${completion.rewardCoins}`);
    assert(completion.nextLevelId === nextLevelId, `expected nextLevelId ${nextLevelId}, got ${completion.nextLevelId}`);

    resultScene.onBackHome();
    assert(sceneTransitions.length >= 3, `expected at least 3 scene transitions before entering next level, got ${sceneTransitions.length}`);
    assert(sceneTransitions[2].sceneName === 'Home', 'missing result -> home transition');
    assert(loadSceneCalls.length >= 3, `expected at least 3 scene dispatches before entering next level, got ${loadSceneCalls.length}`);
    assert(loadSceneCalls[2] === 'Home', 'missing dispatch for result -> home');

    homeScene.enterLevel(nextLevelId);

    const progress = dataManager.getProgress();
    const coins = dataManager.getCoins();

    assert(sceneTransitions.length >= 4, `expected at least 4 scene transitions, got ${sceneTransitions.length}`);
    assert(sceneTransitions[0].sceneName === 'Game' && sceneTransitions[0].levelId === 1, 'missing home -> game transition');
    assert(sceneTransitions[1].sceneName === 'Result', 'missing game -> result transition');
    assert(sceneTransitions[2].sceneName === 'Home', 'missing result -> home transition');
    assert(sceneTransitions[3].sceneName === 'Game' && sceneTransitions[3].levelId === 2, 'missing home -> next game transition');
    assert(loadSceneCalls.length >= 4, `expected at least 4 scene dispatches, got ${loadSceneCalls.length}`);
    assert(loadSceneCalls[0] === 'Game', 'missing dispatch for home -> game');
    assert(loadSceneCalls[1] === 'Result', 'missing dispatch for game -> result');
    assert(loadSceneCalls[2] === 'Home', 'missing dispatch for result -> home');
    assert(loadSceneCalls[3] === 'Game', 'missing dispatch for home -> next game');
    assert(coinEvents.some((event) => event.type === 'add' && event.amount === rewardCoins), 'coin reward event missing');
    assert(progress.currentLevelId === formatLevel(nextLevelId), `expected current level ${formatLevel(nextLevelId)}, got ${progress.currentLevelId}`);
    assert(coins === 100 + rewardCoins, `expected coins ${100 + rewardCoins}, got ${coins}`);

    console.log('主循环真实链路验证通过');
    console.log(JSON.stringify({
        startLevelId,
        completedLevelId: startLevelId,
        rewardCoins,
        nextLevelId,
        sceneTransitions,
        loadSceneCalls,
        completion,
        finalProgress: progress,
        finalCoins: coins,
        audioEnabled: AudioManager.getInstance().canPlay(),
    }, null, 2));
}

main();
