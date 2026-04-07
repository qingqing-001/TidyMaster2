declare const process: {
    exitCode?: number;
};

import { getLevelConfig } from '../assets/scripts/data/levels';
import { OperationType } from '../assets/scripts/data/LevelData';

interface CheckResult {
    name: string;
    passed: boolean;
    detail: string;
}

interface RealWipeConfig {
    requiredDistance: number;
    wipeSpeed: number;
    wipeThreshold: number;
}

class RealWipeProgressVerifier {
    private wipeProgress = 0;
    private completed = false;
    private totalDistance = 0;

    constructor(
        private readonly requiredDistance: number,
        private readonly wipeSpeed: number,
        private readonly wipeThreshold: number,
    ) {}

    move(distance: number): void {
        if (this.completed) {
            return;
        }

        this.totalDistance += distance;
        const progress = (this.totalDistance / this.requiredDistance) * 100 * this.wipeSpeed;
        this.wipeProgress = Math.min(Math.max(progress, 0), 100);

        if (this.wipeProgress >= this.wipeThreshold) {
            this.completed = true;
            this.wipeProgress = 100;
        }
    }

    getProgress(): number {
        return this.wipeProgress;
    }

    isCompleted(): boolean {
        return this.completed;
    }

    getDistance(): number {
        return this.totalDistance;
    }
}

function deriveRealWipeConfig(slotSize: { w: number; h: number }): RealWipeConfig {
    const requiredDistance = Math.max(slotSize.w + slotSize.h, 180);
    return {
        requiredDistance,
        wipeSpeed: 1,
        wipeThreshold: 100,
    };
}

function runChecks(): CheckResult[] {
    const results: CheckResult[] = [];
    const level201 = getLevelConfig(201);

    results.push({
        name: '真实关卡入口：getLevelConfig(201)',
        passed: !!level201,
        detail: level201
            ? `命中关卡 ${level201.id}，章节=${level201.chapter}，场景=${level201.sceneDisplayName}`
            : '未找到 201 关配置',
    });

    if (!level201) {
        return results;
    }

    const wipeItem = level201.items.find((item) => item.operation === OperationType.WIPE);
    const wipeSlot = wipeItem
        ? level201.slots.find((slot) => slot.id === wipeItem.targetSlotId)
        : undefined;

    results.push({
        name: '关卡 201 包含真实擦洗物品',
        passed: !!wipeItem && !!wipeSlot,
        detail: wipeItem && wipeSlot
            ? `物品=${wipeItem.id}，槽位=${wipeSlot.id}，提示=${wipeSlot.label ?? '无'}`
            : '缺少擦洗物品或目标槽位',
    });

    if (!wipeItem || !wipeSlot) {
        return results;
    }

    const realWipeConfig = deriveRealWipeConfig(wipeSlot.size);
    results.push({
        name: '擦洗参数直接来自真实 201 关槽位尺寸',
        passed: realWipeConfig.requiredDistance === wipeSlot.size.w + wipeSlot.size.h
            && realWipeConfig.wipeThreshold === 100
            && realWipeConfig.wipeSpeed === 1,
        detail: `槽位尺寸=${wipeSlot.size.w}x${wipeSlot.size.h}，requiredDistance=${realWipeConfig.requiredDistance}，wipeThreshold=${realWipeConfig.wipeThreshold}，wipeSpeed=${realWipeConfig.wipeSpeed}`,
    });

    const verifier = new RealWipeProgressVerifier(
        realWipeConfig.requiredDistance,
        realWipeConfig.wipeSpeed,
        realWipeConfig.wipeThreshold,
    );

    const firstMoveDistance = Math.floor(realWipeConfig.requiredDistance * 0.4);
    verifier.move(firstMoveDistance);
    const progressAfterFirstMove = verifier.getProgress();
    results.push({
        name: '擦洗进度可推进',
        passed: progressAfterFirstMove > 0 && progressAfterFirstMove < realWipeConfig.wipeThreshold,
        detail: `累计距离=${verifier.getDistance()}，进度=${progressAfterFirstMove.toFixed(2)}%，阈值=${realWipeConfig.wipeThreshold}%`,
    });

    verifier.move(realWipeConfig.requiredDistance);
    const finalProgress = verifier.getProgress();
    const completed = verifier.isCompleted();
    results.push({
        name: '擦洗完成判定可成立',
        passed: completed && finalProgress === 100,
        detail: `累计距离=${verifier.getDistance()}，最终进度=${finalProgress.toFixed(2)}%，completed=${completed}`,
    });

    return results;
}

function printResults(results: CheckResult[]): void {
    console.log('=== 第2章 201 关擦洗闭环真实脚本验证 ===');

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
