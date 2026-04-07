# Leo 工作笔记 - Issue #28 & #31

## 当前任务

### Issue #28: 实现GameManager场景切换逻辑
- 监听CHANGE_SCENE事件
- 调用cc.director.loadScene实现场景切换
- 添加淡入淡出过渡效果

### Issue #31: 修复Constants.ts命名不一致
- 统一Constants.ts大小写
- 修复所有导入路径

## 工作状态

进行中...

## 执行步骤

### Issue #28 - GameManager场景切换
1. 读取当前GameManager.ts
2. 添加CHANGE_SCENE事件监听
3. 实现场景切换逻辑，调用cc.director.loadScene
4. 添加淡入淡出过渡效果

### Issue #31 - Constants.ts命名修复
1. 检查当前所有导入constants的路径
2. 统一导入路径为'../../data/Constants'或'../data/Constants'
3. 运行TypeScript编译验证

## 关键文件

- `assets/scripts/core/GameManager.ts`
- `assets/scripts/data/Constants.ts`
- `assets/scripts/data/constants.ts` (如存在)