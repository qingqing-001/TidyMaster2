# TidyMaster

微信小游戏收纳整理项目。

## 当前正式入口

当前仓库对只读审查者公开的正式入口仅包括：

- `npm run type-check`
- `npm run verify:chapter1-drag-loop`

说明：

- `npm run verify:chapter1-drag-loop` 当前是**文档化正式命名入口**，但 `package.json` 现阶段仅输出统一导航提示，不直接承诺仓库内存在可脱离项目编译链路的真实一键执行实现。
- 当前如需继续追溯该命名对应的实现边界与历史背景，应先阅读 `VERIFY_NAMING_HISTORY.md`、`MAIN_LOOP_VERIFICATION.md`、`scripts/README_VERIFY_HISTORY.md`。
- 当前**不存在**正式 `main loop` / `merge loop` 仓库级验收命令。
- `archive:verify:merge-loop` 仅是 archive/internal 占位提示，不代表正式验收入口。
- 仓库根目录已移除显眼历史 `verify/report/note/setup` 结论文件；相关旧材料统一查看 `archive/history/root-signals/`。
- `scripts/` 顶层也不再直接暴露显眼 `verify-*` 脚本；相关历史脚本统一查看 `archive/history/internal-scripts/` 与 `scripts/internal/README.md`。

## 当前文件布局

- `assets/`：项目源码与资源
- `scripts/README_VERIFY_HISTORY.md`：脚本目录中历史/局部验证资产说明
- `archive/history/root-signals/`：仓库根目录历史显眼资产归档位置（含历史 verification/report/note/setup 文件）
- `archive/history/internal-scripts/`：原 `scripts/verify-*` 历史脚本归档位置
- `weapp/`：微信小游戏构建侧配置

## 历史资产阅读入口

如需理解历史命名与旧验证材料，请按以下顺序阅读：

1. `VERIFY_NAMING_HISTORY.md`
2. `MAIN_LOOP_VERIFICATION.md`
3. `roadmap.md`
4. `scripts/README_VERIFY_HISTORY.md`
5. `scripts/internal/README.md`（仅在需要理解脚本目录降级边界时）

## 开发说明

1. 类型检查：`npm run type-check`
2. 第 1 章验证命名导航入口：`npm run verify:chapter1-drag-loop`（当前输出统一说明信息；如需真实执行链路，请结合项目编译产物与历史说明定位）
3. 微信小游戏构建：使用 Cocos Creator 构建面板与 `weapp/` 配置
