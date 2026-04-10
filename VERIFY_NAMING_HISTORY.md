# verify 命名统一总说明

## 目的

本文件是仓库对 `verify-*` 命名的统一总说明，用来避免只读审查者把显眼文件名自然误解为“正式验收入口”。

## 当前统一结论

- 当前仓库**不存在**正式 `main loop` / `merge loop` 验收命令。
- 当前稳定、仓库级、可直接执行的入口包括：基础静态校验 `npm run type-check`。
- `npm run verify:chapter1-drag-loop` 当前属于**正式命名导航入口**：命令名被保留用于统一口径，但 `package.json` 现阶段只输出说明信息，不直接承诺现仓库内已有可独立一键执行的真实闭环入口。
- `archive:verify:merge-loop` 仅是 **archive/internal** 历史占位脚本，不执行正式闭环验收。

## 如何理解仓库中的 verify 命名

以下命名即使看起来像“验证入口”，也都应默认按**历史 / 内部 / archive / 局部验证资产**理解：

- `archive/history/root-signals/` 下保留的旧根目录 `verify-*` 文件
- `archive/history/internal-scripts/` 下保留的原 `scripts/verify-*` 脚本（默认仅作局部验证/历史辅助，不等于 `package.json` 中存在同名正式可执行入口）
- `scripts/README_*VERIFY*.md` 类说明文件
- `archive/history/root-signals/` 下的历史 `report` / `note` / `SETUP` 文件
- 文档中的 `verify:*` 历史命令名

这些内容只说明：

- 某个时间点做过局部验证或排查
- 仓库保留了历史留档材料
- 开发期曾存在辅助自检脚本

这些内容**不说明**：

- 仓库已整体完成
- 当前存在正式 `main loop` / `merge loop` 验收链路
- 任一 `verify-*` 文件或目录可替代正式仓库级验收入口

## 阅读顺序建议

若读者先看到显眼的 `verify-*` 命名，请立刻回到以下文件确认当前口径：

1. `README.md`
2. `MAIN_LOOP_VERIFICATION.md`
3. `roadmap.md`
4. `package.json`
5. `scripts/README_VERIFY_HISTORY.md`

只有这些顶层文件**同步**声明某个命令已升格时，相关命令才可能被理解为正式入口；在此之前，所有显眼 `verify` 命名都只应视为历史/内部资产。

## 与历史记录文件的关系

- `archive/history/root-signals/M2_2_VERIFICATION.md` 是历史失败快照，不是当前验收入口。
- `archive/history/root-signals/verify_report.txt` 是历史验证报告，不是当前完成结论。
- 根目录 `note.md` 现仅作为导航页存在，不再承载当前仓库 FAIL/PASS 结论，也不与历史结论文件并列出现。

## 适用范围

本说明仅用于统一文档口径与命名解释，不代表新增任何功能，也不代表补建了新的正式验收链路。
