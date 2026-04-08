# issue #124 处理记录

- 已确认仓库根目录为 `/Users/homer/.thebotcompany/dev/src/github.com/qingqing-001/TidyMaster2/repo`，在正确仓库内操作。
- 本轮仅收口主循环关键事件 payload 契约，未扩散修改其他业务事件。

## 已完成
- 统一 `assets/scripts/core/eventPayloads.ts`
  - 将 `LevelFailedPayload` 提升到共享定义。
  - 保持 `LevelCompletePayload` 字段唯一口径：`levelId`、`stars`、`sceneDisplayName?`、`rewardCoins`、`nextLevelId?`。
- 收敛 `GameScene / ResultScene / HomeScene` 对 `LEVEL_COMPLETE` 的消费方式
  - `GameScene` 继续只发统一字段，不再需要兼容别名。
  - `ResultScene` 改为直接依赖共享 payload 类型，移除本地重复类型与 `data || {}` / `||` 多重兜底消费方式；新增最小运行时断言，明确关键字段必须存在且类型正确。
  - `HomeScene` 不再用 `completedLevelId + 1` 作为 `nextLevelId` 的兜底，改为仅消费 payload 内显式提供的 `nextLevelId`；缺失时视为“无下一关”。
- 补最小可复核验证
  - `scripts/verify-main-loop.ts` 新增对 `LEVEL_COMPLETE` 关键字段的显式断言：`levelId`、`stars`、`rewardCoins` 必须为 `number`，`nextLevelId` 必须为 `number | undefined`。

## 验证
- `npx tsc --noEmit --pretty false` 通过。
- `npx tsx scripts/verify-main-loop.ts` 通过。

## 影响文件
- `assets/scripts/core/eventPayloads.ts`
- `assets/scripts/scenes/HomeScene.ts`
- `assets/scripts/scenes/ResultScene.ts`
- `scripts/verify-main-loop.ts`
- `note.md`

## issue #124（本轮独立复核）
- 聚焦复核 LEVEL_COMPLETE / CHANGE_SCENE payload 契约：
  - `assets/scripts/core/eventPayloads.ts`：`LevelCompletePayload` 统一为 `{ levelId, stars, sceneDisplayName?, rewardCoins, nextLevelId? }`；`ChangeScenePayload` 为 `{ sceneName, levelId? }`。
  - `assets/scripts/scenes/GameScene.ts`：完成事件发出统一字段，并补发 `CHANGE_SCENE { sceneName: 'Result' }`。
  - `assets/scripts/scenes/HomeScene.ts`：仅消费 `levelId/nextLevelId`，进入游戏统一发 `CHANGE_SCENE { sceneName: 'Game', levelId }`。
  - `assets/scripts/scenes/ResultScene.ts`：完成/失败按 number 型 `levelId` 消费，重试/下一关/回主页统一发标准 `CHANGE_SCENE`。
  - `scripts/verify-main-loop.ts`：断言 `LEVEL_COMPLETE.levelId/stars/rewardCoins` 为 number，`nextLevelId` 为 number | undefined，并验证 Home→Game→Result→Home→Game 主链路。
- 我亲自执行的最小验证：
  - `npm run verify:main-loop` ✅
  - 关键输出包含：
    - `主循环真实链路验证通过`
    - `completion.levelId = 1`
    - `completion.rewardCoins = 50`
    - `completion.nextLevelId = 2`
    - `sceneTransitions = [Game(1), Result, Home, Game(2)]`
- 对 #120 的独立复核：本轮在上述文件与验证脚本中未再发现旧的并存/兜底字段（如 `sourceLevelId`、字符串型 `levelId`、`GameScene` 场景名）；从最小脚本证据看，#120 相关残留已消失。
