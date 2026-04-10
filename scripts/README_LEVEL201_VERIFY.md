# 第2章 201 关真实擦洗脚本验证

## 定位

这是一个**局部功能验证脚本说明**，用于核对第 2 章 201 关的真实擦洗配置与基础推进逻辑。

它的用途仅限于：

- 校验 `getLevelConfig(201)` 是否仍能命中真实关卡配置
- 校验擦洗物品、目标槽位与推进公式是否可被脚本读取
- 为开发期局部回归提供辅助证据

它**不是**：

- 仓库级正式验收入口
- 项目整体完成证明
- 主循环 / merge loop / milestone 的正式仓库级统一验收结论

如需理解当前仓库关于“正式验收入口”与“历史/内部脚本”的统一口径，请同时阅读：

- `README.md`
- `MAIN_LOOP_VERIFICATION.md`
- `scripts/README_VERIFY_HISTORY.md`
- `VERIFY_NAMING_HISTORY.md`
- `package.json`

## 当前边界

- `npm run verify:level201` 若未来恢复，也只覆盖 **201 关擦洗链路** 的局部检查。
- 该命令名称里的 `verify` 仅表示局部验证动作，不表示仓库级正式验收入口，也不会自然升格为任何 `verify:main-loop` 替代品。
- 当前顶层 `package.json` 并未公开提供 `verify:level201` 正式脚本入口；如未来恢复，也必须与 `README.md`、`roadmap.md`、`MAIN_LOOP_VERIFICATION.md`、`VERIFY_NAMING_HISTORY.md`、`scripts/README_VERIFY_HISTORY.md` 同步更新后，才能改变口径。
- 历史 `.tmp/verify-level201` 风格产物应一律理解为**历史/内部/archive 命名体系下的临时产物**；当前同类资产统一查看 `archive/history/scripts-tmp/`。
- 即使脚本输出 `PASS`，也只表示该局部验证项通过，**不应被误读为正式验收通过**。
