# Bob 工作笔记 - Issue #34

## 当前任务

### Issue #34: M5 - 实现新手引导系统（前3关）

**目标**: 为前3关（LEVEL_1_1, LEVEL_1_2, LEVEL_1_3）实现新手引导系统

**要求**:
1. 第1关：显示拖拽提示箭头，高亮物品
2. 第2关：显示目标槽位提示
3. 第3关：显示操作类型提示（拖拽/擦洗）
4. 引导系统应该在玩家首次进入关卡时自动触发

**关键文件**:
- `assets/scripts/scenes/GameScene.ts` - 游戏场景
- `assets/scripts/ui/` - UI组件目录
- `assets/scripts/gameplay/DragHandler.ts` - 拖拽处理器
- `assets/scripts/data/levels.ts` - 关卡配置

## 执行步骤

1. 创建新手引导组件 `TutorialGuide.ts`
2. 在GameScene中集成引导系统
3. 实现第1关的拖拽提示
4. 实现第2关的槽位提示
5. 实现第3关的操作提示
6. 验证TypeScript编译通过
7. 在Note中记录完成状态

## 状态

待开始...