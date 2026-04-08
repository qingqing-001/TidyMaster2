import { getAllLevels, getChapterLevels } from '../assets/scripts/data/levels';
import { OperationType } from '../assets/scripts/data/LevelData';

function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}

function main(): void {
    const allLevels = getAllLevels();
    const chapters = [1, 2, 3, 4, 5, 6].map(chapter => ({
        chapter,
        levels: getChapterLevels(chapter),
    }));

    const summary = chapters.map(({ chapter, levels }) => ({
        chapter,
        count: levels.length,
        bosses: levels.filter(level => level.isBoss).map(level => level.id),
        operations: Array.from(new Set(levels.flatMap(level => level.operations))),
    }));

    assert(allLevels.length >= 30, `总关卡不足30，当前 ${allLevels.length}`);
    assert(chapters.every(({ levels }) => levels.length >= 5), '存在章节少于5关，递进结构不足');
    assert(summary.find(item => item.chapter === 1)?.operations.includes(OperationType.DRAG), '第1章缺少 DRAG 教学');
    assert(summary.find(item => item.chapter === 2)?.operations.includes(OperationType.WIPE), '第2章缺少 WIPE 递进');
    assert(summary.find(item => item.chapter === 3)?.operations.includes(OperationType.FOLD), '第3章缺少 FOLD 递进');
    assert(summary.find(item => item.chapter === 4)?.operations.includes(OperationType.DRAG), '第4章缺少摆放主操作');
    assert(summary.find(item => item.chapter === 5)?.operations.includes(OperationType.ROTATE), '第5章缺少 ROTATE 递进');
    assert(summary.find(item => item.chapter === 6)?.operations.includes(OperationType.ROTATE), '第6章缺少综合 ROTATE');
    assert(summary.filter(item => item.bosses.length > 0).length >= 5, 'Boss 分布不足');

    console.log('章节递进校验通过');
    console.log(JSON.stringify({
        totalLevels: allLevels.length,
        summary,
        progression: [
            '第1章：拖拽教学',
            '第2章：擦洗+归位',
            '第3章：折叠专章',
            '第4章：冰箱空间摆放',
            '第5章：浴室擦洗/归类/管道旋转',
            '第6章：混合操作综合Boss',
        ],
    }, null, 2));
}

main();
