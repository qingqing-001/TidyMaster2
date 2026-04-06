export interface ItemConfig {
  id: string;
  type: string;
  position: { x: number; y: number };
}

export interface SlotConfig {
  id: string;
  allowedItemTypes: string[];
  position: { x: number; y: number };
}

export interface LevelDefinition {
  id: string;
  name: string;
  items: ItemConfig[];
  slots: SlotConfig[];
  requiredItems: number;
  timeLimit?: number;
}

export class LevelManager {
  private currentLevel: LevelDefinition | null = null;
  private placedItems: Set<string> = new Set();

  public loadLevel(level: LevelDefinition): void {
    this.currentLevel = level;
    this.placedItems.clear();
  }

  public getCurrentLevel(): LevelDefinition | null {
    return this.currentLevel;
  }

  public markItemPlaced(itemId: string): void {
    this.placedItems.add(itemId);
  }

  public getPlacedCount(): number {
    return this.placedItems.size;
  }

  public isLevelComplete(): boolean {
    if (!this.currentLevel) {
      return false;
    }
    return this.placedItems.size >= this.currentLevel.requiredItems;
  }

  public resetProgress(): void {
    this.placedItems.clear();
  }
}
