# Project Specification

> 边界说明：`spec.md` 主要描述《整理大师》的目标态设计与理想产品规格，不等同于当前仓库已经完成或已正式验收的实现范围。就本仓库当前可直接复核的正式结论而言，仅能以 `npm run verify:main-loop` 证明最小主循环闭环（真实第1关开始、完成、结算、回到 Home、进入下一关）。文中其余章节如描述玩法、商业化、社交、真机、完整内容体量等，默认应理解为设计目标或历史实现背景，而非当前一并通过验收的事实。

## What do you want to build?

# CLAUDE.md — 微信小游戏《整理大师》(TidyMaster) 完整开发规范

## 项目概述

**游戏名称**：整理大师 (TidyMaster)
**一句话描述**：一款融合ASMR解压整理 + 合成进化 + 收集养成的微信小游戏，玩家整理混乱场景获得满足感，通过合成工具升级解锁更多场景，以激励视频广告为核心变现。
**目标平台**：微信小游戏
**引擎**：Cocos Creator 3.8.6
**开发语言**：TypeScript
**变现模式**：激励视频广告（IAA）

---

## 一、游戏设计核心文档 (Game Design Document)

### 1.1 核心玩法循环 (Core Loop)

```
进入关卡（混乱场景）
    → 拖拽/分类/擦洗物品（30-90秒/关）
    → 物品归位时触发 ASMR 音效 + 粒子特效 + 震动反馈
    → 关卡完成 → 评分（1-3星）→ 获得金币 + 整理工具碎片
    → 工具碎片合成升级（合成进化系统）
    → 解锁新场景/新工具/新整理方式
    → 返回关卡选择 → 下一关
```

### 1.2 玩法详细设计

#### A. 整理玩法（每关核心）

每关呈现一个**混乱的生活场景**，玩家需要在限定时间内将物品整理到正确位置。

**场景类型**（按解锁顺序）：

| 章节 | 场景 | 核心操作 | 特殊机制 |
|------|------|----------|----------|
| 1 | 凌乱书桌 | 拖拽归类 | 物品按颜色/类型分区 |
| 2 | 混乱厨房 | 拖拽+擦洗 | 引入擦洗操作（手指滑动去污渍） |
| 3 | 爆炸衣柜 | 折叠+归类 | 衣服需先折叠（简单手势）再放入 |
| 4 | 杂乱冰箱 | 俄罗斯方块式摆放 | 物品有不同形状，需紧凑摆放 |
| 5 | 乱糟糟浴室 | 擦洗+归类+管道连接 | 引入简单连线谜题 |
| 6+ | 更多场景 | 混合操作 | 组合前述所有机制 |

**操作方式**（全部单指完成）：
- **拖拽**：手指按住物品 → 拖到目标区域 → 松手归位
- **擦洗**：手指在污渍区域来回滑动 → 污渍逐渐消失
- **折叠**：物品上出现折线 → 按顺序点击折线（1-3步）
- **旋转**：双指旋转或点击旋转按钮（冰箱关卡）

**ASMR反馈体系**（核心差异化！）：
```
每个操作都必须有令人满足的反馈：
- 物品归位：清脆的 "咔嗒" 声 + 物品微弹动画 + 小星星粒子
- 擦洗完成：光泽扫过表面 + "吱嘎" 清洁声
- 折叠完成：布料翻折声 + 物品缩放动画
- 整排整理完成：多巴胺连击音效 + 屏幕微闪 + 满足感震动
- 全关完成：交响乐式完成曲 + before/after对比展示 + 大量粒子庆祝
```

#### B. 合成进化系统（Meta层）

玩家通过关卡获得**工具碎片**，合成更高级的整理工具。工具提供实际增益效果。

**工具合成树**（类似合成大西瓜的进化链）：

```
抹布(Lv1) + 抹布(Lv1) → 海绵(Lv2)
海绵(Lv2) + 海绵(Lv2) → 刷子(Lv3)
刷子(Lv3) + 刷子(Lv3) → 清洁喷雾(Lv4)
清洁喷雾(Lv4) + 清洁喷雾(Lv4) → 吸尘器(Lv5)
吸尘器(Lv5) + 吸尘器(Lv5) → 整理机器人(Lv6)
整理机器人(Lv6) + 整理机器人(Lv6) → 魔法整理棒(Lv7)
```

**工具增益效果**：
- Lv1-2：时间 +5秒
- Lv3-4：自动整理1个物品（每关1次）
- Lv5-6：显示物品最佳摆放位置提示
- Lv7：一键整理1个区域（每关1次，终极能力）

合成界面采用 **3x4 格子棋盘**，玩家拖拽相同工具合并，新工具弹出时有夸张的缩放+光效+ASMR合成音效。

#### C. 收集与进度系统

