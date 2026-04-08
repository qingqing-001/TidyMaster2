import { CHAPTER_4_LEVELS } from '../assets/scripts/data/chapter4Levels';
import { getAllLevels, getChapterLevels, getLevelConfig, LEVEL_MAP } from '../assets/scripts/data/levels';
import { LevelDataConfig, LevelItemConfig, LevelSlotConfig } from '../assets/scripts/data/types';

function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}

function unique<T>(values: T[]): T[] {
    return Array.from(new Set(values));
}

function validateLevel(level: LevelDataConfig): void {
    assert(level.chapter === 4, `关卡 ${level.id} chapter 不是 4`);
    assert(level.id >= 401 && level.id <= 411, `关卡 ${level.id} 不在 401-411 范围内`);

    const slotIds = new Set(level.slots.map((slot: LevelSlotConfig) => slot.id));
    const itemIds = level.items.map((item: LevelItemConfig) => item.id);
    const levelOps = new Set(level.operations);

    assert(unique(itemIds).length === itemIds.length, `关卡 ${level.id} 存在重复 item id`);
    assert(unique(level.slots.map((slot: LevelSlotConfig) => slot.id)).length === level.slots.length, `关卡 ${level.id} 存在重复 slot id`);
    assert(level.items.length > 0, `关卡 ${level.id} 没有 items`);
    assert(level.slots.length > 0, `关卡 ${level.id} 没有 slots`);
    assert(level.operations.length > 0, `关卡 ${level.id} 没有 operations`);
    assert(level.starThresholds[0] < level.starThresholds[1] && level.starThresholds[1] <= level.starThresholds[2] && level.starThresholds[2] === 100, `关卡 ${level.id} 星级阈值非法`);

    for (const item of level.items) {
        assert(slotIds.has(item.targetSlotId), `关卡 ${level.id} 的物品 ${item.id} 指向不存在的 slot ${item.targetSlotId}`);
        assert(levelOps.has(item.operation), `关卡 ${level.id} 的物品 ${item.id} 操作 ${item.operation} 未出现在 operations 中`);

        const slot = level.slots.find((candidate: LevelSlotConfig) => candidate.id === item.targetSlotId);
        assert(!!slot, `关卡 ${level.id} 的物品 ${item.id} 缺少目标 slot`);
        assert(slot!.acceptTypes.includes(item.type), `关卡 ${level.id} 的物品 ${item.id} 类型 ${item.type} 不被 slot ${slot!.id} 接受`);
    }

    assert(level.isBoss === (level.id === 411), `关卡 ${level.id} 的 Boss 标记与 id 不一致`);
}

function main(): void {
    assert(CHAPTER_4_LEVELS.length === 11, `第4章关卡数量异常：${CHAPTER_4_LEVELS.length}`);

    const chapter4Ids = CHAPTER_4_LEVELS.map(level => level.id).sort((a, b) => a - b);
    const expectedIds = Array.from({ length: 11 }, (_, index) => 401 + index);
    assert(JSON.stringify(chapter4Ids) === JSON.stringify(expectedIds), `第4章 id 覆盖不完整：${chapter4Ids.join(', ')}`);

    let previousFirstStar = 0;
    for (const level of CHAPTER_4_LEVELS) {
        validateLevel(level);
        assert(getLevelConfig(level.id) === level, `getLevelConfig(${level.id}) 未返回 chapter4 原始对象`);
        assert(level.starThresholds[0] >= previousFirstStar, `关卡 ${level.id} 难度递进异常：首星阈值未非递减`);
        previousFirstStar = level.starThresholds[0];
    }

    const chapterLevels = getChapterLevels(4);
    assert(chapterLevels.length === 11, `getChapterLevels(4) 返回数量异常：${chapterLevels.length}`);
    assert(JSON.stringify(chapterLevels.map(level => level.id)) === JSON.stringify(CHAPTER_4_LEVELS.map(level => level.id)), 'getChapterLevels(4) 顺序或映射异常');

    const allLevels = getAllLevels();
    for (const id of expectedIds) {
        assert(allLevels.some(level => level.id === id), `getAllLevels() 缺少关卡 ${id}`);
        assert(id in LEVEL_MAP, `LEVEL_MAP 缺少索引 ${id}`);
    }

    const bossIds = CHAPTER_4_LEVELS.filter(level => level.isBoss).map(level => level.id);
    assert(bossIds.length === 1 && bossIds[0] === 411, `Boss 关异常：${bossIds.join(', ')}`);

    console.log('第4章关卡校验通过');
    console.log(JSON.stringify({
        ids: chapter4Ids,
        bossIds,
        totalChapter4Levels: CHAPTER_4_LEVELS.length,
        totalAllLevels: allLevels.length,
    }, null, 2));
}

main();
