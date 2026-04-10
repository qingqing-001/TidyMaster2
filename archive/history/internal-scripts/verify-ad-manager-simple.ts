/**
 * AdManager 功能验证脚本（简化版）
 */

// 模拟存储
const mockStorage: Record<string, any> = {};

// 模拟微信环境
const mockWx = {
    createRewardedVideoAd: (opts: any) => {
        console.log(`  [Mock] wx.createRewardedVideoAd: ${opts.adUnitId}`);
        return new MockRewardedVideoAd();
    },
    setStorageSync: (key: string, value: any) => {
        mockStorage[key] = value;
    },
    getStorageSync: (key: string) => {
        return mockStorage[key];
    }
};

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

    simulateClose(isEnded: boolean): void {
        console.log(`  [Mock] ad.onClose(isEnded=${isEnded})`);
        if (this.closeCallback) {
            this.closeCallback({ isEnded });
        }
    }
}

// 存储键名常量
const STORAGE_KEYS = {
    LAST_AD_TIME: 'ad_last_time',
    CLOSE_COUNT: 'ad_close_count',
    CLOSE_DATE: 'ad_close_date',
    TOTAL_LEVELS_PLAYED: 'total_levels_played',
};

const COOLDOWN_MS = 120 * 1000;
const NEWBIE_PROTECTION_LEVELS = 5;
const MAX_CLOSE_COUNT = 3;

class AdManagerSimple {
    public _lastAdTime: number = 0;
    public _closeCount: number = 0;
    public _closeDate: string = '';
    public _totalLevelsPlayed: number = 0;

    constructor() {
        this._loadPersistedData();
    }

    private _loadPersistedData(): void {
        this._lastAdTime = mockStorage[STORAGE_KEYS.LAST_AD_TIME] || 0;
        this._closeCount = mockStorage[STORAGE_KEYS.CLOSE_COUNT] || 0;
        this._closeDate = mockStorage[STORAGE_KEYS.CLOSE_DATE] || '';
        this._totalLevelsPlayed = mockStorage[STORAGE_KEYS.TOTAL_LEVELS_PLAYED] || 0;

        const today = this._getTodayString();
        if (this._closeDate !== today) {
            this._closeCount = 0;
            this._closeDate = today;
            this._saveCloseData();
        }

        console.log('[AdManager] 加载数据: lastAdTime=' + this._lastAdTime + 
            ', closeCount=' + this._closeCount + 
            ', totalLevelsPlayed=' + this._totalLevelsPlayed);
    }

    private _saveCloseData(): void {
        mockStorage[STORAGE_KEYS.CLOSE_COUNT] = this._closeCount;
        mockStorage[STORAGE_KEYS.CLOSE_DATE] = this._closeDate;
    }

    private _saveLastAdTime(): void {
        this._lastAdTime = Date.now();
        mockStorage[STORAGE_KEYS.LAST_AD_TIME] = this._lastAdTime;
    }

    private _getTodayString(): string {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    }

    getCurrentLevelNumber(): number {
        return this._totalLevelsPlayed + 1;
    }

    onLevelCompleted(): void {
        this._totalLevelsPlayed++;
        mockStorage[STORAGE_KEYS.TOTAL_LEVELS_PLAYED] = this._totalLevelsPlayed;
        console.log('[AdManager] 关卡完成，累计: ' + this._totalLevelsPlayed);
    }