**家居图鉴**：每个场景的物品都记入图鉴，收集率可见（蔡格尼克效应）
- 图鉴分：家具、文具、厨具、衣物、浴室用品等类别
- 收集进度：已收集/总数 百分比条，永远显示在主界面
- 里程碑奖励：每10%解锁一个装饰品用于自定义"我的房间"

**我的房间**：玩家可装饰的个人空间
- 用图鉴里程碑奖励和金币购买装饰品
- 好友可以访问"我的房间"，留下"整洁评分"
- 这是社交分享的核心载体

**赛季通行证**（Season Pass）：
- 每赛季4周，免费线 + 付费线（仅看广告解锁，不用付钱）
- 每日/每周任务驱动观看广告行为
- 赛季限定装饰品制造FOMO

### 1.3 难度曲线设计

```
关卡 1-5:   教学期（无时间限制，物品数3-5个，必定3星通关）
关卡 6-15:  入门期（宽松时限90s，物品数5-8个，2-3星）
关卡 16-30: 成长期（标准时限60s，物品数8-12个，引入新操作）
关卡 31-50: 挑战期（紧凑时限45s，物品数12-16个，混合操作）
关卡 51+:   大师期（极限时限30s，物品数16+，特殊障碍物）
```

**差一点效应设计**：
- 每5关设置一个"BOSS关"，难度陡增
- BOSS关通关率目标：首次30-40%（不看广告），70-80%（看广告获得道具后）
- 失败时显示"还差X个物品就成功了！"强化差一点感

**软失败机制**：
- 时间到后不直接判定失败，而是显示"时间不够了..."
- 提供"看广告续命30秒"的选项（核心广告位！）
- 如果不看广告，仍然给予部分奖励（已整理的物品对应的金币）

### 1.4 激励视频广告设计（< 3个核心广告点！）

**铁律：单次游戏流程中，核心广告触发点严格控制在2个以内。**

#### 广告位1：关卡失败续命（观看率预期60-80%）⭐ 主力
- **触发时机**：关卡时间耗尽，剩余未整理物品 ≤ 30%
- **呈现方式**：画面灰暗 → "还差一点点！" → 大按钮"看视频多30秒"
- **奖励**：额外30秒时间
- **限制**：每关最多续命1次
- **心理原理**：损失厌恶（已经整理了70%+不想白费）+ 差一点效应

#### 广告位2：奖励翻倍（观看率预期50-70%）⭐ 次力
- **触发时机**：关卡完成结算界面
- **呈现方式**："获得金币 x100" → "看视频翻3倍！x300"，翻倍按钮用金色高亮
- **奖励**：金币x3（不是x2，要让差距感更明显）
- **限制**：每3关出现1次（不是每关都有，避免疲劳）
- **心理原理**：禀赋效应（已经得到的可以变更多）

#### 广告位3（非核心流程）：每日免费宝箱
- **触发时机**：主界面每日一次
- **呈现方式**：闪烁的宝箱图标，点击后"看视频开启今日宝箱"
- **奖励**：随机工具碎片1-3个
- **限制**：每日1次
- **心理原理**：可变比率强化（随机碎片数量）

#### 广告位4（非核心流程）：赛季任务加速
- **触发时机**：赛季任务列表界面
- **呈现方式**："看视频完成1个任务进度"
- **奖励**：1个赛季任务进度
- **限制**：每日3次
- **心理原理**：蔡格尼克效应（赛季进度想完成）

**广告冷却机制**：
- 任意两次广告之间最少间隔 120 秒
- 日均目标：5-8次观看/用户
- 如果用户连续3次关闭广告弹窗，当日不再主动弹出（防反感）

**新手保护期**：
- Day0（前5关）：完全不展示任何广告
- Day0（6-10关）：仅展示续命广告位
- Day1+：全量广告位开放

### 1.5 社交裂变设计

#### 微信社交组件利用

**好友排行榜**（关系链数据）：
- 按"整理总面积"排名（不是关卡数，更有趣的指标）
- 排行榜用微信开放域实现
- 显示好友头像和"我的房间"预览

**分享机制**：
- 关卡完成后的 before/after 对比图（最核心的传播物料！）
- 自动生成左右对比图：混乱状态 vs 整洁状态
- 附带文案："我把这个房间整理好了！你来试试？"
- before/after 图片是天然的社交货币，满足感+炫耀
- 使用 `wx.shareAppMessage()` 和 `wx.updateShareMenu()`

**群PK功能**（利用微信群组件）：
- "发起群挑战"：同一关卡，比谁整理更快
- 群友排名用排行榜展示
- 使用 `wx.getGroupEnterInfo()` 获取群身份

**好友互动**：
- 好友之间可以互相"送扫帚"（每日免费帮好友送1个工具碎片）
- 访问好友"我的房间"，可点赞
- 使用 `wx.createGameClubButton()` 创建社区入口

### 1.6 留存机制设计

