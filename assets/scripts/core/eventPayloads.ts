export interface LevelCompletePayload {
  levelId: number;
  stars: number;
  sceneDisplayName?: string;
  rewardCoins: number;
  nextLevelId?: number;
}

export interface LevelFailedPayload {
  levelId?: number;
}

export interface ChangeScenePayload {
  sceneName: string;
  levelId?: number;
}
