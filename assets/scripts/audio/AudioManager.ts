import { GAME_CONFIG } from '../../data/constants';

export class AudioManager {
  private static instance: AudioManager | null = null;
  private enabled = true;

  public static getInstance(): AudioManager {
    if (AudioManager.instance === null) {
      AudioManager.instance = new AudioManager();
    }

    return AudioManager.instance;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public canPlay(): boolean {
    return this.enabled;
  }

  public playClick(): void {
    if (!this.enabled) {
      return;
    }

    // placeholder: bind AudioSource/clip in editor later
  }

  public playSFX(soundName: string): void {
    if (!this.enabled) {
      return;
    }

    // placeholder: play sound effect based on soundName
    // Will be integrated with actual audio assets later
    if (GAME_CONFIG.ENABLE_DEBUG_LOG) {
      console.log(`[AudioManager] Playing SFX: ${soundName}`);
    }
  }
}
