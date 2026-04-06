# TidyMaster

微信小游戏 - 收纳整理游戏

## 项目简介

TidyMaster是一款基于Cocos Creator 3.8.6开发的微信小游戏，核心玩法是让玩家通过拖拽、擦拭、折叠等方式整理物品，体验收纳的乐趣。

## 技术栈

- Cocos Creator 3.8.6
- TypeScript 5.3+
- 微信小游戏平台

## 项目结构

- `assets/scripts/` - TypeScript源代码
  - `core/` - 核心管理器（ GameManager、AudioManager、DataManager、EventManager、ResourceManager、AdManager）
  - `scenes/` - 场景控制器
  - `gameplay/` - 游戏玩法逻辑
  - `merge/` - 合成玩法
  - `collection/` - 收集系统
  - `social/` - 社交功能
  - `ui/` - UI组件
  - `effects/` - 特效
  - `data/` - 数据定义
  - `utils/` - 工具函数
- `assets/resources/` - 资源文件
- `assets/scenes/` - Cocos场景文件
- `assets/sub/` - 微信分包

## 开发说明

1. 类型检查: `npm run type-check`
2. 构建: 使用Cocos Creator构建面板

## 核心功能

- ✅ 基础收纳玩法（拖拽、擦拭、折叠）
- ✅ 关卡系统
- ✅ 合成玩法
- ✅ 收集系统（相册、赛季通行证、成就）
- ✅ 社交功能（分享、排行榜、好友助力）
- ✅ 广告变现
