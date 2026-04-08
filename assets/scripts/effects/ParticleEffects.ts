import { _decorator, Component, Vec3, Node, instantiate, Sprite, tween, v3, UITransform, ParticleSystem, color, math, UIOpacity } from 'cc';
import { GAME_CONFIG } from '../../data/constants';

const { ccclass, property } = _decorator;

@ccclass('ParticleEffects')
export class ParticleEffects extends Component {
  @property({ type: Node, tooltip: '成功归位粒子特效预制体' })
  private successParticlePrefab: Node | null = null;

  @property({ type: Node, tooltip: '错误提示粒子特效预制体' })
  private errorParticlePrefab: Node | null = null;

  private static instance: ParticleEffects | null = null;

  public static getInstance(): ParticleEffects | null {
    return ParticleEffects.instance;
  }

  onLoad(): void {
    ParticleEffects.instance = this;
  }

  onDestroy(): void {
    if (ParticleEffects.instance === this) {
      ParticleEffects.instance = null;
    }
  }

  public static showSuccessParticles(position: Vec3): void {
    const instance = ParticleEffects.instance;
    if (!instance) {
      return;
    }

    instance.spawnEffect(position, instance.successParticlePrefab, () => {
      instance.createStarBurst(position);
    });
  }

  public static showErrorParticles(position: Vec3): void {
    const instance = ParticleEffects.instance;
    if (!instance) {
      return;
    }

    instance.spawnEffect(position, instance.errorParticlePrefab, () => {
      instance.createErrorBurst(position);
    });
  }

  private spawnEffect(position: Vec3, prefab: Node | null, fallback: () => void): void {
    if (prefab) {
      const particle = instantiate(prefab);
      particle.setPosition(position);
      this.node.addChild(particle);
      this.cleanupNode(particle, 1.5);
      return;
    }

    fallback();
  }

  private createStarBurst(position: Vec3): void {
    if (this.tryCreateParticleSystem(position, true)) {
      return;
    }

    this.createSpriteBurst(position, true);
  }

  private createErrorBurst(position: Vec3): void {
    if (this.tryCreateParticleSystem(position, false)) {
      return;
    }

    this.createSpriteBurst(position, false);
  }

  private tryCreateParticleSystem(position: Vec3, success: boolean): boolean {
    try {
      const node = new Node();
      node.name = success ? 'particle_star' : 'particle_error';
      node.setPosition(position);
      this.node.addChild(node);

      const particleSystem = node.addComponent(ParticleSystem) as unknown as ParticleSystem;
      if (success) {
        particleSystem.duration = 0.45;
        particleSystem.emissionRate = 60;
        particleSystem.totalParticles = 36;
        particleSystem.life = 0.55;
        particleSystem.lifeVar = 0.15;
        particleSystem.startColor = color(255, 244, 120, 255);
        particleSystem.endColor = color(255, 180, 0, 0);
        particleSystem.startSize = 18;
        particleSystem.endSize = 0;
        particleSystem.startSpeed = 180;
        particleSystem.endSpeed = 20;
        particleSystem.gravity = v3(0, -220, 0);
        particleSystem.posVar = v3(12, 12, 0);
      } else {
        particleSystem.duration = 0.25;
        particleSystem.emissionRate = 42;
        particleSystem.totalParticles = 20;
        particleSystem.life = 0.3;
        particleSystem.lifeVar = 0.1;
        particleSystem.startColor = color(255, 80, 80, 255);
        particleSystem.endColor = color(180, 0, 0, 0);
        particleSystem.startSize = 12;
        particleSystem.endSize = 0;
        particleSystem.startSpeed = 120;
        particleSystem.endSpeed = 10;
        particleSystem.gravity = v3(0, -120, 0);
        particleSystem.posVar = v3(8, 8, 0);
      }

      particleSystem.resetSystem();
      this.cleanupNode(node, success ? 1.0 : 0.6);
      return true;
    } catch (error) {
      if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
        console.warn('[ParticleEffects] ParticleSystem unavailable, fallback to sprite burst', error);
      }
      return false;
    }
  }

  private createSpriteBurst(position: Vec3, success: boolean): void {
    const count = success ? 8 : 6;
    const distance = success ? 64 : 42;
    const duration = success ? 0.55 : 0.35;

    for (let index = 0; index < count; index++) {
      const spriteNode = this.createBurstSprite(success, index);
      spriteNode.setPosition(position);
      this.node.addChild(spriteNode);

      const angle = (Math.PI * 2 * index) / count;
      const randomDistance = distance + math.randomRange(-8, 8);
      const targetX = position.x + Math.cos(angle) * randomDistance;
      const targetY = position.y + Math.sin(angle) * randomDistance;
      const targetPosition = v3(targetX, targetY, position.z);
      const opacity = spriteNode.addComponent(UIOpacity);
      opacity.opacity = 255;

      tween(spriteNode)
        .parallel(
          tween(spriteNode).to(duration, { position: targetPosition }),
          tween(spriteNode).to(duration * 0.4, { scale: v3(1.15, 1.15, 1) }).to(duration * 0.6, { scale: v3(0, 0, 1) }),
          tween(opacity).to(duration, { opacity: 0 })
        )
        .call(() => {
          if (spriteNode.isValid) {
            spriteNode.destroy();
          }
        })
        .start();
    }

    if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
      console.log(`[ParticleEffects] ${success ? 'success' : 'error'} sprite burst at`, position);
    }
  }

  private createBurstSprite(success: boolean, index: number): Node {
    const node = new Node();
    node.name = success ? `star_${index}` : `error_${index}`;
    const sprite = node.addComponent(Sprite) as unknown as Sprite;
    const transform = node.addComponent(UITransform) as unknown as UITransform;

    transform.contentSize = success ? { width: 24, height: 24 } : { width: 18, height: 18 };
    sprite.color = success ? color(255, 231, 90, 255) : color(255, 90, 90, 255);
    node.setScale(v3(0.35, 0.35, 1));

    return node;
  }

  private cleanupNode(node: Node, delaySeconds: number): void {
    window.setTimeout(() => {
      if (node.isValid) {
        node.destroy();
      }
    }, delaySeconds * 1000);
  }
}
