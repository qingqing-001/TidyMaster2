# 主循环闭环 CLI 复核结果（issue #108 / #112）

## 目的

统一“主循环闭环”命令行验证入口，确保 README、`package.json` scripts、验证脚本真实输出三者口径一致，并明确 `verify:main-loop` 才是唯一正式主循环验证入口。

## 唯一正式主循环验证入口

当前与主循环闭环相关的唯一正式命令行为：

```bash
npm run verify:main-loop
```

补充说明：

- `npm run type-check` 仅是运行该命令前的前置静态检查，不与 `verify:main-loop` 并列为正式主循环验证入口
- 其他专题脚本即使保留，也已降级为 `archive:verify:*` / 非正式 internal 用途，不用于替代主循环正式入口
- 历史 JS 验证入口仅保留为 `archive:verify:*`，不属于正式主循环验证口径

## 本次复核环境

- 仓库：`TidyMaster2`
- 方式：命令行脚本静态/最小流程验证
- 说明：`verify:main-loop` 不依赖 Cocos 编辑器手动点击，直接验证“进入真实关卡、完成、结算、返回主界面、进入下一关”的主循环闭环。

## 实测结果

### 1. 前置类型检查

命令：

```bash
npm run type-check
```

结果：通过

### 2. 主循环闭环验证

命令：

```bash
npm run verify:main-loop
```

结果：通过，且验证期间不再输出音频资源加载错误日志

关键输出：

```json
{
  "startLevelId": 1,
  "completedLevelId": 1,
  "rewardCoins": 50,
  "nextLevelId": 2,
  "sceneTransitions": [
    { "sceneName": "Game", "levelId": 1 },
    { "sceneName": "Result" },
    { "sceneName": "Home" },
    { "sceneName": "Game", "levelId": 2 }
  ],
  "loadSceneCalls": ["Game", "Result", "Home", "Game"],
  "completion": {
    "stars": 3,
    "sourceLevelId": 1,
    "sceneDisplayName": "书桌整理",
    "rewardCoins": 50,
    "nextLevelId": 2
  },
  "finalProgress": {
    "currentLevelId": "level-002",
    "soundEnabled": true
  },
  "finalCoins": 150
}
```

## 复核点对应关系

`verify:main-loop` 当前覆盖以下闭环断言：

1. 能从 `HomeScene` 进入真实第 1 关；
2. 完成后发出 `LEVEL_COMPLETE`；
3. 关卡基础金币奖励写入 `DataManager`；
4. 发出 `COIN_CHANGE` 奖励事件；
5. 场景流转包含 `Game -> Result -> Home -> Game(下一关)`；
6. `GameManager` 实际收到对应的四次场景切换请求；
7. 玩家进度推进到 `level-002`；
8. 金币从初始 `100` 增长到 `150`，说明奖励已真正落库到运行时数据层。

## 与脚本真实行为的一致性说明

`scripts/verify-main-loop.ts` 当前真实断言如下：

- `sceneTransitions.length === 4`
- 第 1 条为 `Game(levelId: 1)`
- 第 2 条为 `Result`
- 第 3 条为 `Home`
- 第 4 条为 `Game(levelId: 2)`

因此脚本实际验证的是 `Game -> Result -> Home -> Game` 主循环闭环，README 与本记录已同步到相同口径。

另外，验证脚本会在启动前显式关闭 `AudioManager`，避免 Node 环境下触发原生音频资源 URL 解析，从而消除此前 `ERR_INVALID_URL` / `Failed to parse URL` 噪音日志；该调整没有删除真实音频依赖，只是在 CLI 验证场景中沿用项目已有的音频开关能力，保证主循环验证输出干净可复核。

## 一致性结论

本次已确认以下口径一致：

- `package.json`：对外仅保留正式 script `verify:main-loop`，其他专题或历史入口已降级为 `archive:verify:*`
- `README.md`：明确 `verify:main-loop` 为唯一正式主循环验证入口，`type-check` 仅为前置检查
- `MAIN_LOOP_VERIFICATION.md`：按脚本真实输出记录为 `Game -> Result -> Home -> Game`
- `scripts/verify-main-loop.ts`：实际验证 `HomeScene -> GameScene -> ResultScene -> HomeScene -> GameScene`

## 结论

issue #108 / #112 所要求的“真实主循环验证与唯一正式入口收口”现已可复核：

- 保留的正式入口：`npm run verify:main-loop`
- 降级的历史入口：`npm run archive:verify:chapter4`、`npm run archive:verify:chapter5`、`npm run archive:verify:chapter6`、`npm run archive:verify:level-counts`、`npm run archive:verify:runtime-access`、`npm run archive:verify:level-progression`、`npm run archive:verify:demo`、`npm run archive:verify:init`、`npm run archive:verify:level-system`、`npm run archive:verify:milestone`
- 被文档引用但现已应删除的旧入口：`verify:chapter4`、`verify:chapter5`、`verify:chapter6`、`verify:level-counts`、`verify:runtime-access`、`verify:level-progression`
- `npm run type-check` 仅作为前置检查
- 主循环实际闭环已统一表述为：`Game -> Result -> Home -> Game(下一关)`
