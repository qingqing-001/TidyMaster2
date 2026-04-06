/**
 * 时间工具函数
 */

/**
 * 获取当前时间戳（秒）
 */
export function getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
}

/**
 * 格式化时间为 MM:SS
 */
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 格式化时间为 HH:MM:SS
 */
export function formatTimeLong(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 获取今天的日期字符串
 */
export function getTodayDateString(): string {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

/**
 * 计算两个日期字符串之间相差的天数
 */
export function getDaysBetween(dateStr1: string, dateStr2: string): number {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    const diffTime = Math.abs(date1.getTime() - date2.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 检查是否是新的一天
 */
export function isNewDay(lastDateString: string): boolean {
    const today = getTodayDateString();
    return today !== lastDateString;
}

/**
 * 获取本周的起始日期（周一）
 */
export function getWeekStart(): string {
    const date = new Date();
    const day = date.getDay() || 7; // 周日改为7
    const diff = day - 1;
    date.setDate(date.getDate() - diff);
    return getTodayDateString();
}
