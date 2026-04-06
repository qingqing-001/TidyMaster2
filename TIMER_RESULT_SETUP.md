# TimerController 与 ResultScene 编辑器配置指南

本文档说明如何在 Cocos Creator 编辑器中正确配置 TimerController 和 ResultScene 组件。

## 1. TimerController 预制体配置

### 1.1 创建 Timer 预制体

1. 在编辑器中创建一个空节点，命名为 `Timer`
2. 添加 `TimerController` 组件
3. 添加一个 `Label` 子节点用于显示时间

### 1.2 组件属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| timeLabel | Label | 否 | 时间显示标签（主要） |
| timerLabel | Label | 否 | 时间显示标签（备选） |

### 1.3 预制体层级结构

```
Timer (Node)
├── TimerController (Component)
└── TimeLabel (Node)
    └── Label (Component)
```

### 1.4 使用方式

在 GameScene 中使用 TimerController：

```typescript
import { TimerController } from '../gameplay/TimerController';

// 获取或添加组件
const timerController = node.getComponent(TimerController);

// 开始倒计时（60秒）
timerController.startTimer(60);

// 暂停
timerController.pauseTimer();

// 恢复
timerController.resumeTimer();

// 增加时间（广告续命）
timerController.addTime(30);
```

### 1.5 事件触发

当倒计时结束时，TimerController 会自动触发 `LEVEL_FAILED` 事件：

```typescript
// 事件 payload
{
    levelId: string  // 节点名称作为关卡ID
}
```

---

## 2. ResultScene 场景配置

### 2.1 创建 Result 场景

1. 创建新场景 `ResultScene`
2. 根节点添加 `ResultScene` 组件

### 2.2 推荐层级结构

```
ResultScene (Node)
├── ResultScene (Component)
├── Background (Node, Sprite)
├── SuccessPanel (Node)
│   ├── TitleLabel (Node, Label)  - "⭐ 关卡完成！⭐"
│   ├── StarsLabel (Node, Label)  - "★★★" / "★★☆"
│   ├── DescLabel (Node, Label)   - "恭喜完成 关卡名！"
│   ├── NextButton (Node, Button)
│   ├── RetryButton (Node, Button)
│   └── AdButton (Node, Button)
├── FailPanel (Node)
│   ├── TitleLabel (Node, Label)  - "⏰ 时间耗尽！⏰"
│   ├── DescLabel (Node, Label)   - "未能在规定时间内完成"
│   ├── RetryButton (Node, Button)
│   └── HomeButton (Node, Button)
```

### 2.3 组件属性

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| titleLabel | Label | 否 | 结果标题标签 |
| starsLabel | Label | 否 | 星级评价标签 |
| successPanel | Node | 否 | 成功时显示的面板 |
| failPanel | Node | 否 | 失败时显示的面板 |
| descLabel | Label | 否 | 描述文本标签 |

### 2.4 事件监听

ResultScene 会自动监听以下事件：

| 事件 | 说明 | Payload |
|------|------|---------|
| LEVEL_COMPLETE | 关卡完成 | `{ levelId?: string, stars: number }` |
| LEVEL_FAILED | 关卡失败 | `{ levelId?: string }` |

### 2.5 按钮绑定

在编辑器中为按钮绑定点击事件：

| 按钮 | 方法 | 说明 |
|------|------|------|
| NextButton | onNextLevel | 进入下一关 |
| RetryButton | onRetry | 重新开始当前关卡 |
| HomeButton | onBackHome | 返回主页 |
| AdButton | onWatchAd | 观看广告翻倍奖励 |

---

## 3. 完整游戏流程接线

### 3.1 场景切换流程

1. **HomeScene** → 点击开始 → 切换到 **GameScene**
2. **GameScene**:
   - 加载关卡配置
   - 实例化物品和槽位
   - 启动 TimerController 倒计时
3. **游戏进行中**:
   - 玩家拖拽物品 → 归位 → 触发 `ITEM_PLACED` 事件
   - GameScene 监听并更新进度
   - 全部归位 → 触发 `LEVEL_COMPLETE` 事件
4. **GameScene** → 切换到 **ResultScene**
5. **ResultScene**:
   - 监听 `LEVEL_COMPLETE` → 显示成功面板
   - 监听 `LEVEL_FAILED` → 显示失败面板

### 3.2 事件流程图

```
拖拽物品
    ↓
成功归位 → DragHandler.emit(ITEM_PLACED)
    ↓
GameScene.handleItemPlaced() → 更新进度
    ↓
全部归位? → 是 → GameScene.onLevelComplete()
    ↓                                    ↓
触发 LEVEL_COMPLETE             计时结束 → TimerController.onTimeOut()
    ↓                                    ↓
ResultScene.onLevelComplete()   触发 LEVEL_FAILED
    ↓                                    ↓
显示成功面板                    ResultScene.onLevelFailed()
                                   ↓
                              显示失败面板
```

---

## 4. 验证步骤

### 4.1 验证 TimerController

1. 创建测试场景，添加 Timer 节点
2. 配置 timeLabel
3. 调用 `startTimer(10)`
4. 观察每秒时间递减
5. 10秒后检查是否触发 LEVEL_FAILED 事件

### 4.2 验证 ResultScene

1. 创建 ResultScene 场景
2. 在控制台监听事件：`console.log(EventManager.getInstance().listeners)`
3. 从 GameScene 手动触发 LEVEL_COMPLETE 事件
4. 检查 successPanel 是否显示，titleLabel 是否更新

### 4.3 验证完整流程

1. 运行游戏，拖拽所有物品归位
2. 确认看到 "⭐ 关卡完成！⭐" 界面
3. 重置，重新开始但不归位任何物品
4. 等待倒计时结束
5. 确认看到 "⏰ 时间耗尽！⏰" 界面

---

## 5. 常见问题

### Q: 时间标签显示为 undefined
A: 确保 timeLabel 或 timerLabel 属性已正确绑定到 Label 组件

### Q: LEVEL_FAILED 事件没有触发
A: 检查 TimerController 是否正确调用了 startTimer() 方法

### Q: ResultScene 没有收到事件
A: 确保 ResultScene 已加载且 registerEvents() 已调用（通常在 start() 中）

### Q: 面板没有显示/隐藏
A: 确认 successPanel 和 failPanel 节点已正确配置，且节点名称与代码中一致