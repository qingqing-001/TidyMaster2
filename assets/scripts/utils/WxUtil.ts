/**
 * 微信API封装层
 * 方便在非微信环境中Mock，统一错误处理
 */

/**
 * 检查是否在微信环境中
 */
export function isWx(): boolean {
    return typeof wx !== 'undefined';
}

/**
 * 数据存储
 */
export function saveData(key: string, data: any): void {
    if (isWx()) {
        wx.setStorageSync(key, data);
    } else {
        localStorage.setItem(key, JSON.stringify(data));
    }
}

export function loadData<T>(key: string, defaultVal: T): T {
    try {
        let data: any;
        if (isWx()) {
            data = wx.getStorageSync(key);
        } else {
            data = localStorage.getItem(key);
            data = data ? JSON.parse(data) : null;
        }
        return data !== null ? data : defaultVal;
    } catch (e) {
        return defaultVal;
    }
}

/**
 * 广告
 */
export function createRewardedVideoAd(adUnitId: string): any {
    if (isWx()) {
        return wx.createRewardedVideoAd({ adUnitId });
    }
    return null;
}

/**
 * 分享
 */
export interface ShareInfo {
    title: string;
    imageUrl?: string;
    query?: string;
}

export function shareAppMessage(shareInfo: ShareInfo): void {
    if (isWx()) {
        (wx as any).shareAppMessage({
            title: shareInfo.title,
            imageUrl: shareInfo.imageUrl,
            query: shareInfo.query
        });
    }
}

/**
 * 排行榜（开放域）
 */
export function postScore(key: string, value: number): void {
    if (isWx()) {
        const openDataContext = (wx as any).getOpenDataContext();
        openDataContext.postMessage({
            type: 'UPDATE_SCORE',
            key,
            value
        });
    }
}

/**
 * 社交 - 获取用户信息
 */
export interface UserInfo {
    nickName: string;
    avatarUrl: string;
    gender: number;
}

export function getUserInfo(): Promise<UserInfo> {
    return new Promise((resolve, reject) => {
        if (isWx()) {
            wx.getUserInfo({
                success: (res) => resolve(res.userInfo),
                fail: reject
            });
        } else {
            reject(new Error('Not in WeChat environment'));
        }
    });
}

/**
 * 社交 - 获取群信息
 */
export interface GroupInfo {
    openGId: string;
}

export function getGroupEnterInfo(): Promise<GroupInfo> {
    return new Promise((resolve, reject) => {
        if (isWx()) {
            wx.getGroupEnterInfo({
                success: (res: any) => resolve(res as GroupInfo),
                fail: reject
            });
        } else {
            reject(new Error('Not in WeChat environment'));
        }
    });
}

/**
 * 系统 - 获取系统信息
 */
export interface SystemInfo {
    model: string;
    system: string;
    platform: string;
    screenWidth: number;
    screenHeight: number;
}

export function getSystemInfoSync(): SystemInfo {
    if (isWx()) {
        return wx.getSystemInfoSync() as SystemInfo;
    }
    return {
        model: 'Browser',
        system: 'Unknown',
        platform: 'devtools',
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
    };
}

/**
 * 震动
 */
export function vibrateLong(): void {
    if (isWx()) {
        wx.vibrateLong();
    }
}

export function vibrateShort(): void {
    if (isWx()) {
        (wx as any).vibrateShort();
    }
}

/**
 * 登录
 */
export function login(): Promise<string> {
    return new Promise((resolve, reject) => {
        if (isWx()) {
            wx.login({
                success: (res) => resolve(res.code),
                fail: reject
            });
        } else {
            reject(new Error('Not in WeChat environment'));
        }
    });
}

/**
 * 显示Toast提示
 */
export function showToast(title: string, icon: 'success' | 'loading' | 'none' = 'none'): void {
    if (isWx()) {
        wx.showToast({ title, icon, duration: 2000 });
    } else {
        console.log(`[Toast] ${title}`);
    }
}

/**
 * 显示模态对话框
 */
export function showModal(title: string, content: string): Promise<boolean> {
    return new Promise((resolve) => {
        if (isWx()) {
            wx.showModal({
                title,
                content,
                success: (res) => resolve(res.confirm),
                fail: () => resolve(false)
            });
        } else {
            const result = confirm(`${title}\n${content}`);
            resolve(result);
        }
    });
}
