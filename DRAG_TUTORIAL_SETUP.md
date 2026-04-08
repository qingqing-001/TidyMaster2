# 拖拽教学关场景闭环 - 运行说明

## 概述
已实现完整的拖拽教学关场景闭环流程：
- 关卡配置加载 → 实例化物品和目标槽位 → 拖拽交互 → 匹配归位 → 进度更新 → 关卡完成事件触发

## 核心文件修改

### 1. `assets/data/constants.ts`
- 新增 `ITEM_PLACED` 事件（物品归位成功）
- 新增 `LEVEL_COMPLETE` 事件（关卡完成）
- 新增 `LEVEL_FAILED` 事件（关卡失败）

### 2. `assets/scripts/gameplay/LevelManager.ts`
扩展关卡管理功能：
- 新增 `ItemConfig` 接口：物品配置（ID、类型、位置）
- 新增 `SlotConfig` 接口：槽位配置（ID、允许的物品类型、位置）
- 扩展 `LevelDefinition` 接口：支持物品列表、槽位列表、目标物品数
- 新增方法：
  - `markItemPlaced(itemId)`：标记物品已归位
  - `getPlacedCount()`：获取已归位物品数量
  - `isLevelComplete()`：检查是否完成关卡
  - `resetProgress()`：重置进度

### 3. `assets/scripts/scenes/GameScene.ts`
实现游戏场景核心逻辑：
- 属性：
  - `itemPrefab`：物品预制体（编辑器中配置）
  - `slotPrefab`：槽位预制体（编辑器中配置）
  - `itemContainer`：物品容器节点
  - `slotContainer`：槽位容器节点
  - `progressLabel`：进度显示标签
- 核心方法：
  - `loadTutorialLevel()`：加载教学关卡配置
  - `instantiateLevelObjects()`：实例化关卡对象
  - `createSlot()`：创建槽位并配置
  - `createItem()`：创建物品并附加组件
  - `handleItemPlaced()`：处理物品归位事件
  - `updateProgressDisplay()`：更新进度显示
  - `onLevelComplete()`：关卡完成处理

### 4. `assets/scripts/gameplay/DragHandler.ts`
- 在 `snapToSlot()` 方法中添加事件发送
- 当物品成功归位时触发 `GAME_EVENTS.ITEM_PLACED` 事件
- 传递数据：`{ itemId, slotId }`

### 5. `assets/scripts/core/GameManager.ts`
- 修复兼容性问题，使用新的 `LevelDefinition` 结构

## 验证流程

### 1. TypeScript 编译检查
```bash
cd /path/to/TidyMaster2/repo
npx tsc --noEmit
```
预期结果：无错误输出

### 2. Cocos Creator 编辑器配置

在 Cocos Creator 3.x 中打开项目：

#### 步骤 1：创建预制体
1. **创建物品预制体**
   - 创建一个空节点，添加 `Sprite` 组件
   - 添加 `ItemController` 组件
   - 添加 `DragHandler` 组件
   - 保存为预制体 `ItemPrefab`

2. **创建槽位预制体**
   - 创建一个空节点，添加 `Sprite` 组件
   - 添加 `SlotController` 组件
   - 保存为预制体 `SlotPrefab`

#### 步骤 2：配置场景
1. **打开游戏场景**
2. **创建容器节点**
   - 创建 `ItemContainer` 节点（物品容器）
   - 创建 `SlotContainer` 节点（槽位容器）
3. **添加进度显示**
   - 创建一个 `Label` 节点用于显示进度
4. **挂载 GameScene 组件**
   - 在场景根节点添加 `GameScene` 组件
   - 配置属性：
     - `Item Prefab`：拖入 ItemPrefab
     - `Slot Prefab`：拖入 SlotPrefab
     - `Item Container`：拖入 ItemContainer 节点
     - `Slot Container`：拖入 SlotContainer 节点
     - `Progress Label`：拖入 Label 节点

#### 步骤 3：添加粒子特效管理器
1. 在场景中添加 `ParticleEffects` 组件（可选，用于视觉反馈）

### 3. 运行测试

在 Cocos Creator 编辑器中：
1. 点击"运行"按钮
2. 观察场景加载
3. 验证：
   - 3个物品在下方（苹果、书本、杯子）
   - 3个槽位在上方
   - 拖拽物品到正确槽位
   - 检查进度显示更新（0/3 → 1/3 → 2/3 → 3/3）
   - 完成所有物品后控制台输出：`[GameScene] 关卡完成！获得 3 星评价`

## 教学关卡配置

```typescript
{
  id: 'tutorial_001',
  name: '教学关',
  items: [
    { id: 'item_001', type: 'apple', position: { x: -200, y: -150 } },
    { id: 'item_002', type: 'book', position: { x: 0, y: -150 } },
    { id: 'item_003', type: 'cup', position: { x: 200, y: -150 } }
  ],
  slots: [
    { id: 'slot_001', allowedItemTypes: ['apple'], position: { x: -200, y: 100 } },
    { id: 'slot_002', allowedItemTypes: ['book'], position: { x: 0, y: 100 } },
    { id: 'slot_003', allowedItemTypes: ['cup'], position: { x: 200, y: 100 } }
  ],
  requiredItems: 3,
  timeLimit: 60
}
```

## 事件流程图

```
用户拖拽物品
    ↓
[DragHandler] onTouchStart
    ↓
[DragHandler] onTouchMove（检查目标槽位）
    ↓
[DragHandler] onTouchEnd
    ↓
如果匹配成功 → snapToSlot()
    ↓
播放音效 + 粒子特效
    ↓
触发事件：GAME_EVENTS.ITEM_PLACED
    ↓
[GameScene] handleItemPlaced()
    ↓
[LevelManager] markItemPlaced()
    ↓
[GameScene] updateProgressDisplay()
    ↓
检查是否完成
    ↓
如果是 → [GameScene] onLevelComplete()
    ↓
触发事件：GAME_EVENTS.LEVEL_COMPLETE
```

## 后续扩展建议

1. **添加计时器**
   - 在 `GameScene` 中实现倒计时逻辑
   - 时间耗尽时触发 `GAME_EVENTS.LEVEL_FAILED`

2. **添加关卡配置文件**
   - 将关卡配置移到 JSON 文件
   - 实现多关卡加载

3. **添加结算场景**
   - 创建 `ResultScene` 显示星级评价
   - 处理重新开始/下一关逻辑

4. **视觉优化**
   - 添加物品实际贴图
   - 优化槽位高亮效果
   - 添加完成动画

## 编译验证

✅ TypeScript 编译通过（npx tsc --noEmit）
✅ 所有新增事件已定义
✅ 类型安全检查通过
✅ 向后兼容性保持

## 注意事项

1. 预制体必须在 Cocos Creator 编辑器中创建和配置
2. 确保容器节点在场景中存在
3. 槽位和物品的 `UITransform` 尺寸会自动设置
4. 颜色为占位符，实际项目中应使用真实贴图
