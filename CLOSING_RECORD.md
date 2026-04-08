# 收尾记录

## 已关闭的历史 issue

本轮已按“避免误导下一阶段判断”的原则关闭以下 open issue：

- `#98`：历史 open issue 清理任务已完成，关闭。
- `#106`：唯一正式验证入口收口任务已完成，关闭。
- `#108`：真实主循环验证与唯一正式入口收口已完成，关闭。
- `#111`：当前工作树满足最小闭环复核要求，关闭。
- `#112`：Apollo 反馈中的主循环链路与音频日志问题已被后续结果覆盖，关闭。
- `#113`：补修 Home 中转与音频噪音的执行任务已完成，关闭。
- `#103`：旧“主循环闭环脚本化验证”里程碑定义已被后续结果覆盖，关闭。
- `#92`：旧“第4-6章验证并准备移交Apollo”里程碑定义已过时，关闭。
- `#94`：旧“第4-6章关卡接入里程碑通过”验证记录已不再代表当前阶段判断依据，关闭。
- `#93`：对应旧里程碑验证任务已完成且过时，关闭。
- `#66`：旧广告系统验证任务属于已过期历史验证残留，关闭。

## 保留为 archive/internal 的历史入口

以下脚本仍保留，但仅作 archive/internal 回溯或排障使用，不再与正式主循环入口并列：

- `archive:verify:chapter4`
- `archive:verify:chapter5`
- `archive:verify:chapter6`
- `archive:verify:level-counts`
- `archive:verify:runtime-access`
- `archive:verify:level-progression`
- `archive:verify:demo`
- `archive:verify:init`
- `archive:verify:level-system`
- `archive:verify:milestone`

## 当前唯一正式验证入口

- `npm run verify:main-loop`

补充：

- `npm run type-check` 仅为前置静态检查，不与正式主循环验证入口并列。
- README、roadmap、`MAIN_LOOP_VERIFICATION.md`、`package.json` 已统一到上述口径。

## 当前可独立复核的最小能力边界

Apollo 或后续规划阶段当前可独立复核的最小闭环，仅限于：

1. 从主流程进入真实第 1 关；
2. 完成关卡并触发 `LEVEL_COMPLETE`；
3. 基础金币奖励写入 `DataManager` 并发出 `COIN_CHANGE`；
4. 场景流转为 `Game -> Result -> Home -> Game(下一关)`；
5. 进度推进到下一关，可继续主流程游玩。

除此之外，其余系统（多章节专题脚本、社交/广告/收集等历史实现）目前不作为本里程碑正式完成度主张。
