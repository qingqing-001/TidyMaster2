/**
 * 工具数据定义
 * 合成系统中的工具数据
 */

export interface ToolData {
    id: string;
    name: string;
    level: number;         // 等级 1-7
    spriteKey: string;
    description: string;
    bonus: ToolBonus;
}

export interface ToolBonus {
    timeBonus: number;      // 时间加成（秒）
    autoSort: boolean;       // 是否自动整理
    showHint: boolean;       // 是否显示提示
    oneClickSort: boolean;   // 是否一键整理
}

export const TOOL_NAMES = [
    '抹布',      // Lv1
    '海绵',      // Lv2
    '刷子',      // Lv3
    '清洁喷雾',  // Lv4
    '吸尘器',    // Lv5
    '整理机器人',// Lv6
    '魔法整理棒' // Lv7
] as const;
