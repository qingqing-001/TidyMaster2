/**
 * AdManager 功能验证脚本
 * 验证项：
 * 1. 广告调用有日志输出
 * 2. 冷却状态可查询
 * 3. 120秒冷却机制
 * 4. 前5关无广告的新手保护期
 * 5. 连续3次关闭后不再弹出
 */

// 模拟微信环境
(global as any).wx = {
    createRewardedVideoAd: (opts: any) => {
        console.log(`  [Mock] wx.createRewardedVideoAd: ${opts.adUnitId}`);
        return new MockRewardedVideoAd();
    },
    setStorageSync: (key: string, value: any) => {
        // 存储到内存模拟
        mockStorage[key] = value;
    },
    getStorageSync: (key: string) => {
        return mockStorage[key];
    }
};

// 模拟存储
const mockStorage: Record<string, any> = {};

// 模拟激励视频广告
class MockRewardedVideoAd {
    private errorCallback?: (err: any) => void;
    private closeCallback?: (res: any) => void;

    onError(callback: (err: any) => void): void {
        this.errorCallback = callback;
    }

    onClose(callback: (res: any) => void): void {
        this.closeCallback = callback;
    }

    offError(): void {
        this.errorCallback = undefined;
    }

    offClose(): void {
        this.closeCallback = undefined;
    }

    load(): Promise<void> {
        console.log('  [Mock] ad.load()');
        return Promise.resolve();
    }

    show(): Promise<void> {
        console.log('  [Mock] ad.show()');
        return Promise.resolve();
    }

    // 模拟广告关闭（用户观看完成）
    simulateClose(isEnded: boolean): void {
        console.log(`  [Mock] ad.onClose(isEnded=${isEnded})`);
        if (this.closeCallback) {
            this.closeCallback({ isEnded });
        }
    }

    // 模拟广告加载错误
    simulateError(err: any): void {
        if (this.errorCallback) {
            this.errorCallback(err);
        }
    }
}

// 导入被测试的 AdManager（需要先处理导入）
import { AdManager } from '../assets/scripts/core/AdManager';

interface TestResult {
    name: string;
    passed: boolean;
    message: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, message: string): void {
    results.push({ name, passed: condition, message });
    const status = condition ? '✅' : '❌';
    console.log(`${status} ${name}: ${message}`);
}

