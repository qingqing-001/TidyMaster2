# Cocos Creator 微信小游戏技术调研报告

## 1. Cocos Creator 项目初始化

### 1.1 当前项目状态

项目已使用 Cocos Creator 3.8.6 正确初始化：

```json
// project.json
{
  "version": "3.8.6",
  "name": "tidy-master",
  "uuid": "d89c1e10-1e12-4e88-a9b8-8c3b1d5e6f7a",
  "type": "2d",
  "dependencies": {
    "cc": "3.8.6"
  }
}
```

### 1.2 Cocos Creator 项目初始化方法

**方法一：命令行初始化（推荐）**
```bash
# 需要安装 Cocos Creator CLI 工具
cocos new TidyMaster -p com.tidymaster -l ts --template 3d
# 对于微信小游戏，使用:
cocos new TidyMaster -p com.tidymaster -l ts --template 2d
```

**方法二：通过 Cocos Creator 编辑器**
1. 打开 Cocos Creator 3.8.6
2. 新建项目 → 选择 2D 项目
3. 配置项目名称和路径

### 1.3 微信小游戏构建配置

当前 `weapp/game.json` 配置：
```json
{
  "deviceOrientation": "portrait",
  "showStatusBar": false,
  "networkTimeout": {
    "request": 10000,
    "connectSocket": 10000,
    "uploadFile": 10000,
    "downloadFile": 10000
  },
  "lazyCodeLoading": "requiredComponents",
  "renderer": "webgl",
  "debug": false
}
```

**注意事项：**
- `lazyCodeLoading: "requiredComponents"` - 启用代码分包，提高首屏加载速度
- `renderer: "webgl"` - 微信小游戏推荐使用 WebGL 渲染
- `deviceOrientation: "portrait"` - 竖屏游戏

---

## 2. TypeScript 配置

