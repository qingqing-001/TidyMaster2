/**
 * 数学工具函数
 */

/**
 * 限制数值范围
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * 线性插值
 */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/**
 * 计算两点距离
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 角度转弧度
 */
export function degToRad(degrees: number): number {
    return degrees * Math.PI / 180;
}

/**
 * 弧度转角度
 */
export function radToDeg(radians: number): number {
    return radians * 180 / Math.PI;
}

/**
 * 随机整数 [min, max]
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 随机浮点数 [min, max)
 */
export function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * 检查点是否在矩形内
 */
export function pointInRect(
    px: number, py: number,
    rx: number, ry: number,
    rw: number, rh: number
): boolean {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}