**每日登录奖励**（7天循环，连续签到递增）：
```
Day1: 金币x50
Day2: 金币x100
Day3: 随机工具碎片x1
Day4: 金币x200
Day5: 随机工具碎片x2
Day6: 金币x500
Day7: 高级工具碎片x1 + 限定装饰品
```
- 中断1天可看广告补签（最多补1天）
- 连续签到7天后重置，但基础奖励提升10%

**每日任务**（3个/日）：
- "整理3个关卡" → 金币x200
- "使用工具2次" → 工具碎片x1
- "分享1次" → 金币x100
- 完成全部3个 → 额外奖励宝箱

**成就系统**：
- 里程碑成就："整理100个物品"、"达成10次3星"、"合成Lv5工具"
- 每个成就解锁对应的"称号"，显示在好友排行榜上
- 总共设计50+个成就，确保持续有"快完成了"的感觉

---

## 二、技术架构规范

### 2.1 技术栈

```
引擎：Cocos Creator 3.8.6
语言：TypeScript (strict mode)
构建目标：微信小游戏
2D渲染：Cocos Creator 内置 2D 渲染管线
物理：不使用物理引擎（纯逻辑拖拽，无需物理模拟）
音频：Cocos AudioEngine + 微信 InnerAudioContext
动画：Cocos Tween系统 + 关键帧动画
UI框架：Cocos Creator UI组件（Label, Sprite, Button, Layout, ScrollView）
数据存储：wx.setStorageSync / wx.getStorageSync（本地）
排行榜：微信开放域（wx.getOpenDataContext）
广告：wx.createRewardedVideoAd
```

### 2.2 项目目录结构

```
TidyMaster/
├── assets/
│   ├── scripts/               # TypeScript源码
│   │   ├── core/              # 核心框架
│   │   │   ├── GameManager.ts        # 游戏全局管理器（单例）
│   │   │   ├── AudioManager.ts       # 音频管理器
│   │   │   ├── DataManager.ts        # 数据持久化管理器
│   │   │   ├── EventManager.ts       # 事件总线
│   │   │   ├── ResourceManager.ts    # 资源加载管理器
│   │   │   └── AdManager.ts          # 广告管理器
│   │   ├── scenes/            # 场景控制器
│   │   │   ├── LaunchScene.ts        # 启动/Loading场景
│   │   │   ├── HomeScene.ts          # 主页场景
│   │   │   ├── GameScene.ts          # 游戏关卡场景
│   │   │   ├── ResultScene.ts        # 结算场景
│   │   │   └── MyRoomScene.ts        # 我的房间场景
│   │   ├── gameplay/          # 玩法逻辑
│   │   │   ├── LevelManager.ts       # 关卡管理器
│   │   │   ├── ItemController.ts     # 可整理物品控制器
│   │   │   ├── SlotController.ts     # 目标位置控制器
│   │   │   ├── DragHandler.ts        # 拖拽操作处理器
│   │   │   ├── WipeHandler.ts        # 擦洗操作处理器
│   │   │   ├── FoldHandler.ts        # 折叠操作处理器
│   │   │   ├── ScoreCalculator.ts    # 评分计算器
│   │   │   └── TimerController.ts    # 倒计时控制器
│   │   ├── merge/             # 合成系统
│   │   │   ├── MergeBoard.ts         # 合成面板（3x4格子）
│   │   │   ├── ToolItem.ts           # 工具物品
│   │   │   └── MergeLogic.ts         # 合成逻辑
│   │   ├── collection/        # 收集系统
│   │   │   ├── AlbumManager.ts       # 图鉴管理器
│   │   │   ├── SeasonPass.ts         # 赛季通行证
│   │   │   └── AchievementManager.ts # 成就管理器
│   │   ├── social/            # 社交系统
│   │   │   ├── WxShareManager.ts     # 微信分享
│   │   │   ├── RankingManager.ts     # 排行榜（开放域）
│   │   │   └── FriendHelper.ts       # 好友互动
│   │   ├── ui/                # UI组件
│   │   │   ├── DailyCheckin.ts       # 每日签到
│   │   │   ├── DailyTask.ts          # 每日任务
│   │   │   ├── SettingsPanel.ts      # 设置面板
│   │   │   ├── ShopPanel.ts          # 商店面板
│   │   │   ├── StarRating.ts         # 星级评价组件
│   │   │   ├── BeforeAfterCompare.ts # 整理前后对比组件
│   │   │   ├── ToolTip.ts            # 新手引导提示
│   │   │   └── LoadingBar.ts         # 加载进度条
│   │   ├── effects/           # 特效
│   │   │   ├── ParticleEffects.ts    # 粒子特效管理
│   │   │   ├── ScreenEffects.ts      # 屏幕特效（闪屏等）
│   │   │   └── TweenPresets.ts       # 预设缓动动画
│   │   ├── data/              # 数据定义
│   │   │   ├── LevelData.ts          # 关卡数据结构
│   │   │   ├── ItemData.ts           # 物品数据定义
│   │   │   ├── ToolData.ts           # 工具数据定义
│   │   │   ├── AchievementData.ts    # 成就数据定义
│   │   │   └── Constants.ts          # 全局常量
│   │   └── utils/             # 工具函数
│   │       ├── MathUtil.ts           # 数学工具
│   │       ├── TimeUtil.ts           # 时间工具
│   │       └── WxUtil.ts             # 微信API封装
│   ├── resources/             # 动态加载资源
│   │   ├── levels/            # 关卡配置JSON
│   │   ├── textures/          # 图片资源
│   │   │   ├── items/         # 物品图片
│   │   │   ├── tools/         # 工具图片
│   │   │   ├── scenes/        # 场景背景
│   │   │   └── ui/            # UI图片
│   │   ├── audio/             # 音频资源
│   │   │   ├── bgm/           # 背景音乐
│   │   │   ├── sfx/           # ASMR音效
│   │   │   └── ui/            # UI音效
│   │   ├── prefabs/           # 预制体
│   │   └── animations/        # 动画资源
│   ├── scenes/                # 场景文件
│   │   ├── Launch.scene
│   │   ├── Home.scene
│   │   ├── Game.scene
│   │   ├── Result.scene
│   │   └── MyRoom.scene
│   └── sub/                   # 微信开放域子包
│       └── scripts/
│           └── RankList.ts    # 排行榜渲染脚本
├── CLAUDE.md                  # 本文件
├── tsconfig.json
└── project.json
```

