# TidyMaster 项目路线图

## 概述

本路线图规划了《整理大师》(TidyMaster) 微信小游戏的开发里程碑。项目按照 spec.md 中定义的开发阶段组织；但所有“已完成 / 已验证 / 失败”表述，若未与当前仓库正式入口同步，均只视为历史记录。

---

## 当前统一边界说明（以仓库现状为准）

- 当前不存在覆盖全项目的正式 `main loop` / `merge loop` 验收入口；`npm run verify:chapter1-drag-loop` 当前保留为第 1 章拖拽闭环的正式命名导航入口，但 `package.json` 现阶段仅输出说明信息，不能单凭该命令名外推仓库内已有可脱离编译链路的一键执行实现。
- `archive:verify:merge-loop` 仅为 archive/internal 占位，不得视为正式验收命令。
- 历史 `.tmp/verify-*` 与 `.tmp/manual-verify-*` 产物已统一迁入 `archive/history/scripts-tmp/`；这些目录仅为历史验证产物，不代表当前仓库已有正式实现。
- 历史根目录显眼验证资产已统一迁入 `archive/history/root-signals/`；除当前顶层文档声明的入口外，不得从这些文件名外推出正式验收结论。
- 历史根目录显眼 setup / report / note 类文件也统一按 archive/history 语义保存在 `archive/history/root-signals/`，仅作留档，不再保留在顶层释放当前状态信号。
- 当前稳定、仓库级、可直接执行的入口包括：`npm run type-check`；`npm run verify:chapter1-drag-loop` 当前为公开命名导航入口，用于把审查者引导到正确的实现/历史说明边界。
- 若先看到显眼的 `verify-*` 文件名、历史验证目录或旧 `verify:*` 命令名，请先回读 `VERIFY_NAMING_HISTORY.md`；这些命名默认仅表示历史/内部/局部验证资产。
- 下文各历史里程碑若写有“已完成 / 已验证 / TypeScript 编译通过 / 失败”等，只应理解为对应时间点的历史记录；除非与当前仓库入口一致，否则不构成当前可独立复核的现行完成态。

---

## Phase 1：核心原型 - MVP验证

### M1.1: 项目基础框架搭建（配置与结构）
**状态**：历史记录（仅限当时上下文）

- 初始化 Cocos Creator 项目基础结构
- 建立 TypeScript 配置与目录布局
- 接入基础管理器与微信小游戏配置

### M1.2: 配置数据和构建验证
**状态**：仅保留代码入库事实

- 相关配置文件与适配器代码曾作为当期成果入库
- 历史“TypeScript 编译通过”等表述不再直接等于当前现行结论

### M2：拖拽核心玩法实现（父里程碑）
**状态**：已拆分

### M2.1：首个可玩拖拽关卡闭环
**状态**：已建立正式脚本化验证入口（第 1 章单关）

- 现行公开命名入口：`npm run verify:chapter1-drag-loop`（当前用于导航与边界说明；若需真实执行，应结合项目编译链路与后续落地实现）
- 静态类型检查入口：`npm run type-check`

### M2.2：拖拽反馈与稳定性打磨
**状态**：仅保留历史代码/文档记录

### M3：关卡系统实现
**状态**：仅保留代码入库事实

### M4.1：第4-6章关卡接入与静态校验
**状态**：仅保留历史记录，不作为当前现行结论

- 历史记录中出现过 `verify:chapter4`、`verify:chapter5`、`verify:chapter6`、`verify:level-counts`、`verify:runtime-access`、`verify:level-progression` 等局部验证脚本命名。
- 这些历史命名及其临时产物现已统一归档到 `archive/history/scripts-tmp/` 或相关历史说明中，不构成当前正式入口。

### M4.2：场景切换和 UI 组件
**状态**：仅保留代码入库事实

### M5：首个完整关卡测试
**状态**：仅保留历史代码/文档记录

- 如需查看旧失败/旧验证快照，应到 `archive/history/root-signals/` 中查阅历史归档，而不是把历史快照当作当前状态。

---

## Phase 2：系统完善

### 多操作类型、合成、广告、社交等后续里程碑

- 下列内容在仓库内保留不同程度的代码、说明或历史验证材料：擦洗、折叠、合成系统、广告、社交、关卡扩展。
- 除非未来在 `README.md`、`MAIN_LOOP_VERIFICATION.md`、`package.json`、`scripts/README_VERIFY_HISTORY.md`、`VERIFY_NAMING_HISTORY.md` 中同步升格，否则这些能力仍只视为“已有代码/历史材料”，不视为“已有正式仓库级验收入口”。

---

## 审查者导航

外部只读审查者当前应优先查看：

1. `README.md`
2. `MAIN_LOOP_VERIFICATION.md`
3. `VERIFY_NAMING_HISTORY.md`
4. `scripts/README_VERIFY_HISTORY.md`
5. `archive/history/root-signals/` 与 `archive/history/scripts-tmp/`（仅在需要查看历史资产时）
