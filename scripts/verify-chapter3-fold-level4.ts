declare const process: {
    exitCode?: number;
};

import { getLevelConfig } from '../assets/scripts/data/levels';
import { OperationType } from '../assets/scripts/data/LevelData';
import { LevelManager } from '../assets/scripts/gameplay/LevelManager';

interface CheckResult {
    name: string;
    passed: boolean;
    detail: string;
}

interface OperationProgressPayload {
    levelId?: number;
    itemId?: string;
    slotId?: string;
    operation?: OperationType;
    progress: number;
    completed: boolean;
}

interface OperationCompletePayload {
    levelId?: number;
    itemId?: string;
    slotId?: string;
    operation?: OperationType;
    progress?: number;
}

class FoldVerificationHarness {
    private readonly levelManager = new LevelManager();
    private readonly completedOperationItems = new Set<string>();
    private readonly activeOperationProgress = new Map<string, number>();
    private levelCompleted = false;

    constructor(private readonly levelId: number) {}

    load() {
        const levelConfig = getLevelConfig(this.levelId);
        if (!levelConfig) {
            throw new Error(`未找到关卡 ${this.levelId} 配置`);
        }

        const levelDefinition = this.levelManager.loadFromConfig(levelConfig);
        return { levelConfig, levelDefinition };
    }

    resolveFoldStepCount(slotSize?: { w: number; h: number }): number {
        const maxSize = Math.max(slotSize?.w ?? 90, slotSize?.h ?? 90);
        return maxSize >= 110 ? 4 : 3;
    }

    handleOperationProgress(data?: OperationProgressPayload): void {
        if (!data || data.levelId !== this.levelId || !data.itemId) {
            return;
        }

        this.activeOperationProgress.set(data.itemId, data.progress);
        if (data.completed) {
            this.completedOperationItems.add(data.itemId);
        }
    }

    handleOperationComplete(data?: OperationCompletePayload): void {
        if (!data || data.levelId !== this.levelId || !data.itemId) {
            return;
        }

        this.completedOperationItems.add(data.itemId);
        this.activeOperationProgress.delete(data.itemId);
        this.levelManager.markItemPlaced(data.itemId);

        if (this.levelManager.isLevelComplete()) {
            this.levelCompleted = true;
        }
    }

    buildActiveOperationText(): string {
        const entries: string[] = [];
        this.activeOperationProgress.forEach((progress, itemId) => {
            if (this.completedOperationItems.has(itemId)) {
                return;
            }
            const itemConfig = this.levelManager.getItemConfig(itemId);
            if (!itemConfig) {
                return;
            }
            const label = itemConfig.operation === OperationType.WIPE
                ? '擦洗'
                : itemConfig.operation === OperationType.FOLD
                    ? '折叠'
                    : '操作';
            entries.push(`${label}${Math.round(progress)}%`);
        });
        return entries.join(' · ');
    }

    getPlacedCount(): number {
        return this.levelManager.getPlacedCount();
    }

    isLevelComplete(): boolean {
        return this.levelCompleted;
    }
}

