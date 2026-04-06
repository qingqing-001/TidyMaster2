import { _decorator, Component, Sprite } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 前后对比组件
 * 显示关卡完成时的整理前后对比
 */
@ccclass('BeforeAfterCompare')
export class BeforeAfterCompare extends Component {
    @property(Sprite)
    beforeImage: Sprite = null!;

    @property(Sprite)
    afterImage: Sprite = null!;

    onLoad() {
        // TODO: 初始化对比UI
    }

    /**
     * 设置对比图
     */
    setImages(beforeUrl: string, afterUrl: string): void {
        // TODO: 加载前后对比图片
    }

    /**
     * 生成对比图
     */
    generateCompareImage(beforeData: any, afterData: any): void {
        // TODO: 将前后状态渲染为对比图
    }
}
