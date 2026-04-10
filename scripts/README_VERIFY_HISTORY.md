# scripts 下 verify-*、历史根目录显眼资产与正式验证命名说明

## 目的

收口仓库中历史 `verify-*` 脚本、单项验证说明与正式验收入口之间的边界，避免被误读。

如需先看一份顶层交叉引用，请先阅读仓库根目录 `VERIFY_NAMING_HISTORY.md`。

## 1. 正式验收入口

当前仓库：

- **不存在**正式 `main loop` / `merge loop` 验收入口。
- 当前稳定、仓库级、可直接执行的入口包括：基础静态校验 `npm run type-check`。
- `npm run verify:chapter1-drag-loop` 当前为正式命名导航入口：`package.json` 只输出统一导航提示，提醒读者该命名对应的是第 1 章拖拽闭环验证语义，而非现仓库状态下可脱离编译链路直接执行的完整脚本。
- 当前 `scripts/` 顶层已不再直接暴露这些显眼脚本名；原 `scripts/verify-*` 已迁入 `archive/history/internal-scripts/`，统一按**局部验证 / 开发期回归 / 辅助排查 / 历史留档**理解。

## 2. scripts/verify-* 的默认分类

以下文件已迁入 `archive/history/internal-scripts/`，统一按**非正式验收入口**处理：

- `verify-chapter2-level201.ts`
- `verify-chapter3-fold-level4.ts`
- `verify-ad-manager.ts`
- `verify-ad-manager-simple.ts`
- `verify-level-system.ts`
- `verify-level-system.js`
- `verify-init.js`
- `verify-demo.js`
- 以及未来新增、但尚未在顶层文档同步升格的同类历史脚本

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

为避免根目录继续释放冲突信号，显眼历史资产已统一归档：

- 旧根目录显眼资产：`archive/history/root-signals/`
- 原 `scripts/verify-*` 历史脚本：`archive/history/internal-scripts/`

即使这些归档文件/目录仍保留 `verify-*` 名称，也都只应按历史/内部/archive 资产理解。

## 4. 当前 scripts 目录的正式入口与辅助入口

- 正式命名导航入口：`npm run verify:chapter1-drag-loop`
- 当前已稳定可直接执行的正式入口：`npm run type-check`
- 历史/局部辅助脚本：`archive/history/internal-scripts/` 下原 `verify-*` 脚本
- 历史说明文件：`scripts/README_LEVEL201_VERIFY.md`、本文档

## 5. 对外描述要求

若在文档、PR、评审说明或交付总结中提到这些脚本，必须遵守以下表述：

- 可以说“局部验证脚本”“开发期验证脚本”“历史验证脚本”“archive/internal 脚本”
- 不可以说“唯一正式验收入口”“正式验收结论”“项目整体完成证明”
- 若同时提到历史归档目录与原 `scripts/verify-*`，应补充说明二者都只属于历史验证资产命名体系，不代表当前存在正式 `verify:main-loop` 入口

## 6. 未来若要升格为正式入口

只有当以下内容**同步更新且口径一致**时，某个验证命令才可被视为正式验收入口：

1. `README.md`
2. `MAIN_LOOP_VERIFICATION.md`
3. `roadmap.md`
4. `package.json`
5. 本文档
6. `VERIFY_NAMING_HISTORY.md`

在上述文件未同步前，`archive/history/internal-scripts/` 下原 `verify-*` 脚本与其他历史归档资产一律按局部/历史/internal 处理。