    getCooldownRemaining(): number {
        const now = Date.now();
        const elapsed = now - this._lastAdTime;
        return Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));
    }

    isInCooldown(): boolean {
        return this.getCooldownRemaining() > 0;
    }

    getCloseCount(): number {
        return this._closeCount;
    }

    isBlockedByCloseCount(): boolean {
        return this._closeCount >= MAX_CLOSE_COUNT;
    }

    isInNewbieProtection(): boolean {
        return this._totalLevelsPlayed < NEWBIE_PROTECTION_LEVELS;
    }

    canShowAd(): boolean {
        if (this.isInNewbieProtection()) {
            console.log('[AdManager] 新手保护期，不展示广告');
            return false;
        }

        if (this.isInCooldown()) {
            console.log('[AdManager] 冷却中，剩余 ' + this.getCooldownRemaining() + ' 秒');
            return false;
        }

        if (this.isBlockedByCloseCount()) {
            console.log('[AdManager] 已连续关闭 ' + this._closeCount + ' 次，不再弹出');
            return false;
        }

        console.log('[AdManager] 可以展示广告');
        return true;
    }

    public _incrementCloseCount(): void {
        const today = this._getTodayString();
        if (this._closeDate !== today) {
            this._closeCount = 1;
            this._closeDate = today;
        } else {
            this._closeCount++;
        }
        this._saveCloseData();
        console.log('[AdManager] 连续关闭次数: ' + this._closeCount);
    }

    showReviveAd(callback: (success: boolean) => void): void {
        console.log('[AdManager] 请求显示续命广告');
        if (!this.canShowAd()) {
            callback(false);
            return;
        }
        
        const ad = mockWx.createRewardedVideoAd('adunit-revive-xxx');
        
        ad.onClose((res: any) => {
            console.log('[AdManager] 广告关闭, isEnded=' + (res ? res.isEnded : 'undefined'));
            if (res && res.isEnded) {
                this._saveLastAdTime();
                callback(true);
            } else {
                this._incrementCloseCount();
                callback(false);
            }
        });

        ad.load()
            .then(() => ad.show())
            .catch((err: any) => {
                console.log('[AdManager] 广告加载或显示失败:', err);
                this._incrementCloseCount();
                callback(false);
            });
    }

    showRewardMultiplierAd(callback: (success: boolean) => void): void {
        console.log('[AdManager] 请求显示奖励翻倍广告');
        if (!this.canShowAd()) {
            callback(false);
            return;
        }
        
        const ad = mockWx.createRewardedVideoAd('adunit-reward-xxx');
        
        ad.onClose((res: any) => {
            console.log('[AdManager] 广告关闭, isEnded=' + (res ? res.isEnded : 'undefined'));
            if (res && res.isEnded) {
                this._saveLastAdTime();
                callback(true);
            } else {
                this._incrementCloseCount();
                callback(false);
            }
        });

        ad.load()
            .then(() => ad.show())
            .catch((err: any) => {
                console.log('[AdManager] 广告加载或显示失败:', err);
                this._incrementCloseCount();
                callback(false);
            });
    }

    resetCloseCount(): void {
        this._closeCount = 0;
        this._saveCloseData();
        console.log('[AdManager] 重置连续关闭次数');
    }

    getDebugStatus(): any {
        return {
            lastAdTime: this._lastAdTime,
            cooldownRemaining: this.getCooldownRemaining(),
            closeCount: this._closeCount,
            isInCooldown: this.isInCooldown(),
            isBlockedByCloseCount: this.isBlockedByCloseCount(),
            isInNewbieProtection: this.isInNewbieProtection(),
            totalLevelsPlayed: this._totalLevelsPlayed,
            canShowAd: this.canShowAd(),
        };
    }
}

// ==================== 测试代码 ====================

interface TestResult {
    name: string;
    passed: boolean;
    message: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, message: string): void {
    results.push({ name, passed: condition, message });
    const status = condition ? '✅' : '❌';
    console.log(`${status} ${name}: ${message}\n`);
}

console.log('\n========== AdManager 功能验证 ==========\n');

// 测试1: 基本实例化
console.log('--- 测试1: 基本实例化 ---');
const adManager = new AdManagerSimple();
assert(adManager !== null, '实例化', 'AdManager 正常创建');

// 测试2: 新手保护期
console.log('\n--- 测试2: 新手保护期（前5关无广告）---');

// 初始：0关
mockStorage[STORAGE_KEYS.TOTAL_LEVELS_PLAYED] = 0;
mockStorage[STORAGE_KEYS.LAST_AD_TIME] = 0;
mockStorage[STORAGE_KEYS.CLOSE_COUNT] = 0;

let adManager2 = new AdManagerSimple();
let canShowLevel1 = adManager2.canShowAd();
let isProtectedLevel1 = adManager2.isInNewbieProtection();
assert(!canShowLevel1 && isProtectedLevel1, '关卡1-无广告', 
    `应不可展示 (canShow=${canShowLevel1}, isProtected=${isProtectedLevel1})`);

// 第4关完成（实际是第5关）
mockStorage[STORAGE_KEYS.TOTAL_LEVELS_PLAYED] = 4;
adManager2 = new AdManagerSimple();
const canShowLevel5 = adManager2.canShowAd();
const isProtectedLevel5 = adManager2.isInNewbieProtection();
assert(!canShowLevel5 && isProtectedLevel5, '关卡5-无广告', 
    `应不可展示 (canShow=${canShowLevel5}, isProtected=${isProtectedLevel5})`);

