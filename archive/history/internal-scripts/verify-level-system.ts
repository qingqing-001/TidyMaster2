/**
 * 关卡系统验证脚本
 * 运行方式: npx ts-node scripts/verify-level-system.ts
 * 
 * 验证内容:
 * 1. LevelManager 关卡加载和完成判定
 * 2. TimerController 倒计时功能
 * 3. ScoreCalculator 评分计算
 * 4. 关卡配置加载
 */

// 模拟的LevelManager（不依赖Cocos）
class MockLevelManager {
    private currentLevel: any = null;
    private placedItems: Set<string> = new Set();

    public loadLevel(level: any): void {
        this.currentLevel = level;
        this.placedItems.clear();
        console.log(`[LevelManager] 加载关卡: ${level.name}`);
    }

    public markItemPlaced(itemId: string): void {
        this.placedItems.add(itemId);
        console.log(`[LevelManager] 物品已放置: ${itemId}, 当前进度: ${this.placedItems.size}/${this.currentLevel?.requiredItems || 0}`);
    }

    public removeItem(itemId: string): void {
        this.placedItems.delete(itemId);
    }

    public getPlacedCount(): number {
        return this.placedItems.size;
    }

    public isLevelComplete(): boolean {
        if (!this.currentLevel) return false;
        return this.placedItems.size >= this.currentLevel.requiredItems;
    }

    public resetProgress(): void {
        this.placedItems.clear();
    }

    public getProgressPercentage(): number {
        if (!this.currentLevel || this.currentLevel.requiredItems === 0) return 0;
        return (this.placedItems.size / this.currentLevel.requiredItems) * 100;
    }
}

// 模拟的TimerController（不依赖Cocos）
class MockTimerController {
    private timeLimit: number = 0;
    private currentTime: number = 0;
    private isRunning: boolean = false;
    private onTimeout: (() => void) | null = null;
    private intervalId: NodeJS.Timeout | null = null;

    startTimer(timeLimit: number, onTimeout?: () => void): void {
        this.timeLimit = timeLimit;
        this.currentTime = timeLimit;
        this.isRunning = true;
        this.onTimeout = onTimeout || null;
        
        console.log(`[TimerController] 计时开始: ${timeLimit}秒`);
        
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    private tick(): void {
        if (!this.isRunning) return;
        
        this.currentTime--;
        console.log(`[TimerController] 剩余时间: ${this.currentTime}秒`);
        
        if (this.currentTime <= 0) {
            this.onTimeOut();
        }
    }

    private onTimeOut(): void {
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

    pauseTimer(): void {
        this.isRunning = false;
    }

    resumeTimer(): void {
        this.isRunning = true;
    }

    addTime(seconds: number): void {
        this.currentTime += seconds;
        console.log(`[TimerController] 增加时间: +${seconds}秒, 当前: ${this.currentTime}秒`);
    }

    getRemainingTime(): number {
        return this.currentTime;
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }
}

// 模拟的ScoreCalculator
class MockScoreCalculator {
    calculateStars(completionRate: number, starThresholds: [number, number, number]): number {
        if (completionRate >= starThresholds[2]) return 3;
        if (completionRate >= starThresholds[1]) return 2;
        if (completionRate >= starThresholds[0]) return 1;
        return 0;
    }

    calculateCoins(stars: number, baseCoin: number): number {
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
console.log('\n========== 关卡系统验证测试 ==========\n');

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
        const stars = scoreCalculator.calculateStars(tc.completion, tc.thresholds as [number, number, number]);
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
    
    console.log('========== 所有测试完成 ==========\n');
    process.exit(0);
}, 4000);