### 2.3 核心类设计规范

#### GameManager.ts（全局单例）

```typescript
// 游戏状态枚举
enum GameState {
    LOADING,    // 加载中
    HOME,       // 主页
    PLAYING,    // 游戏中
    PAUSED,     // 暂停
    RESULT,     // 结算
    MY_ROOM     // 我的房间
}

// GameManager 管理全局状态、场景切换、系统初始化
// 使用 cc.director.getScene() 配合场景预加载
// 所有Manager通过GameManager统一初始化和访问
```

#### LevelData.ts（关卡数据结构）

```typescript
interface LevelConfig {
    id: number;                    // 关卡ID
    chapter: number;               // 章节号
    sceneName: string;             // 场景名（desk/kitchen/closet等）
    timeLimit: number;             // 时间限制（秒），0=无限制
    items: ItemConfig[];           // 物品列表
    slots: SlotConfig[];           // 目标位置列表
    starThresholds: [number, number, number]; // 1/2/3星的完成度阈值
    isBoss: boolean;               // 是否BOSS关
    operations: OperationType[];   // 本关涉及的操作类型
    bgmKey: string;                // 背景音乐key
}

interface ItemConfig {
    id: string;                    // 物品唯一ID
    type: string;                  // 物品类型（book/cup/cloth等）
    spriteKey: string;             // 图片资源key
    initialPos: { x: number, y: number }; // 初始位置
    targetSlotId: string;          // 目标位置ID
    operation: OperationType;      // 需要的操作类型
    sortOrder: number;             // 渲染排序
}

interface SlotConfig {
    id: string;                    // 位置唯一ID
    pos: { x: number, y: number }; // 目标位置
    acceptTypes: string[];         // 接受的物品类型
    size: { w: number, h: number }; // 区域大小
}

enum OperationType {
    DRAG = 'drag',       // 拖拽
    WIPE = 'wipe',       // 擦洗
    FOLD = 'fold',       // 折叠
    ROTATE = 'rotate'    // 旋转
}
```

#### AdManager.ts（广告管理器）

```typescript
// 核心原则：
// 1. 单次游戏流程核心广告点 < 3个
// 2. 两次广告间隔 >= 120秒
// 3. 新手保护期（前5关无广告）
// 4. 连续3次关闭则当日不再主动弹出
// 5. 所有广告调用 wx.createRewardedVideoAd()

class AdManager {
    private lastAdTime: number = 0;
    private closeCount: number = 0;
    private dailyViewCount: number = 0;
    
    // 广告位ID常量（需要在微信后台申请后填入）
    static readonly AD_UNIT_REVIVE = 'adunit-revive-xxx';
    static readonly AD_UNIT_REWARD = 'adunit-reward-xxx';
    static readonly AD_UNIT_DAILY = 'adunit-daily-xxx';
    static readonly AD_UNIT_SEASON = 'adunit-season-xxx';

    canShowAd(): boolean {
        // 检查：新手保护期、冷却时间、当日关闭次数
    }
    
    showReviveAd(callback: (success: boolean) => void): void {
        // 续命广告
    }
    
    showRewardMultiplierAd(callback: (success: boolean) => void): void {
        // 奖励翻倍广告
    }
}
```

#### DragHandler.ts（拖拽操作核心）

