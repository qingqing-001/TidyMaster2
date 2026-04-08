import { getAllLevels, getChapterLevels } from '../assets/scripts/data/levels';

function assert(condition: boolean, message: string): void {
    if (!condition) {
        throw new Error(message);
    }
}

interface ChapterSummary {
    chapter: number;
    totalLevels: number;
    bossLevels: number;
}

function main(): void {
    const allLevels = getAllLevels();
    const chapterIds = Array.from(new Set(allLevels.map(level => level.chapter))).sort((a, b) => a - b);
    const summaries: ChapterSummary[] = chapterIds.map(chapter => {
        const chapterLevels = getChapterLevels(chapter);
        return {
            chapter,
            totalLevels: chapterLevels.length,
            bossLevels: chapterLevels.filter(level => level.isBoss).length,
        };
    });

    const totalBossLevels = allLevels.filter(level => level.isBoss).length;

    assert(chapterIds.length >= 6, `章节数量不足：当前 ${chapterIds.length}，期望至少 6`);
    assert(allLevels.length >= 30, `总关卡数不足：当前 ${allLevels.length}，期望至少 30`);

    for (const summary of summaries) {
        assert(summary.totalLevels > 0, `第 ${summary.chapter} 章没有关卡`);
    }

    console.log('关卡校验通过');
    console.log(JSON.stringify({
        chapterCount: chapterIds.length,
        totalLevels: allLevels.length,
        totalBossLevels,
        summaries,
    }, null, 2));
}

main();
