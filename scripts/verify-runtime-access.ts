import { CHAPTER_5_LEVELS } from '../assets/scripts/data/chapter5Levels';
import { CHAPTER_6_LEVELS } from '../assets/scripts/data/chapter6Levels';
import { getAllLevels, getLevelConfig } from '../assets/scripts/data/levels';
import { OperationType } from '../assets/scripts/data/LevelData';

declare const require: any;
declare const process: any;
const fs = require('fs');
const path = require('path');

function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}

function main(): void {
    const repoRoot = process.cwd();
    const gameSceneSource = fs.readFileSync(path.resolve(repoRoot, 'assets/scripts/scenes/GameScene.ts'), 'utf8');
    const homeSceneSource = fs.readFileSync(path.resolve(repoRoot, 'assets/scripts/scenes/HomeScene.ts'), 'utf8');

    assert(gameSceneSource.includes('case OperationType.ROTATE'), 'GameScene 未接入 ROTATE 分支');
    assert(gameSceneSource.includes('setupRotateItem'), 'GameScene 未实现 setupRotateItem');
    assert(gameSceneSource.includes('GAME_EVENTS.OPERATION_COMPLETE'), 'ROTATE 未走完成事件流');
    assert(homeSceneSource.includes('getAllLevels()'), 'HomeScene 未改为全量关卡列表');

    const allLevels = getAllLevels();
    assert(allLevels.length >= 30, `总关卡不足30，当前 ${allLevels.length}`);

    const rotateLevels = [...CHAPTER_5_LEVELS, ...CHAPTER_6_LEVELS].filter(level =>
        level.operations.includes(OperationType.ROTATE)
    );
    assert(rotateLevels.length > 0, '第5/6章未找到 ROTATE 关卡');

    for (const level of rotateLevels) {
        const runtimeLevel = getLevelConfig(level.id);
        assert(runtimeLevel !== undefined, `关卡 ${level.id} 未接入 levels.ts`);
        const rotateItems = runtimeLevel?.items.filter(item => item.operation === OperationType.ROTATE) ?? [];
        assert(rotateItems.length > 0, `关卡 ${level.id} 缺少 ROTATE 物品`);
    }

    const levelIds = allLevels.map(level => level.id);
    assert(levelIds.includes(401) && levelIds.includes(505) && levelIds.includes(611), '第4-6章关键关卡未出现在可选列表中');

    console.log('运行时接入校验通过');
    console.log(JSON.stringify({
        totalLevels: allLevels.length,
        rotateLevels: rotateLevels.map(level => level.id),
        sampleAccessibleLevels: [401, 505, 611],
    }, null, 2));
}

main();
