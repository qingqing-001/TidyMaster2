# TidyMaster

微信小游戏收纳整理项目交付仓库。

## 仓库定位

本仓库当前用于交付以下内容：

- Cocos Creator 项目源码与资源
- 微信小游戏构建侧配置
- 类型检查入口
- 顶层文档化的交付边界说明

本仓库当前**不是**“已提供完整一键验收链路”的交付包，也**不对外宣称**已经补齐覆盖全项目的正式 main loop / merge loop 验收命令。

## 当前对外交付口径

对于只读审查者，当前可直接确认的正式入口只有：

- `npm run type-check`
- `npm run verify:chapter1-drag-loop`

其中：

- `npm run type-check` 是当前稳定、仓库级、可直接执行的静态校验入口。
- `npm run verify:chapter1-drag-loop` 是当前保留的**正式命名导航入口**；该命令目前输出统一说明信息，用于把审查者导向正确的交付边界与历史说明，而不是承诺仓库内已经存在独立的一键闭环验证实现。
- 当前**不存在**正式 `main loop` / `merge loop` 仓库级验收命令。
- `archive:verify:merge-loop` 仅为 archive/internal 历史占位脚本，不属于正式交付入口。

## 交付内容范围

当前仓库中可以交付并供审查的内容包括：

- `assets/`：项目源码、场景、资源与业务模块
- `weapp/`：微信小游戏构建侧配置
- `package.json`：当前公开脚本入口定义
- 顶层说明文档：用于界定正式入口与历史资产边界

当前仓库中**不应**被直接视为正式交付结论的内容包括：

- `archive/history/` 下的历史 PASS / FAIL / verify / report / setup / note 类文件
- 历史 `verify-*` 脚本与历史验证报告
- 任何未在顶层文档与 `package.json` 同步升格的局部验证材料

## 建议阅读顺序

如需按交付仓库口径理解当前状态，请按以下顺序阅读：

1. `README.md`
2. `MAIN_LOOP_VERIFICATION.md`
3. `VERIFY_NAMING_HISTORY.md`
4. `roadmap.md`
5. `scripts/README_VERIFY_HISTORY.md`
6. `ROOT_NAVIGATION.md`

## 当前文件布局

- `assets/`：项目源码与资源
- `weapp/`：微信小游戏构建配置
- `archive/history/`：历史脚本、历史报告、历史显眼信号归档
- `scripts/`：当前脚本说明文档与内部说明

## 开发与审查说明

1. 类型检查：`npm run type-check`
2. 第 1 章拖拽闭环命名导航入口：`npm run verify:chapter1-drag-loop`
3. 微信小游戏构建：使用 Cocos Creator 构建面板，并结合 `weapp/` 配置

如需继续追溯历史命名、历史验证或旧结论，请先阅读 `VERIFY_NAMING_HISTORY.md` 与 `MAIN_LOOP_VERIFICATION.md`，不要直接根据 archive 中的文件名外推当前交付结论。
