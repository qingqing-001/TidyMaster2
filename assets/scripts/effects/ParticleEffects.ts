import { _decorator, Component, Node, ParticleSystem } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 粒子特效管理器
 * 管理游戏中的所有粒子特效
 */
@ccclass('ParticleEffects')
export class ParticleEffects extends Component {
    private static _instance: ParticleEffects;

    static get instance(): ParticleEffects {
        if (!this._instance) {
            this._instance = new ParticleEffects();
        }
        return this._instance;
    }

    private _particlePool: Map<string, Node[]> = new Map();

    private constructor() {
        super();
    }

    onLoad() {
        // TODO: 预加载粒子模板
    }

    /**
     * 播放星星粒子（物品归位）
     */
    playStars(position: { x: number, y: number }): void {
        // TODO: 播放星星爆炸特效
    }

    /**
     * 播放完成庆祝粒子
     */
    playCelebration(): void {
        // TODO: 播放关卡完成庆祝特效
    }

    /**
     * 播放合成成功粒子
     */
    playMergeEffect(position: { x: number, y: number }): void {
        // TODO: 播放合成成功特效
    }

    /**
     * 回收粒子
     */
    recycleParticle(poolName: string, particle: Node): void {
        // TODO: 将粒子放回对象池
    }
}
