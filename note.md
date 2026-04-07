# Cocos Creator 纯代码创建游戏场景可行性调研报告

## 调研目标
探索Cocos Creator 3.8.6是否支持纯代码（不通过编辑器）创建游戏场景，评估各技术方案的可行性。

---

## 1. 现状分析

### 当前项目状态
- **代码框架**: 54个TypeScript文件已完成（GameManager、场景类、游戏逻辑等）
- **场景文件**: `assets/scenes/` 目录为空，无 `.scene` 文件
- **资源文件**: `assets/resources/` 目录为空，无实际资源
- **项目配置**: `project.json` 已配置为 Cocos Creator 3.8.6 2D项目
- **微信小程序**: `weapp/` 目录已配置基础文件（app.js, app.json, game.json等）

### 核心问题
Cocos Creator 项目的 `.scene` 文件是编辑器专有格式，包含场景层级、组件配置、资源引用等信息，**无法通过纯文本方式创建**。

---

## 2. 纯代码创建场景的可行性分析

### 2.1 方案A：完全使用TypeScript代码创建场景节点

**可行性**: ✅ 完全可行

**实现方式**:
```typescript
// 创建节点
const node = new Node('MyNode');
node.setPosition(x, y, z);

// 添加组件
const sprite = node.addComponent(Sprite);
const transform = node.addComponent(UITransform);

// 设置父节点
node.setParent(canvas);

// 加载资源
resources.load('textures/item', SpriteFrame, (err, sf) => {
  sprite.spriteFrame = sf;
});
```

**优点**:
- 无需编辑器，完全自动化
- 代码版本可控，易于CI/CD
- 适合程序化生成内容

**缺点**:
- 无法使用Cocos Editor的可视化功能
- 复杂的UI布局代码量大
- 无法预览效果

**项目中的代码示例**:
`SlotController.ts` 第28-50行展示了纯代码创建节点和高亮效果：
```typescript
this.highlightNode = new Node();
this.highlightNode.name = 'Highlight';
this.highlightNode.setParent(this.node);
const sprite = this.highlightNode.addComponent(Sprite);
const opacity = this.highlightNode.addComponent(UIOpacity);
```

### 2.2 方案B：使用Cocos Creator的命令行工具创建基础场景

**可行性**: ⚠️ 部分支持

**Cocos Creator CLI**:
- `cocos new` - 创建新项目（但仍需要编辑器打开）
- `cocos compile` - 编译项目（需要项目结构完整）
- **不存在** `cocos create-scene` 命令

**替代方案**:
1. 使用 Cocos Creator 的 **自动化脚本** 在编辑器启动后自动生成场景
2. 通过 `cocos edit-object` 操作编辑器（需要运行中的编辑器实例）

**结论**: 无法脱离编辑器创建 `.scene` 文件

### 2.3 方案C：考虑纯HTML5/Canvas实现（脱离Cocos）

**可行性**: ❌ 不推荐

**原因**:
1. 已有54个TypeScript文件基于Cocos Creator API编写
2. 微信小游戏对Cocos Creator有原生支持
3. 重新实现成本过高

---

## 3. 推荐的技术路线

### 🥇 推荐方案：混合模式

**策略**: 代码优先 + 编辑器补充

1. **UI和布局用代码创建**
   - 所有 `Node` 创建和组件添加全部在TypeScript中完成
   - 使用 `Graphics` 组件绘制占位图形
   - 参考 `SlotController.ts` 的实现模式

2. **场景入口用最小 `.scene` 文件**
   - 在 Cocos Creator 编辑器中创建**空场景**
   - 只需要包含 Canvas 节点和必要的配置
   - 场景内容完全由代码生成

**最小场景文件结构**:
```
Launch.scene (包含 Canvas 节点 + LaunchScene 组件)
Home.scene   (包含 Canvas 节点 + HomeScene 组件)  
Game.scene   (包含 Canvas 节点 + GameScene 组件)
```