```typescript
// 拖拽操作是最核心的交互，必须做到：
// 1. 触摸响应 < 16ms（不卡顿）
// 2. 拖拽时物品跟随手指，无延迟感
// 3. 拖到目标区域时有吸附提示（目标区域高亮）
// 4. 松手时判断是否在目标区域：
//    - 在目标区域 → 吸附归位 + ASMR音效 + 粒子特效
//    - 不在目标区域 → 弹回原位（弹性缓动）
// 5. 使用 cc.Node 的 touch 事件：TOUCH_START/TOUCH_MOVE/TOUCH_END
// 6. 拖拽时物品放大1.1倍 + 添加阴影，制造"拿起"的感觉
// 7. 归位动画使用 cc.tween + easeBackOut 弹性效果
```

### 2.4 音效设计规范（ASMR核心差异化）

```
音效是本游戏的灵魂，每个音效都要让人感到满足。

必须包含以下音效文件（可先用占位音效，后替换高质量版本）：

sfx_item_pickup.mp3      - 拿起物品（轻微的"嗖"声）
sfx_item_place.mp3       - 物品归位（清脆的"咔嗒"声，最重要！）
sfx_item_wrong.mp3       - 放错位置（柔和的"咚"声）
sfx_item_bounce.mp3      - 弹回原位（弹性"嘣"声）
sfx_wipe_loop.mp3        - 擦洗循环（"唰唰"擦拭声）
sfx_wipe_clean.mp3       - 擦洗完成（"叮~"清亮声+光泽音效）
sfx_fold_step.mp3        - 折叠一步（布料翻折声）
sfx_fold_done.mp3        - 折叠完成（满意的"嗒"声）
sfx_combo_1.mp3          - 连续归位1（音高递增的第1个音）
sfx_combo_2.mp3          - 连续归位2（音高递增的第2个音）
sfx_combo_3.mp3          - 连续归位3（音高递增的第3个音）
sfx_combo_max.mp3        - 连续归位4+（华丽音效）
sfx_star_1.mp3           - 获得1星
sfx_star_2.mp3           - 获得2星
sfx_star_3.mp3           - 获得3星（最华丽）
sfx_merge.mp3            - 合成成功（合成音+升级感）
sfx_level_complete.mp3   - 关卡完成（交响曲片段）
sfx_time_warning.mp3     - 时间不足10秒提醒（嘀嗒加速）
sfx_button_click.mp3     - UI按钮点击
sfx_coin_collect.mp3     - 获得金币
sfx_chest_open.mp3       - 开宝箱

bgm_home.mp3             - 主页BGM（轻松治愈的lo-fi节奏）
bgm_game_calm.mp3        - 游戏内BGM-平静（前期关卡）
bgm_game_rush.mp3        - 游戏内BGM-紧张（后期关卡/BOSS关）

连击系统（Combo）：
- 2秒内连续归位多个物品触发Combo
- Combo音效音高递增：C → E → G → 高八度C
- Combo 4+时触发屏幕边缘彩虹光效
```

### 2.5 UI/UX设计规范

**整体风格**：日式治愈风 + 柔和色调

**色彩方案**：
```
主色：#FFB347（暖橙，温暖感）
辅色：#87CEEB（天蓝，清洁感）
强调色：#FFD700（金色，用于金币和高亮）
背景色：#FFF8E7（奶油白，柔和不刺眼）
文字色：#4A4A4A（深灰，不用纯黑）
成功色：#7BC67E（柔和绿）
警告色：#FF6B6B（柔和红，仅用于时间不足提醒）
```

**字体**：
- 标题：思源黑体 Bold / 站酷小薇体（可爱感）
- 正文：思源黑体 Regular
- 数字：DIN Alternate Bold（数字显示更专业）
- 注意微信小游戏字体需要走位图字体或动态加载

**按钮设计**：
- 圆角矩形（radius 12-16px），微弹动画 on press
- 主按钮：橙色底+白字，hover放大1.05x
- 次按钮：白色底+灰色边框+深灰字
- 广告按钮：金色底+白字+小视频图标，比普通按钮大20%

**过渡动画**：
- 场景切换：淡入淡出（0.3s），用 cc.director.loadScene + 自定义transition
- 弹窗：从中心缩放弹出（0.2s easeBackOut）
- 列表项：依次进入（stagger 0.05s each）

### 2.6 性能优化规范

```
微信小游戏性能红线（必须遵守）：

1. 主包大小 < 4MB
   - 代码全部在主包
   - 图片/音频全部走 resources/ 远程加载
   - 使用引擎裁剪：关闭 3D、物理引擎、VideoPlayer、WebView等

2. 首屏加载 < 3秒
   - 启动场景只包含Logo和进度条
   - 资源预加载使用 cc.resources.preload()
   - 首次只加载主页+第一关资源

3. DrawCall < 80
   - 使用TexturePacker打图集（最多3-4张1024x1024图集）
   - 同一场景的UI元素尽量合到同一图集
   - 使用 cc.Sprite 的合批渲染

4. 内存 < 150MB
   - 场景切换时释放上一场景资源：cc.assetManager.releaseAsset()
   - 对象池复用：物品、粒子、特效节点
   - 音频按需加载，不预加载所有音效

5. 帧率 >= 55fps
   - 避免在 update() 中创建新对象
   - 粒子数量控制在同时 < 50个
   - 拖拽时减少不必要的碰撞检测
```

