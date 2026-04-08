# Issue #123 工作记录

## 本轮完成
- 复核 README、package.json、scripts 目录文档，确认当前仓库口径已统一为：`npm run verify:main-loop` 是唯一正式验收入口。
- 复核 `package.json` 中其余验证脚本均已显式降级为 `archive:verify:*`，符合“历史/内部/归档用途”要求。
- 复核 `scripts/README_VERIFY_HISTORY.md` 与 `scripts/README_LEVEL201_VERIFY.md` 已明确非正式用途说明。
- 执行最小复核命令：`npm run verify:main-loop`，结果通过。

## 统一后的正式表述
- `npm run verify:main-loop` 是唯一正式验收入口。
- `npm run type-check` 仅为前置静态检查，不属于正式验收入口。
- `npm run build` 仅为 `type-check` 兼容别名，不代表新的正式验收口径。
- 其余脚本仅属于历史/内部/归档用途，不得与 `verify:main-loop` 并列宣传为正式入口。

## 说明
- 本轮未改动功能逻辑。
- 当前工作树存在大量他人未提交改动，按“避免污染他人工作”原则，本轮未新增代码改动，也未执行提交。
- 若后续需要对 issue #123 留言/关闭，应在确认 issue 跟踪工具可用且工作树可安全提交后再执行。
