# TidyMaster

微信小游戏 - 收纳整理游戏

## 项目简介

TidyMaster 是一款基于 Cocos Creator 3.8.6 开发的微信小游戏，核心玩法是让玩家通过拖拽、擦拭、折叠等方式整理物品，体验收纳的乐趣。

## 技术栈

- Cocos Creator 3.8.6
- TypeScript 5.3+
- 微信小游戏平台

## 项目结构

- `assets/scripts/` - TypeScript 源代码
  - `core/` - 核心管理器（GameManager、AudioManager、DataManager、EventManager、ResourceManager、AdManager）
  - `scenes/` - 场景控制器
  - `gameplay/` - 游戏玩法逻辑
  - `merge/` - 合成玩法与实验性循环实现
  - `collection/` - 收集系统
  - `social/` - 社交功能
  - `ui/` - UI 组件
  - `effects/` - 特效
  - `data/` - 数据定义
  - `utils/` - 工具函数
- `assets/resources/` - 资源文件
- `assets/scenes/` - Cocos 场景文件
- `assets/sub/` - 微信分包
- `scripts/` - 验证脚本与历史验证说明

## 开发说明

1. 类型检查：`npm run type-check`
2. 构建：使用 Cocos Creator 构建面板
3. 开发期脚本：当前仓库仅保留 `archive:verify:merge-loop` 作为 archive/internal 历史脚本占位；它不是正式验收入口，也不应与未来正式主循环验证并列

## 当前边界说明

- 当前仓库已具备拖拽、擦拭、折叠、关卡、合成、收集、社交、广告等模块代码与脚本骨架。
- `archive:verify:merge-loop` 的定位仍是 **archive/internal**，仅用于历史留档、内部排查或局部自测，不升格为正式验收入口。
- README、路线图、脚本说明等文档若提及合成循环验证，均应以“历史/内部/归档用途”表述，不能与正式验收口径并列宣传。
- 本轮文档收口后，正式对外可承诺的仍是：以当前任务范围内的静态检查、代码结构说明和里程碑文档为准；合成主循环尚未建立统一正式验收入口。

## 核心功能

- ✅ 基础收纳玩法（拖拽、擦拭、折叠）
- ✅ 关卡系统
- ⚠️ 合成玩法（已有代码骨架与局部逻辑；缺少可运行的正式主循环验收入口，当前仅保留 archive/internal 历史脚本占位）
- ✅ 收集系统（相册、赛季通行证、成就）
- ✅ 社交功能（分享、排行榜、好友助力）
- ✅ 广告变现