### 2.7 微信API封装层 (WxUtil.ts)

```typescript
// 封装所有微信特有API，方便：
// 1. 在非微信环境（浏览器预览）中Mock
// 2. 统一错误处理
// 3. 类型安全

class WxUtil {
    static isWx(): boolean {
        return typeof wx !== 'undefined';
    }

    // 数据存储
    static saveData(key: string, data: any): void
    static loadData<T>(key: string, defaultVal: T): T

    // 广告
    static createRewardedVideoAd(adUnitId: string): any
    
    // 分享
    static shareAppMessage(title: string, imageUrl: string, query?: string): void
    static onShareAppMessage(callback: () => ShareInfo): void
    
    // 排行榜（开放域）
    static postScore(key: string, value: number): void
    
    // 社交
    static getUserInfo(): Promise<UserInfo>
    static getGroupEnterInfo(): Promise<GroupInfo>
    
    // 系统
    static getSystemInfoSync(): SystemInfo
    static vibrateLong(): void  // 长震动（完成关卡）
    static vibrateShort(): void // 短震动（物品归位）
    
    // 登录
    static login(): Promise<string> // 获取code
}
```

---

## 三、开发阶段规划

### Phase 1：核心原型（2周）—— MVP验证

**目标**：可玩的核心整理玩法 + 1个场景

- [ ] 搭建Cocos Creator 3.8.6项目骨架
- [ ] 实现 GameManager / EventManager / DataManager 基础框架
- [ ] 实现 DragHandler（拖拽操作，含吸附和弹回）
- [ ] 实现 LevelManager（关卡加载/初始化/完成判定）
- [ ] 实现 TimerController（倒计时 + 时间不足警告）
- [ ] 制作第1章"凌乱书桌"的5个教学关卡
- [ ] 实现基础评分（3星系统）
- [ ] 实现 before/after 对比展示
- [ ] 占位音效集成（使用免费ASMR音效）
- [ ] 基本粒子特效（归位星星、完成庆祝）
- [ ] 微信小游戏构建+真机测试

**Phase 1 验收标准**：
- 能在微信开发者工具中运行
- 能完整玩通5个教学关卡
- 拖拽手感流畅（无明显延迟）
- 物品归位有音效+动画反馈
- 关卡完成有评分和对比展示

### Phase 2：系统完善（2周）

- [ ] 实现擦洗操作（WipeHandler）
- [ ] 实现折叠操作（FoldHandler）
- [ ] 实现合成系统（MergeBoard + MergeLogic）
- [ ] 实现第2-3章关卡（厨房+衣柜，共20关）
- [ ] 实现 AdManager + 广告位1（续命）和广告位2（翻倍）
- [ ] 实现每日签到系统
- [ ] 实现金币经济系统
- [ ] 实现工具系统（使用工具的效果）
- [ ] 完善 Combo 连击音效系统
- [ ] Home场景 UI 完整实现

### Phase 3：社交与留存（1-2周）

- [ ] 实现微信分享（before/after对比图分享）
- [ ] 实现微信排行榜（开放域）
- [ ] 实现"我的房间"装饰系统
- [ ] 实现图鉴收集系统
- [ ] 实现成就系统
- [ ] 实现每日任务
- [ ] 实现赛季通行证（免费线）
- [ ] 实现广告位3（每日宝箱）和广告位4（赛季加速）
- [ ] 新手引导完整流程

### Phase 4：打磨上线（1周）

- [ ] 全关卡数值平衡调优
- [ ] 音效替换为高质量版本
- [ ] 性能优化（DrawCall、内存、加载速度）
- [ ] 包体优化（引擎裁剪、纹理压缩）
- [ ] 埋点统计接入（关卡通过率、广告观看率、留存数据）
- [ ] 微信审核适配（版号/资质检查）
- [ ] 全量真机测试（iOS + Android + iPad + PC端微信）
- [ ] 提交微信审核

---

## 四、编码规范

### 4.1 TypeScript规范