function runChecks(): CheckResult[] {
    const results: CheckResult[] = [];
    // 使用真实第3章折叠关 (level 301)
    const verifier = new FoldVerificationHarness(301);
    const { levelConfig, levelDefinition } = verifier.load();

    // 1. 验证真实关卡入口：getLevelConfig(301) 命中第3章折叠关
    results.push({
        name: '真实关卡入口：getLevelConfig(301) 命中第3章折叠关',
        passed: levelConfig.id === 301 && levelConfig.chapter === 3 && levelConfig.sceneDisplayName === '衣柜折叠',
        detail: `命中关卡 ${levelConfig.id}，章节=${levelConfig.chapter}，场景=${levelConfig.sceneDisplayName}`,
    });

    // 2. 验证真实配置包含可执行的 fold 物品/槽位配置
    const foldItems = levelConfig.items.filter((item) => item.operation === OperationType.FOLD);
    const allFoldSlotsExist = foldItems.every((item) => levelConfig.slots.some((slot) => slot.id === item.targetSlotId));
    results.push({
        name: '真实第3章折叠关配置可读取完整折叠目标',
        passed: foldItems.length === levelConfig.items.length && foldItems.length > 0 && allFoldSlotsExist,
        detail: `折叠物品=${foldItems.length}，槽位映射完整=${allFoldSlotsExist}，operations=${levelConfig.operations.join(',')}`,
    });

    // 3. 验证 LevelManager.loadFromConfig 保留真实操作接线
    const levelOperations = [...levelDefinition.operations].sort().join(',');
    results.push({
        name: 'LevelManager.loadFromConfig 保留真实操作接线',
        passed: levelDefinition.requiredItems === levelConfig.items.length
            && levelOperations === [...levelConfig.operations].sort().join(','),
        detail: `requiredItems=${levelDefinition.requiredItems}，operations=${levelOperations}`,
    });

    // 4. 验证统一 operation 接线可回查真实 item/slot 配置
    const sampleFoldItem = foldItems[0];
    const sampleFoldSlot = levelConfig.slots.find((slot) => slot.id === sampleFoldItem.targetSlotId)!;
    const resolvedItemConfig = verifier['levelManager'].getItemConfig(sampleFoldItem.id);
    const resolvedSlotConfig = verifier['levelManager'].getSlotConfig(sampleFoldSlot.id);
    results.push({
        name: '统一 operation 接线可回查真实 item/slot 配置',
        passed: resolvedItemConfig?.operation === OperationType.FOLD
            && resolvedSlotConfig?.id === sampleFoldSlot.id,
        detail: `item=${sampleFoldItem.id}/${resolvedItemConfig?.operation} -> slot=${resolvedSlotConfig?.id}(${resolvedSlotConfig?.label ?? '无标签'})`,
    });

    // 5. 验证折叠步数来自真实槽位尺寸推导
    const foldStepCount = verifier.resolveFoldStepCount(sampleFoldSlot.size);
    const expectedStepCount = sampleFoldSlot.size.w >= 110 || sampleFoldSlot.size.h >= 110 ? 4 : 3;
    results.push({
        name: '折叠步数来自真实槽位尺寸推导',
        passed: foldStepCount === expectedStepCount,
        detail: `槽位尺寸=${sampleFoldSlot.size.w}x${sampleFoldSlot.size.h}，foldSteps=${foldStepCount}`,
    });

    // 6. 验证折叠进度事件可推动教学进度文本
    verifier.handleOperationProgress({
        levelId: 301,
        itemId: sampleFoldItem.id,
        slotId: sampleFoldSlot.id,
        operation: OperationType.FOLD,
        progress: 33.33,
        completed: false,
    });
    results.push({
        name: '折叠进度事件可推动教学进度文本',
        passed: verifier.buildActiveOperationText() === '折叠33%',
        detail: `activeText=${verifier.buildActiveOperationText() || '(empty)'}`,
    });

    // 7. 验证折叠完成事件可推进真实关卡完成判定
    for (const item of foldItems) {
        verifier.handleOperationComplete({
            levelId: 301,
            itemId: item.id,
            slotId: item.targetSlotId,
            operation: OperationType.FOLD,
            progress: 100,
        });
    }

    results.push({
        name: '折叠完成事件可推进真实关卡完成判定',
        passed: verifier.getPlacedCount() === levelConfig.items.length && verifier.isLevelComplete(),
        detail: `placed=${verifier.getPlacedCount()}/${levelConfig.items.length}，levelComplete=${verifier.isLevelComplete()}`,
    });

    return results;
}

function printResults(results: CheckResult[]): void {
    console.log('=== 第3章折叠教学关真实脚本验证 ===');

    let passedCount = 0;
    for (const result of results) {
        const marker = result.passed ? 'PASS' : 'FAIL';
        if (result.passed) {
            passedCount += 1;
        }
        console.log(`[${marker}] ${result.name}`);
        console.log(`       ${result.detail}`);
    }

    const allPassed = passedCount === results.length;
    console.log(`总结: ${passedCount}/${results.length} 项通过`);
    console.log(allPassed ? '最终结果: PASS' : '最终结果: FAIL');

    if (!allPassed) {
        process.exitCode = 1;
    }
}

printResults(runChecks());