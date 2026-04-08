export const GAME_EVENTS = {
  GAME_INIT: 'game:init',
  LEVEL_LOADED: 'level:loaded',
  LEVEL_START: 'level-start',
  LEVEL_COMPLETE: 'level-complete',
  LEVEL_FAILED: 'level-failed',
  ITEM_DRAG_START: 'item:drag-start',
  ITEM_DRAG_END: 'item:drag-end',
  ITEM_PLACED: 'item:placed',
  ITEM_REMOVED: 'item:removed',
  ITEM_PICKED: 'item:picked',
  COMBO_TRIGGERED: 'combo-triggered',
  AD_REWARD_GRANTED: 'ad-reward-granted',
  SCORE_UPDATED: 'score-updated',
  TIME_WARNING: 'time-warning',
  TOOL_UPGRADED: 'tool-upgraded',
  TOOL_DRAG_END: 'tool:drag-end',
  ACHIEVEMENT_UNLOCKED: 'achievement-unlocked',
  COLLECTION_UPDATE: 'collection-update',
  CHAPTER_UNLOCKED: 'chapter-unlocked',
  AUDIO_TOGGLE: 'audio:toggle',
  CHANGE_SCENE: 'change-scene',
  OPEN_MERGE_PANEL: 'open-merge-panel',
  OPERATION_COMPLETE: 'operation:complete',
  OPERATION_PROGRESS: 'operation:progress',
  LEVEL: 'level',
  COIN_CHANGE: 'coin-change',
} as const;

export const GAME_CONFIG = {
  DEFAULT_LEVEL_ID: 'level-001',
  SLOT_CAPACITY: 7,
  ENABLE_DEBUG_LOG: true,
  level: 'level',
  maxStarsPerLevel: 3,
} as const;

export type GameEventKey = typeof GAME_EVENTS[keyof typeof GAME_EVENTS];