```typescript
// 1. 使用 strict 模式
// tsconfig.json: "strict": true

// 2. 所有 Cocos Creator 组件使用装饰器
import { _decorator, Component, Node, Sprite, Label, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemController')
export class ItemController extends Component {
    @property(Sprite)
    itemSprite: Sprite = null!;  // 使用 null! 断言
    
    @property(Label)
    nameLabel: Label = null!;
    
    // 私有成员用下划线前缀
    private _isDragging: boolean = false;
    private _originalPos: Vec3 = new Vec3();
    
    // 生命周期方法顺序：onLoad → start → update → onDestroy
    onLoad() { }
    start() { }
    update(dt: number) { }
    onDestroy() { }
}

// 3. 事件名使用常量
export const GameEvents = {
    ITEM_PLACED: 'item-placed',
    LEVEL_COMPLETE: 'level-complete',
    COMBO_TRIGGERED: 'combo-triggered',
    AD_REWARD_GRANTED: 'ad-reward-granted',
    SCORE_UPDATED: 'score-updated',
} as const;

// 4. 管理器使用单例模式
export class AudioManager {
    private static _instance: AudioManager;
    static get instance(): AudioManager {
        if (!this._instance) {
            this._instance = new AudioManager();
        }
        return this._instance;
    }
    private constructor() { }
}

// 5. 异步操作使用 async/await
async loadLevel(levelId: number): Promise<LevelConfig> {
    const config = await new Promise<LevelConfig>((resolve, reject) => {
        cc.resources.load(`levels/level_${levelId}`, JsonAsset, (err, asset) => {
            if (err) reject(err);
            else resolve(asset.json as LevelConfig);
        });
    });
    return config;
}

// 6. 注释规范：中文注释，关键逻辑必须注释
// 7. 每个文件不超过300行，超过则拆分
// 8. 禁止使用 any 类型，必须定义 interface
```

### 4.2 资源命名规范

```
图片：
  items/item_{type}_{variant}.png      例：item_book_red.png
  tools/tool_{name}_lv{n}.png          例：tool_sponge_lv2.png
  scenes/scene_{name}_bg.png           例：scene_desk_bg.png
  ui/btn_{name}_{state}.png            例：btn_play_normal.png
  ui/icon_{name}.png                   例：icon_coin.png

音效：
  sfx_{action}_{variant}.mp3           例：sfx_place_combo3.mp3
  bgm_{scene}_{mood}.mp3               例：bgm_game_calm.mp3

关卡：
  levels/level_{id}.json               例：level_001.json
  
预制体：
  prefabs/{category}/{name}.prefab     例：prefabs/items/BookRed.prefab

动画：
  animations/{name}_{action}.anim      例：animations/item_bounce.anim
```

### 4.3 Git规范

```
分支策略：
  main          - 稳定版本，可直接构建发布
  develop       - 开发分支
  feature/xxx   - 功能分支
  hotfix/xxx    - 热修复

提交信息格式：
  feat: 添加拖拽操作的吸附效果
  fix: 修复iOS上音效播放延迟问题
  perf: 优化DrawCall从120降至75
  refactor: 重构AdManager的冷却逻辑
  asset: 添加第2章厨房场景资源
  docs: 更新CLAUDE.md的关卡数据结构
```

---

## 五、关卡数据格式示例

### level_001.json（第1关：凌乱书桌-教学1）

```json
{
    "id": 1,
    "chapter": 1,
    "sceneName": "desk",
    "timeLimit": 0,
    "isBoss": false,
    "operations": ["drag"],
    "bgmKey": "bgm_game_calm",
    "tutorial": {
        "enabled": true,
        "steps": [
            {
                "type": "highlight",
                "targetItemId": "book_1",
                "text": "按住这本书，拖到书架上吧！",
                "arrowDirection": "right"
            }
        ]
    },
    "items": [
        {
            "id": "book_1",
            "type": "book",
            "spriteKey": "item_book_red",
            "initialPos": { "x": 100, "y": 200 },
            "targetSlotId": "shelf_1",
            "operation": "drag",
            "sortOrder": 1
        },
        {
            "id": "pen_1",
            "type": "stationery",
            "spriteKey": "item_pen_blue",
            "initialPos": { "x": 250, "y": 150 },
            "targetSlotId": "penholder_1",
            "operation": "drag",
            "sortOrder": 2
        },
        {
            "id": "cup_1",
            "type": "drinkware",
            "spriteKey": "item_cup_white",
            "initialPos": { "x": 350, "y": 300 },
            "targetSlotId": "coaster_1",
            "operation": "drag",
            "sortOrder": 3
        }
    ],
    "slots": [
        {
            "id": "shelf_1",
            "pos": { "x": 500, "y": 400 },
            "acceptTypes": ["book"],
            "size": { "w": 80, "h": 60 },
            "hintSprite": "slot_shelf_hint"
        },
        {
            "id": "penholder_1",
            "pos": { "x": 450, "y": 200 },
            "acceptTypes": ["stationery"],
            "size": { "w": 40, "h": 60 },
            "hintSprite": "slot_penholder_hint"
        },
        {
            "id": "coaster_1",
            "pos": { "x": 200, "y": 100 },
            "acceptTypes": ["drinkware"],
            "size": { "w": 60, "h": 60 },
            "hintSprite": "slot_coaster_hint"
        }
    ],
    "starThresholds": [0.5, 0.8, 1.0],
    "rewards": {
        "baseCoin": 50,
        "toolFragments": 1
    }
}
```

