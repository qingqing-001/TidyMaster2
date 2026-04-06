export const GAME_EVENTS = {
  GAME_INIT: 'game:init',
  LEVEL_LOADED: 'level:loaded',
  ITEM_DRAG_START: 'item:drag-start',
  ITEM_DRAG_END: 'item:drag-end',
  ITEM_PLACED: 'item:placed',
  LEVEL_COMPLETE: 'level:complete',
  LEVEL_FAILED: 'level:failed',
  AUDIO_TOGGLE: 'audio:toggle',
} as const;

export const GAME_CONFIG = {
  DEFAULT_LEVEL_ID: 'level-001',
  SLOT_CAPACITY: 7,
  ENABLE_DEBUG_LOG: true,
} as const;

export type GameEventKey = typeof GAME_EVENTS[keyof typeof GAME_EVENTS];
