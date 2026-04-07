# TidyMaster2 编辑器设置指南

本文档说明在 Cocos Creator 编辑器中需要完成的配置步骤。

## 当前状态

### ✅ 已完成（代码层面）
- TypeScript 编译通过
- 场景文件已创建（Launch, Home, Game, Result, MyRoom）
- 游戏管理器（GameManager）已实现
- 场景脚本已创建（LaunchScene, HomeScene, GameScene, ResultScene）
- 场景切换逻辑完整

### ❌ 需要编辑器完成
- 场景文件需要挂载脚本组件
- 需要在编辑器中"import"脚本使其生效

---

## 详细配置步骤

### 步骤 1: 安装 Cocos Creator
下载并安装 Cocos Creator 3.8.6：
https://www.cocos.com/creator

### 步骤 2: 打开项目
1. 启动 Cocos Creator 3.8.6
2. 点击 "打开项目"
3. 选择 `TidyMaster2/repo` 目录
4. 等待项目初始化完成

### 步骤 3: 导入脚本
首次打开项目后，编辑器会自动扫描并导入 `assets/scripts` 目录下的所有 TypeScript 文件。

如果未自动导入：
1. 在 "资源管理器" 面板中右键点击 `assets/scripts`
2. 选择 "刷新" 或 "Reimport"

### 步骤 4: 为场景挂载脚本

#### Launch.scene
1. 在 "层级管理器" 中点击 "Canvas" 节点
2. 在 "检查器" 面板中点击 "添加组件"
3. 搜索并选择 "LaunchScene"
4. 保存场景 (Ctrl+S)

#### Home.scene
1. 在 "层级管理器" 中点击 "Canvas" 节点
2. 在 "检查器" 面板中点击 "添加组件"
3. 搜索并选择 "HomeScene"
4. 保存场景

#### Game.scene
1. 在 "层级管理器" 中点击 "Canvas" 节点
2. 在 "检查器" 面板中点击 "添加组件"
3. 搜索并选择 "GameScene"
4. 保存场景

#### Result.scene
1. 在 "层级管理器" 中点击 "Canvas" 节点
2. 在 "检查器" 面板中点击 "添加组件"
3. 搜索并选择 "ResultScene"
4. 保存场景

### 步骤 5: 配置启动场景
1. 点击菜单 "项目" → "项目设置"
2. 在 "启动场景" 下拉框中选择 "Launch"
3. 点击 "确定"

### 步骤 6: 测试运行
1. 点击工具栏中的 "播放" 按钮（或按 Ctrl+P）
2. 确认 Launch 场景正常显示
3. 确认可以切换到 Home 场景
4. 确认可以进入 Game 场景

### 步骤 7: 构建发布（可选）
如果需要发布到微信小游戏：
1. 点击菜单 "项目" → "构建发布"
2. 选择 "微信小游戏" 平台
3. 点击 "构建"
4. 构建完成后，点击 "运行" 在微信开发者工具中预览

---

## 常见问题

### Q: 脚本组件搜索不到？
A: 确保 TypeScript 文件没有编译错误，检查 "控制台" 面板是否有红色错误。

### Q: 场景加载失败？
A: 确保所有 .scene 文件都已保存，且脚本组件正确挂载。

### Q: 如何验证代码初始化成功？
A: 查看 Launch.scene 中的 statusLabel 是否显示 "TidyMaster2 Phase 1 Scaffold Ready"

---

## 技术背景

### 为什么需要编辑器？

1. **.scene 文件格式**：Cocos Creator 的场景文件是 JSON 格式的二进制序列化文件，包含场景层级、组件配置等，只有编辑器能正确解析和保存。

2. **装饰器(@ccclass, @property)**：TypeScript 装饰器需要在运行时被编辑器解析，生成对应的组件注册信息。

3. **资源管理**：编辑器维护资源的 UUID 和路径映射，运行时需要这些元数据才能正确加载资源。

### 纯代码方案的局限性

虽然我们可以通过纯 TypeScript 代码创建所有节点和组件：
```typescript
const node = new Node('MyNode');
node.addComponent(Sprite);
```

但 Cocos Creator 的启动流程要求至少存在一个合法的 `.scene` 文件作为入口点。

---

## 验证清单

在编辑器中完成配置后，可以使用以下清单验证：

- [ ] 项目成功打开，无报错
- [ ] TypeScript 脚本被正确导入
- [ ] Launch.scene 可以播放
- [ ] statusLabel 显示 "TidyMaster2 Phase 1 Scaffold Ready"
- [ ] 点击可切换到 Home 场景
- [ ] Home 场景点击可进入 Game 场景
- [ ] Game 场景显示槽位和物品
- [ ] 拖拽物品可以吸附到槽位
- [ ] 全部归位后显示结算界面