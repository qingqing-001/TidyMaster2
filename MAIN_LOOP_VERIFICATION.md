# 主循环闭环 CLI 复核结果

## 目的

提供一个可在仓库内独立复核的主循环验证记录，说明唯一正式入口、验证范围、实测结果与脚本行为，不依赖外部 issue 或沟通上下文。

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
    "levelId": 1,
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

## 验证脚本设计说明

正式脚本当前通过公开事件流与公开场景方法驱动主循环；其 Node CLI 驱动方式如下：

- 使用 `HomeScene.onLoad()` 完成主页初始化；当前 CLI 最小环境不会额外调用 `HomeScene.start()`，因为主循环断言不依赖其 UI 事件注册
- 使用公开方法 `HomeScene.enterLevel(levelId)` 触发进入关卡
- 通过 `GAME_EVENTS.LEVEL_COMPLETE` 向 `ResultScene` 传递结算数据
- 使用公开方法 `ResultScene.onBackHome()` 驱动返回主页
- 再次使用 `HomeScene.enterLevel(nextLevelId)` 验证下一关可继续进入

脚本会为 Node CLI 环境补齐最小内存版 `localStorage`，并关闭音频播放；这些适配只用于提供运行环境，不依赖私有方法名、私有注册函数或运行时 monkey patch 去强行调用主逻辑。

## 一致性结论

本次已确认以下口径一致：

- `package.json`：对外仅保留正式 script `verify:main-loop`，其他专题或历史入口已降级为 `archive:verify:*`
- `README.md`：明确 `verify:main-loop` 为唯一正式主循环验证入口，`type-check` 仅为前置检查
- `MAIN_LOOP_VERIFICATION.md`：按脚本真实输出记录为 `Game -> Result -> Home -> Game`
- `scripts/verify-main-loop.ts`：实际验证 `HomeScene -> GameScene -> ResultScene -> HomeScene -> GameScene`

## 结论

当前仓库已可在不依赖外部 tracker 上下文的前提下，直接用以下顺序复核最小主循环闭环：

1. `npm run type-check`
2. `npm run verify:main-loop`

主循环实际闭环统一表述为：`Game -> Result -> Home -> Game(下一关)`