// 第5关完成（实际是第6关）
mockStorage[STORAGE_KEYS.TOTAL_LEVELS_PLAYED] = 5;
adManager2 = new AdManagerSimple();
const canShowLevel6 = adManager2.canShowAd();
assert(canShowLevel6 === true, '关卡6-有广告', 
    `应可展示 (canShow=${canShowLevel6})`);

// 测试3: 冷却机制
console.log('\n--- 测试3: 120秒冷却机制 ---');

mockStorage[STORAGE_KEYS.TOTAL_LEVELS_PLAYED] = 10;
mockStorage[STORAGE_KEYS.LAST_AD_TIME] = 0;

let adManager3 = new AdManagerSimple();

const canShowInitially = adManager3.canShowAd();
const cooldownInitially = adManager3.getCooldownRemaining();
assert(canShowInitially === true && cooldownInitially === 0, '初始状态', 
    `应可展示，冷却=0 (canShow=${canShowInitially}, cooldown=${cooldownInitially})`);

// 模拟刚刚看完广告 - 需要重新创建实例
const now = Date.now();
mockStorage[STORAGE_KEYS.LAST_AD_TIME] = now;
adManager3 = new AdManagerSimple();

const canShowDuringCooldown = adManager3.canShowAd();
const cooldownAfterAd = adManager3.getCooldownRemaining();

assert(!canShowDuringCooldown && cooldownAfterAd >= 119, '冷却中', 
    `不应展示，冷却>=119秒 (canShow=${canShowDuringCooldown}, cooldown=${cooldownAfterAd})`);

assert(adManager3.isInCooldown() === true, 'isInCooldown', 
    `应返回true (${adManager3.isInCooldown()})`);

// 测试4: 连续关闭限制
console.log('\n--- 测试4: 连续3次关闭后不再弹出 ---');

mockStorage[STORAGE_KEYS.TOTAL_LEVELS_PLAYED] = 10;
mockStorage[STORAGE_KEYS.LAST_AD_TIME] = 0;
mockStorage[STORAGE_KEYS.CLOSE_COUNT] = 0;
const today = new Date();
mockStorage[STORAGE_KEYS.CLOSE_DATE] = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

const adManager4 = new AdManagerSimple();

const canShowBeforeClose = adManager4.canShowAd();
assert(canShowBeforeClose === true, '初始可展示', `canShow=${canShowBeforeClose}`);

adManager4._incrementCloseCount();
assert(adManager4._closeCount === 1, '关闭1次', 'closeCount=1');

adManager4._incrementCloseCount();
assert(adManager4._closeCount === 2, '关闭2次', 'closeCount=2');

adManager4._incrementCloseCount();
const closeCount3 = adManager4._closeCount;
const isBlocked = adManager4.isBlockedByCloseCount();
assert(closeCount3 === 3 && isBlocked === true, '关闭3次-上限', 
    `closeCount=3, isBlocked=${isBlocked}`);

const canShowAfter3Closes = adManager4.canShowAd();
assert(canShowAfter3Closes === false, '关闭3次-禁止', `canShow=${canShowAfter3Closes}`);

// 测试5: 状态查询
console.log('\n--- 测试5: getDebugStatus 状态查询 ---');

const debugStatus = adManager4.getDebugStatus();
assert(debugStatus !== null && typeof debugStatus === 'object', '返回对象', '返回对象');

console.log('  调试状态:', JSON.stringify(debugStatus, null, 2));

// 测试6: resetCloseCount
console.log('\n--- 测试6: resetCloseCount ---');

adManager4.resetCloseCount();
assert(adManager4.getCloseCount() === 0 && !adManager4.isBlockedByCloseCount(), 
    '重置成功', 'closeCount=0, isBlocked=false');

// 测试7: 日志输出
console.log('\n--- 测试7: 广告调用日志输出 ---');

console.log('调用 showReviveAd:');
adManager4.showReviveAd((success) => {
    console.log(`  回调: success=${success}\n`);
});

console.log('调用 showRewardMultiplierAd:');
adManager4.showRewardMultiplierAd((success) => {
    console.log(`  回调: success=${success}\n`);
});

// 汇总
console.log('\n========== 验证结果汇总 ==========');
const passCount = results.filter(r => r.passed).length;
const totalCount = results.length;
console.log(`\n通过: ${passCount}/${totalCount}`);

if (passCount === totalCount) {
    console.log('\n🎉 所有验证项通过！\n');
} else {
    console.log('\n❌ 部分验证失败:\n');
    results.filter(r => !r.passed).forEach(r => {
        console.log(`  ${r.name}: ${r.message}`);
    });
}