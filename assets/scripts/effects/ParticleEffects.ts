import { _decorator, Component, Vec3, Node, instantiate } from 'cc';
import { GAME_CONFIG } from '../../data/constants';

const { ccclass } = _decorator;

@ccclass('ParticleEffects')
export class ParticleEffects extends Component {
  private successParticlePrefab: any = null;

  private static instance: ParticleEffects | null = null;

  public static getInstance(): ParticleEffects {
    return ParticleEffects.instance!;
  }

  onLoad(): void {
    ParticleEffects.instance = this;
  }

  /**
   * 显示成功归位粒子特效
   */
  public static showSuccessParticles(position: Vec3): void {
    const instance = ParticleEffects.instance;
    if (!instance) {
      return;
    }

    if (instance.successParticlePrefab) {
      const particle = instantiate(instance.successParticlePrefab);
      particle.setPosition(position);
      instance.node.addChild(particle);

      // 2秒后销毁粒子节点
      setTimeout(() => {
        if (particle.isValid) {
          particle.destroy();
        }
      }, 2000);
    } else {
      // 如果没有预制体，使用简单的视觉反馈
      instance.showSimpleFeedback(position);
    }
  }

  private showSimpleFeedback(position: Vec3): void {
    if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
      console.log('[ParticleEffects] Showing feedback at:', position);
    }
    // TODO: 可以在这里实现简单的视觉反馈，比如闪烁效果
  }
}
