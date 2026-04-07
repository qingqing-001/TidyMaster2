# 第2章 201 关真实擦洗脚本验证

## 目标
验证以下内容都直接基于项目内真实关卡配置，而不是纯 mock：

1. `getLevelConfig(201)` 能拿到第 2 章真实关卡。
2. 201 关包含真实擦洗物品与擦洗目标槽位。
3. 擦洗进度按项目 `WipeHandler` 相同公式可以推进。
4. 达到阈值后完成判定成立。
5. 输出明确的 `PASS/FAIL`。

## 运行命令
```bash
npm run verify:level201
```

也可以直接执行：
```bash
npx tsc scripts/verify-chapter2-level201.ts --module commonjs --target ES2020 --lib ES2020,DOM --esModuleInterop --moduleResolution node --skipLibCheck --outDir .tmp/verify-level201
node .tmp/verify-level201/scripts/verify-chapter2-level201.js
```

## 预期输出
输出会包含以下检查项：

- `真实关卡入口：getLevelConfig(201)`
- `关卡 201 包含真实擦洗物品`
- `擦洗进度可推进`
- `擦洗完成判定可成立`
- 最终 `PASS/FAIL`

## 说明
- 当前脚本直接读取 `assets/scripts/data/levels.ts` 导出的真实关卡入口。
- 擦洗推进和完成判定使用与 `assets/scripts/gameplay/WipeHandler.ts` 一致的核心公式：
  - `progress = (totalDistance / requiredDistance) * 100 * wipeSpeed`
  - 当 `progress >= wipeThreshold` 时判定完成并收敛到 `100%`
- 如果 `getLevelConfig(201)` 失效，脚本会直接失败并返回非 0 退出码。
