# 收尾记录

> 说明：本文仅记录当前文档收口与历史台账清理结果，不构成“整个项目已完成”结论。当前唯一可正式复核范围，仍仅限 `npm run verify:main-loop` 覆盖的最小主循环闭环。

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


## 当前结论（可对 Apollo 直接复核）

本轮文档收口后的唯一可成立结论是：**仓库已完成“最小主循环文档收口”**。

可直接复核的证据链为：

- `README.md`：明确 `npm run verify:main-loop` 是唯一正式验收入口；
- `MAIN_LOOP_VERIFICATION.md`：限定正式可复核能力边界为最小主循环闭环；
- `roadmap.md`：区分了“当前正式验收 / 历史记录 / 未完成或未复验”；
- `M2_2_VERIFICATION.md`：保留合成系统失败记录，证明其不能再被标记为已完成验收。

因此，本仓库当前**不能**得出“整个项目已完成”“全部 Phase 已完成”或“完美收尾”的结论。

## 当前可独立复核的最小能力边界

Apollo 或后续规划阶段当前可独立复核的最小闭环，仅限于：

1. 从主流程进入真实第 1 关；
2. 完成关卡并触发 `LEVEL_COMPLETE`；
3. 基础金币奖励写入 `DataManager` 并发出 `COIN_CHANGE`；
4. 场景流转为 `Game -> Result -> Home -> Game(下一关)`；
5. 进度推进到下一关，可继续主流程游玩。

除此之外，其余系统（多章节专题脚本、合成、社交/广告/收集等历史实现）目前不作为本里程碑正式完成度主张。

## 未纳入当前正式验收的系统提醒

以下系统即使仓库中存在代码、历史实现或旧验证记录，也不得在当前口径下表述为“已完成”或“整体收尾”：

- 合成系统：`M2_2_VERIFICATION.md` 已记录失败，当前应视为未完成/未复验。
- 广告系统：仅保留历史实现与旧验证记录，当前未重新正式复验。
- 收集/养成系统：仅保留历史实现记录，当前未重新正式复验。
- 社交系统：仅保留历史实现记录，当前未重新正式复验。
