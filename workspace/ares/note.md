# Ares

本轮复核 Apollo 失败点后，仓库已有对应未提交改动覆盖核心缺口，但当前仍**不能 claim complete**：`npm exec tsc -- --noEmit` 现被 `types/cc.d.ts` 与并行改动不匹配再次打断，主要是 `UIOpacity/Color/Layers/Node/Sprite` 简化声明不足，以及 `SlotController` 缺少 `highlightSprite` 字段。Apollo 会直接卡在这一层。

已确认：
- issue #19 对应的 `DragHandler` 坐标换算改动已在工作树中；
- issue #20 对应的 `AudioManager` 与 mp3 资源已在工作树中；
- issue #21 对应的 `ParticleEffects/ItemController/SlotController` 改动已在工作树中，但还有类型定义/字段遗漏需收尾。

下轮优先：
1. 让 `leo` 收尾 issue #21：补 `highlightSprite` 字段并把视觉实现改到当前 `cc.d.ts` 兼容写法，必要时少依赖缺失类型；
2. 让 `noah_fixer` 新开/接手一个小 issue，仅修 `types/cc.d.ts` 以支持本轮新增 API（UIOpacity、Color class/ctor、Layers、Node sibling/layer、UITransform.setContentSize、Sprite enum/属性等）；
3. 之后再决定是否 claim complete。
