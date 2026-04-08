import { OperationType } from '../data/LevelData';
import { LevelDataConfig, LevelItemConfig, LevelSlotConfig } from '../data/types';

export interface ItemConfig {
  id: string;
  type: string;
  position: { x: number; y: number };
  operation: OperationType;
  targetSlotId: string;
}

export interface SlotConfig {
  id: string;
  allowedItemTypes: string[];
  position: { x: number; y: number };
  size?: { w: number; h: number };
  label?: string;
}

export interface LevelDefinition {
  id: string;
  levelId: number;
  chapter: number;
  name: string;
  sceneName: string;
  items: ItemConfig[];
  slots: SlotConfig[];
  requiredItems: number;
  timeLimit?: number;
  operations: OperationType[];
}

export class LevelManager {
  private currentLevel: LevelDefinition | null = null;
  private progressByItem: Map<string, boolean> = new Map();
  private levelConfigById: Map<number, LevelDataConfig> = new Map();
  private itemConfigById: Map<string, LevelItemConfig> = new Map();
  private slotConfigById: Map<string, LevelSlotConfig> = new Map();

  public loadLevel(level: LevelDefinition, sourceConfig?: LevelDataConfig): void {
    this.currentLevel = level;
    this.progressByItem.clear();
    this.itemConfigById.clear();
    this.slotConfigById.clear();

    level.items.forEach((item) => this.progressByItem.set(item.id, false));
    level.slots.forEach((slot) => this.slotConfigById.set(slot.id, {
      id: slot.id,
      pos: slot.position,
      acceptTypes: slot.allowedItemTypes as any,
      size: slot.size ?? { w: 100, h: 100 },
      label: slot.label,
    }));

    if (sourceConfig) {
      this.levelConfigById.set(sourceConfig.id, sourceConfig);
      sourceConfig.items.forEach((item) => this.itemConfigById.set(item.id, item));
      sourceConfig.slots.forEach((slot) => this.slotConfigById.set(slot.id, slot));
    }
  }

  public loadFromConfig(levelConfig: LevelDataConfig): LevelDefinition {
    const level: LevelDefinition = {
      id: `level_${levelConfig.id}`,
      levelId: levelConfig.id,
      chapter: levelConfig.chapter,
      name: levelConfig.sceneDisplayName,
      sceneName: levelConfig.sceneName,
      items: levelConfig.items.map((item) => ({
        id: item.id,
        type: item.type,
        position: item.initialPos,
        operation: item.operation,
        targetSlotId: item.targetSlotId,
      })),
      slots: levelConfig.slots.map((slot) => ({
        id: slot.id,
        allowedItemTypes: slot.acceptTypes,
        position: slot.pos,
        size: slot.size,
        label: slot.label,
      })),
      requiredItems: levelConfig.items.length,
      timeLimit: levelConfig.timeLimit > 0 ? levelConfig.timeLimit : undefined,
      operations: [...levelConfig.operations],
    };

    this.loadLevel(level, levelConfig);
    return level;
  }

  public getCurrentLevel(): LevelDefinition | null {
    return this.currentLevel;
  }

  public getLevelConfig(levelId?: number): LevelDataConfig | null {
    if (typeof levelId === 'number') {
      return this.levelConfigById.get(levelId) ?? null;
    }

    const currentLevelId = this.currentLevel?.levelId;
    return typeof currentLevelId === 'number' ? this.levelConfigById.get(currentLevelId) ?? null : null;
  }

  public getItemConfig(itemId: string): LevelItemConfig | null {
    return this.itemConfigById.get(itemId) ?? null;
  }

  public getSlotConfig(slotId: string): LevelSlotConfig | null {
    return this.slotConfigById.get(slotId) ?? null;
  }

  public markItemPlaced(itemId: string): void {
    if (!this.progressByItem.has(itemId)) {
      this.progressByItem.set(itemId, true);
      return;
    }
    this.progressByItem.set(itemId, true);
  }

  public removeItem(itemId: string): void {
    if (!this.progressByItem.has(itemId)) {
      return;
    }
    this.progressByItem.set(itemId, false);
  }

  public isItemCompleted(itemId: string): boolean {
    return this.progressByItem.get(itemId) ?? false;
  }

  public getPlacedCount(): number {
    let completed = 0;
    this.progressByItem.forEach((value) => {
      if (value) {
        completed += 1;
      }
    });
    return completed;
  }

  public isLevelComplete(): boolean {
    if (!this.currentLevel) {
      return false;
    }
    return this.getPlacedCount() >= this.currentLevel.requiredItems;
  }

  public resetProgress(): void {
    this.progressByItem.forEach((_value, key) => this.progressByItem.set(key, false));
  }
}