async function runTests(): Promise<void> {
    console.log('\n========== AdManager 功能验证 ==========\n');

    // 创建新实例（清除之前状态）
    (AdManager as any)._instance = null;
    
    // 获取实例
    const adManager = AdManager.instance;
    console.log('测试1: 基本实例化');
    assert(adManager !== null && adManager !== undefined, '实例化', 'AdManager 单例正常创建');

    // ==================== 测试2: 新手保护期 ====================
    console.log('\n--- 测试2: 新手保护期（前5关无广告）---');
    
    // 重置状态
    (AdManager as any)._instance = null;
    mockStorage['total_levels_played'] = 0;
    
    const adManager2 = AdManager.instance;
    
    // 测试关卡0-4（应该无广告）
    for (let level = 0; level <= 4; level++) {
        mockStorage['total_levels_played'] = level;
        const canShow = (adManager2 as any).canShowAd();
        const isProtected = (adManager2 as any).isInNewbieProtection();
        assert(
            !canShow && isProtected, 
            `新手保护-关卡${level + 1}`,
            `应该不可展示广告 (canShow=${canShow}, isProtected=${isProtected})`
        );
    }

    // 测试关卡5（应该可以展示广告）
    mockStorage['total_levels_played'] = 5;
    const canShowAfterNewbie = (adManager2 as any).canShowAd();
    assert(
        canShowAfterNewbie === true,
        '新手保护-关卡6',
        `应该可以展示广告 (canShow=${canShowAfterNewbie})`
    );

    // ==================== 测试3: 冷却机制 ====================
    console.log('\n--- 测试3: 120秒冷却机制 ---');
    
    // 重置状态
    (AdManager as any)._instance = null;
    mockStorage['total_levels_played'] = 10; // 超过新手保护期
    mockStorage['ad_last_time'] = 0;
    mockStorage['ad_close_count'] = 0;
    mockStorage['ad_close_date'] = '';
    
    const adManager3 = AdManager.instance;
    
    // 初始状态应该可以展示广告
    const canShowInitially = (adManager3 as any).canShowAd();
    const cooldownInitially = (adManager3 as any).getCooldownRemaining();
    assert(
        canShowInitially === true && cooldownInitially === 0,
        '初始状态',
        `应该可以展示广告，冷却剩余=0 (canShow=${canShowInitially}, cooldown=${cooldownInitially})`
    );

    // 模拟刚刚看完广告（设置最后广告时间为当前时间）
    const now = Date.now();
    mockStorage['ad_last_time'] = now;
    (adManager3 as any)._lastAdTime = now;
    
    const canShowDuringCooldown = (adManager3 as any).canShowAd();
    const cooldownAfterAd = (adManager3 as any).getCooldownRemaining();
    
    assert(
        !canShowDuringCooldown && cooldownAfterAd >= 119,
        '冷却中状态',
        `不应该展示广告，冷却剩余>=119秒 (canShow=${canShowDuringCooldown}, cooldown=${cooldownAfterAd})`
    );
    
    // 测试 isInCooldown 方法
    const isInCooldown = (adManager3 as any).isInCooldown();
    assert(
        isInCooldown === true,
        'isInCooldown方法',
        `冷却中应该返回true (isInCooldown=${isInCooldown})`
    );

    // ==================== 测试4: 连续关闭限制 ====================
    console.log('\n--- 测试4: 连续3次关闭后不再弹出 ---');
    
    // 重置状态
    (AdManager as any)._instance = null;
    mockStorage['total_levels_played'] = 10;
    mockStorage['ad_last_time'] = 0;
    mockStorage['ad_close_count'] = 0;
    
    // 获取今天的日期字符串
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    mockStorage['ad_close_date'] = todayStr;
    
    const adManager4 = AdManager.instance;
    
    // 初始状态应该可以展示
    const canShowBeforeClose = (adManager4 as any).canShowAd();
    assert(
        canShowBeforeClose === true,
        '初始可展示',
        `初始应该可以展示广告 (canShow=${canShowBeforeClose})`
    );

    // 模拟关闭1次
    (adManager4 as any)._incrementCloseCount();
    let closeCount = (adManager4 as any)._closeCount;
    assert(closeCount === 1, '关闭1次', `关闭次数应为1 (实际=${closeCount})`);

    // 模拟关闭2次
    (adManager4 as any)._incrementCloseCount();
    closeCount = (adManager4 as any)._closeCount;
    assert(closeCount === 2, '关闭2次', `关闭次数应为2 (实际=${closeCount})`);

    // 模拟关闭3次 - 达到上限
    (adManager4 as any)._incrementCloseCount();
    closeCount = (adManager4 as any)._closeCount;
    const isBlocked = (adManager4 as any).isBlockedByCloseCount();
    assert(
        closeCount === 3 && isBlocked === true,
        '关闭3次-上限',
        `关闭次数应为3，达到上限 (closeCount=${closeCount}, isBlocked=${isBlocked})`
    );

    // 此时不应该展示广告
    const canShowAfter3Closes = (adManager4 as any).canShowAd();
    assert(
        canShowAfter3Closes === false,
        '关闭3次-禁止',
        `关闭3次后不应该展示广告 (canShow=${canShowAfter3Closes})`
    );

    // ==================== 测试5: getDebugStatus ====================
    console.log('\n--- 测试5: getDebugStatus 状态查询 ---');
    
    const debugStatus = (adManager4 as any).getDebugStatus();
    assert(
        debugStatus !== null && typeof debugStatus === 'object',
        '返回对象',
        'getDebugStatus应该返回对象'
    );
    
    assert(
        typeof debugStatus.lastAdTime === 'number' &&
        typeof debugStatus.cooldownRemaining === 'number' &&
        typeof debugStatus.closeCount === 'number',
        '状态字段',
        '应该包含 lastAdTime, cooldownRemaining, closeCount 字段'
    );
    console.log('  调试状态:', JSON.stringify(debugStatus, null, 2));

    // ==================== 测试6: 日志输出 ====================
    console.log('\n--- 测试6: 广告调用日志输出 ---');
    
    // 重置
    (AdManager as any)._instance = null;
    mockStorage['total_levels_played'] = 10;
    mockStorage['ad_last_time'] = 0;
    mockStorage['ad_close_count'] = 0;
    mockStorage['ad_close_date'] = todayStr;
    
    const adManager5 = AdManager.instance;
    
    console.log('测试调用 showReviveAd:');
    adManager5.showReviveAd((success: boolean) => {
        console.log(`  回调: success=${success}`);
    });
    
    console.log('测试调用 showRewardMultiplierAd:');
    adManager5.showRewardMultiplierAd((success: boolean) => {
        console.log(`  回调: success=${success}`);
    });

    // ==================== 测试7: resetCloseCount ====================
    console.log('\n--- 测试7: 重置关闭次数 ---');
    
    (adManager4 as any).resetCloseCount();
    const closeCountAfterReset = (adManager4 as any)._closeCount;
    const isBlockedAfterReset = (adManager4 as any).isBlockedByCloseCount();
    assert(
        closeCountAfterReset === 0 && isBlockedAfterReset === false,
        '重置关闭次数',
        `重置后关闭次数应为0 (实际=${closeCountAfterReset}, isBlocked=${isBlockedAfterReset})`
    );

    // ==================== 汇总结果 ====================
    console.log('\n========== 验证结果汇总 ==========');
    const passCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    console.log(`\n通过: ${passCount}/${totalCount}`);
    
    if (passCount === totalCount) {
        console.log('\n🎉 所有验证项通过！\n');
        process.exit(0);
    } else {
        console.log('\n❌ 部分验证失败:\n');
        results.filter(r => !r.passed).forEach(r => {
            console.log(`  ${r.name}: ${r.message}`);
        });
        process.exit(1);
    }
}

// 运行测试
runTests().catch(err => {
    console.error('测试执行错误:', err);
    process.exit(1);
});