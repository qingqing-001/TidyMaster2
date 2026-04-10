# scripts 下 verify-*、历史根目录显眼资产与历史验证产物说明

## 目的

收口仓库中 `verify-*` 脚本、单项验证说明、历史临时产物与正式验收入口之间的边界，避免被误读。

如需先看一份顶层交叉引用，请先阅读仓库根目录 `VERIFY_NAMING_HISTORY.md`。

## 1. 正式验收入口

当前仓库：

- **不存在**正式 `main loop` / `merge loop` 验收入口。
- 当前稳定、仓库级、可直接执行的入口包括：基础静态校验 `npm run type-check`，以及当前正式、可复核的第 1 章单关拖拽闭环验证 `npm run verify:chapter1-drag-loop`。
- `scripts/` 下的 `verify-*` 脚本默认都属于**局部验证 / 开发期回归 / 辅助排查 / 历史留档**；仅因源码文件存在，并不表示 `package.json` 中已有对应正式可执行入口，除非未来有跨文档同步明确升格。

## 2. scripts/verify-* 的默认分类

以下文件统一按**非正式验收入口**处理：

- `scripts/verify-chapter2-level201.ts`
- `scripts/verify-chapter3-fold-level4.ts`
- `scripts/verify-ad-manager.ts`
- `scripts/verify-ad-manager-simple.ts`
- `scripts/verify-level-system.ts`
- `scripts/verify-level-system.js`
- `scripts/verify-init.js`
- `scripts/verify-demo.js`
- 以及未来新增、但尚未在顶层文档同步升格的 `scripts/verify-*`

这些脚本可以用于：

- 单模块行为核对
- 开发期局部回归
- 历史问题复盘
- 人工辅助理解实现边界

这些脚本不得用于：

- 宣称“仓库已有统一正式验收入口”
- 替代 README / 路线图 / package.json 对正式入口的定义
- 作为项目整体完成或版本正式验收的唯一凭据

## 3. 历史显眼资产位置

为避免根目录与 `.tmp/` 继续释放冲突信号，显眼历史资产已统一归档：

- 旧根目录显眼资产：`archive/history/root-signals/`
- 旧 `.tmp/verify-*` 与 `.tmp/manual-verify-*` 历史产物：`archive/history/scripts-tmp/`

即使这些归档文件/目录仍保留 `verify-*` 名称，也都只应按历史/内部/archive 资产理解。

## 4. 当前 scripts 目录的正式入口与辅助入口

- 正式入口脚本：`scripts/verification/verify-chapter1-drag-loop.ts`
- 历史/局部辅助脚本：其余 `scripts/verify-*`
- 历史说明文件：`scripts/README_LEVEL201_VERIFY.md`、本文档

## 5. 对外描述要求

若在文档、PR、评审说明或交付总结中提到这些脚本，必须遵守以下表述：

- 可以说“局部验证脚本”“开发期验证脚本”“历史验证脚本”“archive/internal 脚本”
- 不可以说“唯一正式验收入口”“正式验收结论”“项目整体完成证明”
- 若同时提到历史归档目录与 `scripts/verify-*`，应补充说明二者都只属于历史验证资产命名体系，不代表当前存在正式 `verify:main-loop` 入口

## 6. 未来若要升格为正式入口

只有当以下内容**同步更新且口径一致**时，某个验证命令才可被视为正式验收入口：

1. `README.md`
2. `MAIN_LOOP_VERIFICATION.md`
3. `roadmap.md`
4. `package.json`
5. 本文档
6. `VERIFY_NAMING_HISTORY.md`

在上述文件未同步前，`scripts/verify-*` 与历史归档资产一律按局部/历史/internal 处理。
