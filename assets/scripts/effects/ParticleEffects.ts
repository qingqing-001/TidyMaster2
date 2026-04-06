import { _decorator, Component, Vec3, Node, instantiate, Sprite, tween, v3, UITransform } from 'cc';
import { GAME_CONFIG } from '../../data/constants';

const { ccclass, property } = _decorator;

@ccclass('ParticleEffects')
export class ParticleEffects extends Component {
  @property({ type: Node, tooltip: '成功归位粒子特效预制体' })
  private successParticlePrefab: Node | null = null;

  @property({ type: Node, tooltip: '错误提示粒子特效预制体' })
  private errorParticlePrefab: Node | null = null;

  private static instance: ParticleEffects | null = null;
  private particlePool: Map<string, Node[]> = new Map();

  public static getInstance(): ParticleEffects {
    return ParticleEffects.instance!;
  }

  onLoad(): void {
    ParticleEffects.instance = this;
    this.initParticlePool();
  }

  private initParticlePool(): void {
    this.particlePool.set('star', []);
    this.particlePool.set('error', []);
  }

  public static showSuccessParticles(position: Vec3): void {
    const instance = ParticleEffects.instance;
    if (!instance) {
      return;
    }

    if (instance.successParticlePrefab) {
      const particle = instantiate(instance.successParticlePrefab);
      particle.setPosition(position);
      instance.node.addChild(particle);

      setTimeout(() => {
        if (particle.isValid) {
          particle.destroy();
        }
      }, 2000);
    } else {
      instance.createStarBurst(position);
    }
  }

  public static showErrorParticles(position: Vec3): void {
    const instance = ParticleEffects.instance;
    if (!instance) {
      return;
    }

    if (instance.errorParticlePrefab) {
      const particle = instantiate(instance.errorParticlePrefab);
      particle.setPosition(position);
      instance.node.addChild(particle);

      setTimeout(() => {
        if (particle.isValid) {
          particle.destroy();
        }
      }, 1500);
    } else {
      instance.createErrorBurst(position);
    }
  }

  private createStarBurst(position: Vec3): void {
    const starCount = 8;
    const distance = 50;
    const duration = 0.6;

    for (let i = 0; i < starCount; i++) {
      const star = this.createStarSprite();
      star.setPosition(position.x, position.y, position.z);

      const angle = (i / starCount) * Math.PI * 2;
      const targetX = position.x + Math.cos(angle) * distance;
      const targetY = position.y + Math.sin(angle) * distance;

      star.setScale(0.5, 0.5, 1);
      this.node.addChild(star);

      const scaleOne: Vec3 = { x: 1, y: 1, z: 1 };
      const scaleZero: Vec3 = { x: 0, y: 0, z: 0 };

      tween(star)
        .to(0.1, { scale: scaleOne })
        .to(duration, { scale: scaleZero })
        .call(() => {
          if (star.isValid) {
            star.destroy();
          }
        })
        .start();
    }

    if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
      console.log('[ParticleEffects] Star burst at:', position);
    }
  }

  private createErrorBurst(position: Vec3): void {
    const error = this.createErrorSprite();
    error.setPosition(position.x, position.y, position.z);
    error.setScale(0.3, 0.3, 1);
    this.node.addChild(error);

    const scaleOneTwo: Vec3 = { x: 1.2, y: 1.2, z: 1 };
    const scaleZero: Vec3 = { x: 0, y: 0, z: 0 };

    tween(error)
      .to(0.3, { scale: scaleOneTwo })
      .to(0.2, { scale: scaleZero })
      .call(() => {
        if (error.isValid) {
          error.destroy();
        }
      })
      .start();

    if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
      console.log('[ParticleEffects] Error burst at:', position);
    }
  }

  private createStarSprite(): Node {
    const star = new Node();
    star.name = 'star';
    star.addComponent(Sprite);

    const transform = star.addComponent(UITransform);
    (transform as any).contentSize = { width: 30, height: 30 };

    return star;
  }

  private createErrorSprite(): Node {
    const error = new Node();
    error.name = 'error';
    error.addComponent(Sprite);

    const transform = error.addComponent(UITransform);
    (transform as any).contentSize = { width: 40, height: 40 };

    return error;
  }
}
