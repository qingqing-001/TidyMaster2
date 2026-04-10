# TidyMaster 交付路线与状态说明

## 概述

本文件按交付仓库口径说明项目路线与当前状态。文中若提到历史里程碑、历史完成、历史验证或历史失败，均只应理解为对应时间点的记录；除非与当前顶层文档和 `package.json` 同步，否则不构成当前现行交付结论。

---

## 当前统一交付边界

- 当前不存在覆盖全项目的正式 `main loop` / `merge loop` 验收入口。
- `npm run verify:chapter1-drag-loop` 当前保留为第 1 章拖拽闭环的正式命名导航入口，但当前只输出统一说明信息，不应据此外推出仓库已提供独立一键闭环验证实现。
- `archive:verify:merge-loop` 仅为 archive/internal 历史占位脚本，不属于正式交付入口。
- `archive/history/root-signals/` 与 `archive/history/internal-scripts/` 中的材料统一按历史归档理解，不构成当前交付结论。
- 当前稳定、仓库级、可直接执行的正式入口包括：`npm run type-check`。
- 当前更准确的交付状态是：**已交付项目源码、资源、配置与边界说明文档；尚未交付覆盖全项目的正式主循环/合成循环验收链路。**

---

## 已交付的主要内容类型

### 1. 项目基础结构

- Cocos Creator 项目配置
- TypeScript 配置
- 源码目录与资源目录
- 微信小游戏构建侧配置

### 2. 代码与资源资产

仓库内已入库的内容包括但不限于：

- 场景资源
- 拖拽相关实现
- 折叠、合成、UI、音频等模块代码
- 若干历史验证脚本与说明材料（仅作追溯用途）

### 3. 当前可引用的正式入口

- `npm run type-check`
- `npm run verify:chapter1-drag-loop`（正式命名导航入口）

---

## 历史里程碑如何理解

### Phase 1：核心原型

- 历史上已经形成项目基础结构、若干玩法模块与首章相关验证命名。
- 当前交付仓库只保留这些代码与材料的入库事实，不把历史“已完成 / 已验证 / 失败”直接当作现行交付结论。

### Phase 2：系统扩展

- 仓库中保留了多操作类型、合成、广告、社交等不同程度的代码与历史材料。
- 在顶层入口未同步升格前，这些内容只能说明“已有实现或历史验证素材”，不能说明“已经形成正式仓库级验收入口”。

---

## 审查者阅读建议

外部只读审查者建议按以下顺序判断当前交付状态：

1. `README.md`
2. `MAIN_LOOP_VERIFICATION.md`
3. `VERIFY_NAMING_HISTORY.md`
4. `package.json`
5. `scripts/README_VERIFY_HISTORY.md`
6. `ROOT_NAVIGATION.md`

如需追溯历史材料，再查看：

- `archive/history/root-signals/`
- `archive/history/internal-scripts/`
