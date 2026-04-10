# scripts/internal 历史脚本导航

本目录用于承接原先 `scripts/verify-*` 中容易被误读为正式验收入口的历史/局部脚本资产。

## 当前规则

- 这里的脚本仅属于 **internal / history / 局部回归 / 开发排查**。
- 即使文件名中仍包含 `verify` 语义，也不得视为正式仓库级验收入口。
- 外部只读审查者应优先阅读根目录 `README.md`、`MAIN_LOOP_VERIFICATION.md`、`VERIFY_NAMING_HISTORY.md`、`roadmap.md` 与 `scripts/README_VERIFY_HISTORY.md`。

## 目录对应关系

- `archive/history/internal-scripts/`：原先显眼 `scripts/verify-*` 历史脚本原件
- `scripts/internal/`：当前对脚本目录边界的降级导航说明

若未来某个脚本需要重新升格为正式入口，必须同步更新顶层文档与 `package.json`，而不是仅在本目录恢复文件。
