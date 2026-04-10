# 交付仓库中的 verify 命名说明

## 目的

本文件用于统一交付仓库中 `verify-*` 命名的解释方式，避免审查者把显眼命名自然误解为“正式交付验收入口”。

## 当前统一结论

- 当前仓库**不存在**正式 `main loop` / `merge loop` 验收命令。
- 当前稳定、仓库级、可直接执行的正式入口包括：`npm run type-check`。
- `npm run verify:chapter1-drag-loop` 当前属于**正式命名导航入口**：命令名被保留用于交付说明与语义定位，但现阶段只输出统一说明信息。
- `archive:verify:merge-loop` 仅为 **archive/internal** 历史占位脚本，不属于正式交付入口。

## 如何理解仓库中的 verify 命名

以下内容即使名称中包含 `verify`，也应默认按**历史 / 内部 / archive / 局部验证资产**理解：

- `archive/history/root-signals/` 下的旧根目录验证文件
- `archive/history/internal-scripts/` 下的原 `verify-*` 脚本
- `scripts/README_*VERIFY*.md` 等说明文件
- 历史 `report` / `note` / `SETUP` / `VERIFICATION` 文件
- 文档中保留的旧 `verify:*` 命令名

这些命名只说明：

- 某个时间点存在过验证、排查或留档行为
- 仓库保留了历史追溯材料
- 开发过程中曾有局部验证脚本

这些命名**不说明**：

- 当前仓库已经整体完成
- 当前已交付正式 `main loop` / `merge loop` 验收链路
- 任一历史 `verify-*` 文件可替代当前正式交付入口

## 阅读顺序建议

如先看到显眼的 `verify-*` 名称，请回到以下文件确认当前交付口径：

1. `README.md`
2. `MAIN_LOOP_VERIFICATION.md`
3. `roadmap.md`
4. `package.json`
5. `scripts/README_VERIFY_HISTORY.md`

只有当这些顶层文件与脚本入口同步更新时，相关命令才可能被理解为正式交付入口；在此之前，显眼 `verify` 命名都只应按历史/内部资产理解。

## 与历史记录文件的关系

- `archive/history/root-signals/M2_2_VERIFICATION.md` 是历史快照，不是当前交付结论。
- `archive/history/root-signals/verify_report.txt` 是历史报告，不是当前完成证明。
- `ROOT_NAVIGATION.md` 当前仅作为交付导航页使用，不承载历史 PASS / FAIL 结论。

## 适用范围

本说明仅用于统一命名解释与交付文档口径，不代表新增任何功能，也不代表仓库已经补齐新的正式验收入口。
