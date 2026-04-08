# 历史验证脚本说明

`scripts/` 目录中仍保留少量早期验证脚本，目的仅限于：

- 历史问题回溯
- 本地临时排障
- 兼容旧记录中的脚本路径

## 统一口径

仓库当前对外文档、提测说明、验收说明统一只认以下唯一正式入口：

- `npm run verify:main-loop`

统一表述如下：

- `npm run verify:main-loop` 是唯一正式验收入口
- `npm run type-check` 仅为前置静态检查，不属于正式验收入口
- `npm run build` 仅为 `type-check` 的兼容别名，不代表新的验收口径
- 除 `verify:main-loop` 外，其余验证相关脚本统一归类为“历史/内部归档用途”；其中 `archive:verify:*` 只是归档标识，不构成并列正式入口

## 历史/内部归档入口

以下入口均不再属于正式验证口径，仅保留用于历史回溯或内部排障：

- `npm run archive:verify:chapter4`
- `npm run archive:verify:chapter5`
- `npm run archive:verify:chapter6`
- `npm run archive:verify:level-counts`
- `npm run archive:verify:runtime-access`
- `npm run archive:verify:level-progression`
- `npm run archive:verify:demo`
- `npm run archive:verify:init`
- `npm run archive:verify:level-system`
- `npm run archive:verify:milestone`
- `node scripts/verify-demo.js`
- `node scripts/verify-init.js`
- `node scripts/verify-level-system.js`
- `node verify-milestone.js`
- 以及其他直接 `node scripts/verify-*.js` 的调用方式

## 使用原则

1. 不得在 README、提测说明、验收说明、发布说明中把除 `npm run verify:main-loop` 外的脚本当作正式入口；
2. 如需使用历史脚本，必须明确标注为“历史/内部归档用途”；
3. 新增验证能力时，应优先判断其是否需要进入正式验收口径；若不是，则应继续保持 archive/internal 标识，避免与唯一正式入口混淆。
