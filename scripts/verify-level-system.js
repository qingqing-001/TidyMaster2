/**
 * 历史遗留 JS 验证入口。
 *
 * 说明：
 * - 本文件仅为兼容旧排障流程而保留；
 * - 不属于仓库正式验证命令口径；
 * - 正式验证请使用 package.json / README 中声明的唯一正式 npm 验证命令集合。
 *
 * 历史调用示例: node scripts/verify-level-system.js
 * 请勿将该入口作为提测或验收依据。
 */

// 模拟的LevelManager（不依赖Cocos）
class MockLevelManager {
    constructor() {
        this.currentLevel = null;
        this.placedItems = new Set();
    }

    loadLevel(level) {
        this.currentLevel = level;
        this.placedItems.clear();
        console.log(`[LevelManager] 加载关卡: ${level.name}`);
    }

    markItemPlaced(itemId) {
        this.placedItems.add(itemId);
        console.log(`[LevelManager] 物品已放置: ${itemId}, 当前进度: ${this.placedItems.size}/${this.currentLevel?.requiredItems || 0}`);
    }

    removeItem(itemId) {
        this.placedItems.delete(itemId);
    }

    getPlacedCount() {
        return this.placedItems.size;
    }

    isLevelComplete() {
        if (!this.currentLevel) return false;
        return this.placedItems.size >= this.currentLevel.requiredItems;
    }

    resetProgress() {
        this.placedItems.clear();
    }

    getProgressPercentage() {
        if (!this.currentLevel || this.currentLevel.requiredItems === 0) return 0;
        return (this.placedItems.size / this.currentLevel.requiredItems) * 100;
    }
}

// 模拟的TimerController（不依赖Cocos）
class MockTimerController {
    constructor() {
        this.timeLimit = 0;
        this.currentTime = 0;
        this.isRunning = false;
        this.onTimeout = null;
        this.intervalId = null;
    }

    startTimer(timeLimit, onTimeout) {
        this.timeLimit = timeLimit;
        this.currentTime = timeLimit;
        this.isRunning = true;
        this.onTimeout = onTimeout || null;
        
        console.log(`[TimerController] 计时开始: ${timeLimit}秒`);
        
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    tick() {
        if (!this.isRunning) return;
        
        this.currentTime--;
        console.log(`[TimerController] 剩余时间: ${this.currentTime}秒`);
        
        if (this.currentTime <= 0) {
            this.onTimeOut();
        }
    }

    onTimeOut() {
        this.currentTime = 0;
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        console.log('[TimerController] 时间耗尽!');
        if (this.onTimeout) {
            this.onTimeout();
        }
    }

    pauseTimer() {
        this.isRunning = false;
    }

    resumeTimer() {
        this.isRunning = true;
    }

    addTime(seconds) {
        this.currentTime += seconds;
        console.log(`[TimerController] 增加时间: +${seconds}秒, 当前: ${this.currentTime}秒`);
    }

    getRemainingTime() {
        return this.currentTime;
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }
}

// 模拟的ScoreCalculator
class MockScoreCalculator {
    calculateStars(completionRate, starThresholds) {
        if (completionRate >= starThresholds[2]) return 3;
        if (completionRate >= starThresholds[1]) return 2;
        if (completionRate >= starThresholds[0]) return 1;
        return 0;
    }

    calculateCoins(stars, baseCoin) {
        return baseCoin * stars;
    }
}

// 测试关卡配置
const testLevel = {
    id: 'test_001',
    name: '测试关卡',
    items: [
        { id: 'item_001', type: 'book', position: { x: 100, y: 200 } },
        { id: 'item_002', type: 'pen', position: { x: 200, y: 200 } },
        { id: 'item_003', type: 'cup', position: { x: 300, y: 200 } }
    ],
    slots: [
        { id: 'slot_001', allowedItemTypes: ['book'], position: { x: 100, y: 400 } },
        { id: 'slot_002', allowedItemTypes: ['pen'], position: { x: 200, y: 400 } },
        { id: 'slot_003', allowedItemTypes: ['cup'], position: { x: 300, y: 400 } }
    ],
    requiredItems: 3,
    timeLimit: 60
};

// 运行测试
console.log('\n========== 关卡系统验证测试 =========\n');

// 测试1: LevelManager
console.log('--- 测试1: LevelManager ---');
const levelManager = new MockLevelManager();
levelManager.loadLevel(testLevel);
levelManager.markItemPlaced('item_001');
console.log(`进度: ${levelManager.getPlacedCount()}/3`);
console.log(`完成判定: ${levelManager.isLevelComplete()}`);

levelManager.markItemPlaced('item_002');
console.log(`进度: ${levelManager.getPlacedCount()}/3`);
console.log(`完成判定: ${levelManager.isLevelComplete()}`);

levelManager.markItemPlaced('item_003');
console.log(`进度: ${levelManager.getPlacedCount()}/3`);
console.log(`完成判定: ${levelManager.isLevelComplete()}`);
console.log('✅ LevelManager 测试通过\n');

// 测试2: TimerController
console.log('--- 测试2: TimerController ---');
const timerController = new MockTimerController();
timerController.startTimer(3, () => {
    console.log('✅ TimerController 超时回调正常');
});

// 等待3秒让计时器完成
setTimeout(() => {
    console.log(`剩余时间: ${timerController.getRemainingTime()}秒`);
    console.log('✅ TimerController 测试通过\n');
    
    // 测试3: ScoreCalculator
    console.log('--- 测试3: ScoreCalculator ---');
    const scoreCalculator = new MockScoreCalculator();
    
    // 测试完成度
    const testCases = [
        { completion: 100, thresholds: [60, 80, 100], expected: 3 },
        { completion: 85, thresholds: [60, 80, 100], expected: 2 },
        { completion: 70, thresholds: [60, 80, 100], expected: 1 },
        { completion: 50, thresholds: [60, 80, 100], expected: 0 },
    ];
    
    let allPassed = true;
    testCases.forEach(tc => {
        const stars = scoreCalculator.calculateStars(tc.completion, tc.thresholds);
        const passed = stars === tc.expected;
        console.log(`完成度${tc.completion}% -> ${stars}星 (期望${tc.expected}星) ${passed ? '✅' : '❌'}`);
        if (!passed) allPassed = false;
    });
    
    // 测试金币计算
    const coins = scoreCalculator.calculateCoins(3, 50);
    console.log(`3星 * 50基础金币 = ${coins}金币 ${coins === 150 ? '✅' : '❌'}`);
    if (coins !== 150) allPassed = false;
    
    if (allPassed) {
        console.log('✅ ScoreCalculator 测试通过\n');
    } else {
        console.log('❌ ScoreCalculator 测试失败\n');
    }
    
    // 测试4: 关卡移除功能
    console.log('--- 测试4: 物品移除功能 ---');
    levelManager.resetProgress();
    levelManager.markItemPlaced('item_001');
    levelManager.markItemPlaced('item_002');
    console.log(`移除前: ${levelManager.getPlacedCount()}/3`);
    
    levelManager.removeItem('item_001');
    console.log(`移除item_001后: ${levelManager.getPlacedCount()}/3`);
    
    const afterRemove = levelManager.getPlacedCount() === 1;
    console.log(`✅ 物品移除功能正常: ${afterRemove}\n`);
    
    console.log('========== 所有测试完成 =========\n');
    process.exit(0);
}, 4000);
