# TidyMaster

微信小游戏 - 收纳整理游戏

## 项目简介

TidyMaster 是一款基于 Cocos Creator 3.8.6 开发的微信小游戏，核心玩法是让玩家通过拖拽、擦拭、折叠等方式整理物品，体验收纳的乐趣。

## 技术栈

- Cocos Creator 3.8.6
- TypeScript 5.3+
- 微信小游戏平台

## 项目结构

当前仓库中与代码、资源和验证相关的主要目录如下：

- `assets/scripts/` - TypeScript 源代码
  - `audio/` - 音频管理实现
  - `collection/` - 图鉴、成就、赛季与房间装饰等系统
  - `core/` - 核心管理器与事件载荷定义
  - `data/` - 关卡、常量、成就与类型数据
  - `effects/` - 粒子、屏幕效果与 Tween 预设
  - `gameplay/` - 拖拽、擦拭、折叠、计时、关卡运行时逻辑
  - `merge/` - 合成棋盘与工具合成逻辑
  - `platform/` - 平台适配层
  - `scenes/` - 场景控制器
  - `social/` - 分享、排行、好友辅助
  - `ui/` - UI 组件
  - `utils/` - 工具函数
- `assets/resources/audio/` - 已跟踪的音频资源目录
- `assets/scenes/` - Cocos 场景目录
- `scripts/` - CLI 校验与历史验证脚本
- `types/` - 类型声明
- `weapp/` - 微信小游戏侧工程目录

## 开发说明

1. 前置类型检查：`npm run type-check`
2. `npm run build` 仅是 `npm run type-check` 的兼容别名，不属于正式验收入口
3. Cocos 构建产物请使用 Cocos Creator 构建面板生成

## 正式验收入口

当前仓库对外文档、提测口径、正式验收统一只认一个 npm script：

- `npm run verify:main-loop`

说明：

- `npm run verify:main-loop` 是唯一正式验收入口
- `npm run type-check` 仅为前置静态检查，不与正式验收入口并列
- `npm run build` 仅为 `type-check` 兼容别名，不代表新的验证口径
- 其余脚本即使仍保留在仓库中，也只属于历史归档或内部排障用途，不属于公开正式脚本集合

## 主循环闭环最小验证

为便于复核“真实关卡开始 → 关卡完成 → 结算 → 进入下一关继续游玩”的最小闭环，仓库提供以下唯一正式入口：

- `npm run verify:main-loop`

该脚本当前会校验以下关键状态流：

1. 从当前主流程进入真实第 1 关；
2. 第 1 关完成后发出 `LEVEL_COMPLETE`；
3. 基础奖励金币写入 `DataManager`，并发出 `COIN_CHANGE`；
4. 场景流转包含 `Game -> Result -> Home -> Game(下一关)`；
5. 当前进度推进到下一关，可继续主流程游玩。

依据：`scripts/verify-main-loop.ts` 当前实际断言 `sceneTransitions.length === 4`，并要求输出顺序为 `Game(1) -> Result -> Home -> Game(2)`。

可直接复核的实测结果已记录在：`MAIN_LOOP_VERIFICATION.md`

建议执行顺序：

1. `npm run type-check`
2. `npm run verify:main-loop`
3. 如需补充历史专题回归，只能按“历史/内部归档用途”手动执行相关脚本，不作为正式验收依据

## 历史/内部归档脚本说明

- `scripts/` 目录及相关专项说明文档中保留的验证脚本，仅用于排障、回溯或兼容旧记录
- 这些脚本不是公开正式验收入口，也不得在 README、发布说明、提测说明中与 `npm run verify:main-loop` 并列宣传
- `package.json` 中保留的 `archive:verify:*` 仅用于显式标识其“历史/内部归档用途”，它们的存在不构成第二套正式入口
- 若确需调用，必须显式注明为非正式、历史或内部用途；对外验收、提测、发布说明仍只认 `npm run verify:main-loop`

## 核心功能现状

以下条目仅表示仓库中存在相应代码或模块骨架，不代表全部已完成编辑器接线、真机验证或可直接作为当前里程碑验收结论：

- ✅ 已可通过 CLI 复核最小主循环闭环（`verify:main-loop`）
- ⚠️ 基础收纳玩法（拖拽、擦拭、折叠）已有代码实现，完整内容体验仍需编辑器/真机进一步复核
- ⚠️ 关卡系统已具备基础数据与运行时接线
- ⚠️ 合成玩法、收集系统、社交功能、广告系统等包含历史实现或骨架代码，但不属于当前正式验收口径