**实现步骤**:
1. 安装 Cocos Creator 3.8.6 编辑器
2. 创建4个最小场景文件（每个只需Canvas + 1个挂载脚本的节点）
3. 在 TypeScript 中完成所有场景内容创建
4. 配置构建发布到微信小游戏

---

## 4. 微信小游戏构建要求

### 4.1 当前配置检查

| 文件 | 状态 | 说明 |
|------|------|------|
| weapp/app.js | ✅ 已配置 | 游戏入口 |
| weapp/app.json | ✅ 已配置 | 小程序配置 |
| weapp/game.json | ✅ 已配置 | 游戏运行时配置 |
| weapp/project.config.json | ✅ 已配置 | 项目配置 |

### 4.2 微信小游戏特殊限制

1. **包大小限制**: 主包不超过4MB，分包可到8MB
2. **骨骼动画**: 使用DragonBones需要配置
3. **网络**: 只支持HTTPS（真机）
4. **用户信息**: 需要用户主动授权
5. **转发**: 需要配置分享参数

### 4.3 Cocos Creator 微信小游戏构建

必须通过编辑器执行：
1. 菜单 → 项目 → 构建发布
2. 选择 "微信小游戏" 平台
3. 配置AppID
4. 执行构建

**无法通过命令行完全自动化构建**，但可以：
- 使用 `cocos compile` 触发构建
- 构建产物在 `build/wechat` 目录

---

## 5. 潜在的坑和解决方案

### 坑1: 场景加载依赖 .scene 文件

**问题**: `director.loadScene('Game')` 需要对应的 `.scene` 文件

**解决方案**: 
- 必须在编辑器中创建基础 `.scene` 文件
- 或者使用 `director.loadSceneDynamic()` (如果有的话)

### 坑2: 资源加载路径

**问题**: 代码中引用资源路径必须与编辑器中的路径一致

**解决方案**:
- 统一使用 `resources/` 目录
- 使用 `resources.load()` 而非直接路径

### 坑3: 装饰器(@property)需要编辑器解析

**问题**: TypeScript 装饰器在运行时需要编辑器解析

**解决方案**:
- `@property` 仍可在代码中声明（编辑器会读取）
- 运行时通过 `node.getComponent()` 获取实例

### 坑4: TypeScript 编译输出路径

**问题**: 编译后的 `.js` 文件需要放在正确位置

**解决方案**:
- 配置 `settings` 中的编译输出目录
- 或使用 Cocos Creator 的 "导入" 功能

---

## 6. 下一步行动建议

### 立即行动
1. ✅ 安装 Cocos Creator 3.8.6 编辑器
2. 创建4个最小 `.scene` 文件（Launch, Home, Game, Result）
3. 在每个场景中添加 Canvas 节点和对应的脚本组件

### 技术验证
4. 编写一个 Demo 验证纯代码创建UI的可行性
5. 测试 `resources.load()` 加载图片资源
6. 测试微信小游戏构建流程

### 备选方案
如果**完全无法使用编辑器**，需要：
- 评估使用其他游戏引擎（如 Phaser.js、LayaAir）
- 重写现有54个TypeScript文件
- 这将导致项目延期3-6个月

---

## 7. 结论

| 方案 | 可行性 | 推荐度 |
|------|--------|--------|
| 纯代码创建场景 | ✅ 完全可行 | ⭐⭐⭐⭐⭐ |
| 命令行创建场景 | ❌ 不可行 | - |
| 脱离Cocos引擎 | ❌ 不推荐 | - |
| 混合模式 | ✅ 推荐 | ⭐⭐⭐⭐⭐ |

**核心结论**: 
- **纯代码创建场景完全可行**，当前代码已展示此能力
- 需要**至少1个基础 `.scene` 文件**作为入口（需要编辑器创建一次）
- 后续所有场景内容可完全由 TypeScript 代码动态生成
- 微信小游戏构建**必须**通过 Cocos Creator 编辑器完成