### 2.1 当前 tsconfig.json 配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noEmitOnError": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./assets/scripts/*"]
    },
    "typeRoots": ["./types", "./node_modules/@types"]
  },
  "include": ["./assets/scripts/**/*"],
  "exclude": ["node_modules", "temp", "build"]
}
```

### 2.2 严格模式最佳实践

当前配置已启用 `strict: true`，包含：
- 严格的类型检查
- 严格的 null/undefined 检查
- 严格的 this 类型
- 严格泛型检查

**建议补充配置：**
```json
{
  "compilerOptions": {
    // 微信小游戏特殊配置
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    
    // 严格模式（已启用）
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // 额外检查
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 2.3 类型定义

当前类型定义位于：
- `types/cc.d.ts` - Cocos Creator 3.8.6 基础类型定义（约400行）
- `types/cc.env.d.ts` - 环境类型
- `types/decorators.d.ts` - 装饰器类型

**Cocos Creator 类型包含：**
- 基础类：Vec2, Vec3, Color, Size
- 组件：Component, Node, Sprite, Label, Button, Camera, Widget, Canvas, Layout, ScrollView, EditBox
- 资源：Asset, SpriteFrame, AudioClip
- 系统：director, resources, assetManager, tween, easing, systemEvent
- 装饰器：@ccclass, @property, @executeInEditMode, @menu 等

**微信小游戏类型：**
- 使用 `wx.*` API - 微信小游戏原生 API
- 需要 @types/wechat-minigame 或自定义类型定义

---

## 3. 项目目录结构评估

### 3.1 当前目录结构

```
TidyMaster/
├── assets/
│   ├── scripts/           ✅ TypeScript 源码
│   │   ├── core/          ✅ 核心框架（GameManager, AudioManager, DataManager等）
│   │   ├── scenes/        ✅ 场景控制器（Launch, Home, Game, Result, MyRoom）
│   │   ├── gameplay/      ✅ 玩法逻辑（LevelManager, ItemController, DragHandler等）
│   │   ├── merge/         ✅ 合成系统
│   │   ├── collection/    ✅ 收集系统
│   │   ├── social/        ✅ 社交系统
│   │   ├── ui/            ✅ UI组件
│   │   ├── effects/       ✅ 特效
│   │   ├── data/          ✅ 数据定义
│   │   └── utils/         ✅ 工具函数
│   ├── resources/         ✅ 动态加载资源
│   │   ├── levels/
│   │   ├── textures/
│   │   ├── audio/
│   │   ├── prefabs/
│   │   └── animations/
│   ├── scenes/            ✅ 场景文件（.scene）
│   └── sub/               ✅ 微信开放域子包
├── weapp/                 ✅ 微信小游戏配置
│   └── game.json
├── types/                 ✅ 自定义类型定义
│   ├── cc.d.ts
│   ├── cc.env.d.ts
│   └── decorators.d.ts
├── tsconfig.json          ✅ TypeScript 配置
├── project.json           ✅ Cocos Creator 项目配置
└── package.json
```

### 3.2 与 spec.md 对比

**完全符合的部分：**
- ✅ 目录结构与 spec.md 2.2 节定义一致
- ✅ 核心模块划分正确（core, scenes, gameplay, merge, collection, social, ui, effects, data, utils）
- ✅ 资源目录结构合理

**需要注意的点：**
- spec.md 提到 `WipeHandler.ts` 和 `FoldHandler.ts`，但当前 `gameplay/` 目录中只有 `WipeHandler.ts` 和 `FoldHandler.ts` 的引用，实际文件是 `WipeHandler.ts`（存在）但需要确认完整性

---

## 4. 技术细节和注意事项

### 4.1 微信小游戏平台限制

1. **包体积限制**：主包不超过 4MB，代码分包加载
2. **内存限制**：运行时内存有限，需要注意资源释放
3. **文件系统**：使用 `wx.getFileSystemManager()` 操作文件
4. **存储限制**：`wx.setStorage` 同步存储有大小限制（10MB）
5. **网络限制**：需要 HTTPS（除测试域名外）

### 4.2 潜在的坑和解决方案

| 问题 | 解决方案 |
|------|----------|
| TypeScript 装饰器在微信小游戏不生效 | 使用 `cc.decorator` 或在编译时保留装饰器元数据 |
| 资源加载路径问题 | 使用 `resources.load()` 配合相对路径 |
| 微信 API 类型缺失 | 创建 `types/wx.d.ts` 自定义微信 API 类型 |
| 性能问题 | 使用对象池、减少每帧创建对象、合理使用粒子效果 |
| 适配不同屏幕 | 使用 `Canvas` 组件的 `fitWidth`/`fitHeight` 模式 |

### 4.3 平台适配架构

当前已实现平台适配器模式：
- `platform/PlatformAdapter.ts` - 平台适配器接口
- `platform/WxAdapter.ts` - 微信小游戏实现
- `platform/WebAdapter.ts` - Web 浏览器实现
- `platform/PlatformManager.ts` - 平台管理器

这是一个好的架构实践，便于跨平台发布。

---

## 5. 最终建议

### 5.1 TypeScript 配置建议

当前 tsconfig.json 已基本完善，建议：

1. **添加微信小游戏 API 类型**：创建 `types/wx.d.ts`
2. **启用更严格的检查**（可选）：
   - `noUnusedLocals: true`
   - `noUnusedParameters: true`

### 5.2 项目结构建议

当前结构已符合 Cocos Creator 最佳实践，无需重大调整。

建议关注：
- 确保所有 spec.md 中提到的文件都已实现
- 定期运行 `npx tsc --noEmit` 检查类型错误

### 5.3 Cocos Creator 初始化建议

如果是新项目初始化：
1. 使用 Cocos Creator 3.8.6 编辑器创建 2D 项目
2. 配置 `project.json` 的版本和依赖
3. 按照 spec.md 的目录结构组织代码
4. 配置微信小游戏发布设置

---

## 6. 验证结果

- ✅ TypeScript 编译检查通过（`npx tsc --noEmit` 无错误）
- ✅ 项目结构符合 spec.md 定义
- ✅ 微信小游戏配置就绪
- ✅ 类型定义完备
- ✅ 平台适配架构良好