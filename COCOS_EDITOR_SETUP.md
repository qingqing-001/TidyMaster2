# Cocos Creator 编辑器配置指南

本文档说明如何在 Cocos Creator 编辑器中配置 TidyMaster 项目以运行游戏。

## 前提条件

- Cocos Creator 3.8.6 或更高版本
- 微信开发者工具（用于预览和构建微信小游戏）

## 步骤 1：导入项目

1. 打开 Cocos Creator
2. 选择 "打开其他项目"
3. 选择 `TidyMaster2/repo` 文件夹

## 步骤 2：脚本编译

首次打开项目时，Cocos Creator 会自动编译 TypeScript 脚本。如果自动编译失败：

1. 打开菜单 "开发者" -> "VS Code 工作流" -> "更新 VS Code 智能提示"
2. 或在终端运行：`npm install` 然后 `npm run build`

## 步骤 3：配置场景脚本

### Launch 场景

1. 在 "资源管理器" 中双击打开 `assets/scenes/Launch.scene`
2. 在 "层级管理器" 中选择 "Canvas" 节点
3. 在 "检查器" 面板中点击 "添加组件"
4. 搜索并添加 `LaunchScene` 脚本组件
5. 保存场景

### Home 场景

1. 打开 `assets/scenes/Home.scene`
2. 选择 "Canvas" 节点
3. 添加 `HomeScene` 脚本组件
4. 保存场景

### Game 场景

1. 打开 `assets/scenes/Game.scene`
2. 选择 "Canvas" 节点
3. 添加以下组件：
   - `GameScene` - 主游戏逻辑
   - `TimerController` - 倒计时控制
   - `LevelManager` - 关卡管理
4. 保存场景

### Result 场景

1. 打开 `assets/scenes/Result.scene`
2. 选择 "Canvas" 节点
3. 添加 `ResultScene` 脚本组件
4. 保存场景

### MyRoom 场景（可选）

1. 打开 `assets/scenes/MyRoom.scene`
2. 选择 "Canvas" 节点
3. 添加 `MyRoomScene` 脚本组件
4. 保存场景

## 步骤 4：配置启动场景

1. 打开菜单 "项目" -> "项目设置"
2. 在 "启动场景" 设置中，选择 `Launch` 场景
3. 点击 "确定"

## 步骤 5：创建基础节点结构（Game 场景示例）

在 GameScene 中，需要创建以下节点结构：

```
Canvas (GameScene, TimerController)
├── Background (Sprite)
├── Items (Node) - 游戏物品容器
├── Slots (Node) - 目标槽位容器
├── UI (Node)
│   ├── TimeLabel (Label)
│   ├── ScoreLabel (Label)
│   ├── PauseButton (Button)
│   └── HintButton (Button)
└── Effects (Node) - 特效容器
```

## 步骤 6：运行和预览

1. 点击编辑器顶部的 "预览" 按钮（三角形图标）
2. 选择 "微信小游戏" 作为预览平台
3. 等待编译完成

如果预览失败，检查控制台错误信息：

### 常见错误

**错误：找不到脚本**
- 解决：确保脚本已正确添加到组件

**错误：资源加载失败**
- 解决：在 "资源管理器" 中右键资源选择 "导入"

**错误：微信开发者工具未打开**
- 解决：先打开微信开发者工具

## 步骤 7：构建发布

1. 打开菜单 "项目" -> "构建发布"
2. 选择 "微信小游戏"
3. 配置构建设置：
   - 产物路径：`build/weapp`
   - 开启 "调试模式"（开发阶段）
4. 点击 "构建"
5. 构建完成后，在微信开发者工具中打开 `build/weapp` 目录

## 脚本组件清单

| 场景 | 必需组件 |
|------|----------|
| Launch.scene | LaunchScene |
| Home.scene | HomeScene |
| Game.scene | GameScene, TimerController, LevelManager |
| Result.scene | ResultScene |
| MyRoom.scene | MyRoomScene |

## 游戏功能组件

| 组件 | 用途 |
|------|------|
| DragHandler | 拖拽交互 |
| WipeHandler | 擦洗交互（新增）|
| FoldHandler | 折叠交互（新增）|
| SlotController | 槽位匹配 |
| ItemController | 物品状态管理 |
| AudioManager | 音频播放 |
| ParticleEffects | 特效表现 |

## 验证步骤

完成配置后，验证以下功能：

1. ✅ 游戏启动显示 Launch 场景
2. ✅ 点击进入 Home 场景
3. ✅ 选择关卡进入 Game 场景
4. ✅ 拖拽物品到槽位
5. ✅ 物品归位有音效和特效
6. ✅ 倒计时正常运行
7. ✅ 关卡完成显示 Result 场景

## 技术支持

如果遇到其他问题，请查看：
- `spec.md` - 完整的游戏规格文档
- `roadmap.md` - 项目路线图
- `assets/scripts/` - 所有脚本源码