# TidyMaster

微信小游戏收纳整理项目。

## 当前正式入口

当前仓库对只读审查者公开的正式入口仅包括：

- `npm run type-check`
- `npm run verify:chapter1-drag-loop`

说明：

- 当前**不存在**正式 `main loop` / `merge loop` 仓库级验收命令。
- 任何显眼的 `verify-*` 文件、`scripts/verify-*`、以及历史临时目录，都不应被直接理解为正式验收入口。

## 当前文件布局

- `assets/`：项目源码与资源
- `scripts/verification/verify-chapter1-drag-loop.ts`：当前正式、可复核的第 1 章单关拖拽闭环验证脚本源码
- `scripts/README_VERIFY_HISTORY.md`：脚本目录中历史/局部验证资产说明
- `archive/history/root-signals/`：仓库根目录历史显眼资产归档位置（含历史 verification/report/note/setup 文件）
- `archive/history/scripts-tmp/`：原 `.tmp/` 下历史验证产物归档位置
- `weapp/`：微信小游戏构建侧配置

## 历史资产阅读入口

如需理解历史命名与旧验证材料，请按以下顺序阅读：

1. `VERIFY_NAMING_HISTORY.md`
2. `MAIN_LOOP_VERIFICATION.md`
3. `roadmap.md`
4. `scripts/README_VERIFY_HISTORY.md`

## 开发说明

1. 类型检查：`npm run type-check`
2. 第 1 章正式闭环验证：`npm run verify:chapter1-drag-loop`
3. 微信小游戏构建：使用 Cocos Creator 构建面板与 `weapp/` 配置
