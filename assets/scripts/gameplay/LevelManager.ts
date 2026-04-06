export interface LevelDefinition {
  id: string;
  targetItems: number;
}

export class LevelManager {
  private currentLevel: LevelDefinition | null = null;

  public loadLevel(level: LevelDefinition): void {
    this.currentLevel = level;
  }

  public getCurrentLevel(): LevelDefinition | null {
    return this.currentLevel;
  }
}