---

## 六、占位资源生成策略

在正式美术资源到位之前，Claude Code 应该生成程序化占位资源：

```typescript
// 物品占位：使用不同颜色+形状的简单几何图形
// 书 → 蓝色矩形
// 杯子 → 红色圆形
// 笔 → 绿色细长矩形
// 衣服 → 粉色不规则形

// 场景背景占位：纯色 + 网格线标识区域
// 书架区域 → 浅棕色矩形
// 笔筒区域 → 灰色圆形

// 使用 cc.Graphics 组件在运行时绘制占位图形
// 这样无需任何图片资源就能跑通全部游戏逻辑
```

---

## 七、测试检查清单

### 功能测试
- [ ] 所有关卡可完整通关
- [ ] 拖拽/擦洗/折叠操作响应正确
- [ ] 合成系统正确合并同级工具
- [ ] 广告调用正常（微信开发者工具模拟）
- [ ] 存档/读档正确（退出重进数据不丢失）
- [ ] 分享功能正常生成对比图
- [ ] 排行榜正确显示

### 性能测试
- [ ] 主包 < 4MB
- [ ] 首屏加载 < 3秒
- [ ] 游戏帧率 >= 55fps（中端机型）
- [ ] 内存峰值 < 150MB
- [ ] 连续玩20关无内存泄漏

### 兼容性测试
- [ ] iOS 微信（iPhone 8及以上）
- [ ] Android 微信（中端机型）
- [ ] iPad 微信
- [ ] PC端微信
- [ ] 微信开发者工具

### 广告测试
- [ ] 新手期无广告（前5关）
- [ ] 续命广告正确触发和奖励
- [ ] 翻倍广告正确触发和奖励
- [ ] 广告冷却120秒生效
- [ ] 连续3次关闭后不再弹出
- [ ] 广告失败时的fallback处理

---

## 八、注意事项

1. **Cocos Creator 项目只能在 Cocos Creator 编辑器中创建和管理场景**，Claude Code 负责编写所有 TypeScript 脚本代码和 JSON 数据文件，场景搭建需要用户在编辑器中完成（拖拽节点、绑定组件）。

2. **微信小游戏没有 DOM/BOM**，不能使用 document、window、XMLHttpRequest 等浏览器API。所有网络请求用 wx.request()，定时器用 cc.scheduler。

3. **开放域（子域）限制**：排行榜相关代码运行在独立的 JS 环境中，不能访问主域的任何对象。主域通过 postMessage 向子域发送数据。

4. **资源加载路径**：微信小游戏中 cc.resources.load() 的路径是相对于 assets/resources/ 的相对路径，不含扩展名。

5. **TypeScript 编译**：Cocos Creator 3.8 内置 TS 编译，无需额外配置 webpack。

6. **先做减法**：Phase 1 只做最核心的拖拽玩法，其他所有系统都是 Phase 2+ 才添加的。不要在 Phase 1 就写合成系统或社交系统的代码。

7. **音效是灵魂**：即使使用占位音效，也要在 Phase 1 就把音效触发时机做对。每次物品归位必须有即时音频反馈，这是游戏满足感的核心。

8. **图片资源延后**：所有图片资源用代码绘制的占位图形代替（cc.Graphics）。只有游戏逻辑验证通过后，才替换为正式美术资源。

9. **微信审核要求**：小游戏需要软件著作权或版号（取决于是否有虚拟货币系统）。需提前准备：游戏截图5张、游戏简介、隐私政策页面。

## How do you consider the project is success?

开发一款完整可运行的微信小游戏《整理大师》（TidyMaster）。这是一款 ASMR 解压整理 + 合成进化 + 收集养成的休闲小游戏。玩家在混乱场景中拖拽物品到正确位置，获得 ASMR 满足感反馈。通过激励视频广告变现。
成功标准（目标态设计，非当前正式整体验收清单）

若讨论“当前仓库已可直接复核的正式验收范围”，请仅以 `npm run verify:main-loop` 覆盖的最小主循环闭环为准，而不要直接把以下目标态条目视为现阶段均已完成：

在微信开发者工具中能完整运行，无报错
包含至少 30 个可玩关卡（3章 x 10关），难度递进
拖拽操作流畅（触摸响应 < 16ms）
每次物品归位有即时视觉 + 音效反馈
合成系统可用（拖拽合并同级工具）
激励视频广告位正确集成（续命 + 翻倍，核心流程 < 3 个广告点）
微信分享功能可用（before/after 对比图）
本地存档可用（进度/金币/工具不丢失）
主包 < 4MB
所有UI用代码绘制（Canvas 2D），无外部图片依赖
