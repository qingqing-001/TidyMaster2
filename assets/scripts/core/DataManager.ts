export interface PlayerProgress {
  currentLevelId: string;
  soundEnabled: boolean;
}

export class DataManager {
  private static instance: DataManager | null = null;
  private progress: PlayerProgress = {
    currentLevelId: 'level-001',
    soundEnabled: true,
  };

  public static getInstance(): DataManager {
    if (DataManager.instance === null) {
      DataManager.instance = new DataManager();
    }

    return DataManager.instance;
  }

  public getProgress(): PlayerProgress {
    return { ...this.progress };
  }

  public setCurrentLevel(levelId: string): void {
    this.progress.currentLevelId = levelId;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.progress.soundEnabled = enabled;
  }
}
