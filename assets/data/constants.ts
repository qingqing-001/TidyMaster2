import { LevelDataConfig, ItemType, GameConfig, SceneConfigMap, AudioConfig, ChapterConfig } from '../scripts/data/types';

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
  COMBO_CHANGE: 'combo-change',
  ALBUM_ITEM_COLLECTED: 'album:item-collected',
  ALBUM_MILESTONE_REACHED: 'album:milestone-reached',
  ACHIEVEMENT_PROGRESS_UPDATE: 'achievement:progress-update',
  SEASON_PASS_EXP_GAINED: 'season-pass:exp-gained',
  SEASON_PASS_LEVEL_UP: 'season-pass:level-up',
  ROOM_DECORATION_PLACED: 'room:decoration-placed',
} as const;

export const GAME_CONFIG: GameConfig = {
  appName: 'TidyMaster',
  version: '1.0.0',
  ENABLE_DEBUG_LOG: true,
  targetFrameRate: 60,
  designResolution: {
    width: 750,
    height: 1334,
    fitWidth: true,
    fitHeight: false,
  },
  level: {
    tutorialChapter: 1,
    totalTutorialLevels: 5,
    defaultTimeLimit: 120,
    maxStarsPerLevel: 3,
    scorePerItem: 100,
    comboBonusStep: 25,
  },
  input: {
    dragThreshold: 10,
    wipeSamplingDistance: 24,
    longPressDurationMs: 300,
  },
  save: {
    playerDataKey: 'tidy_master_player_data',
    settingsKey: 'tidy_master_settings',
    progressKey: 'tidy_master_progress',
  },
  DEFAULT_LEVEL_ID: 'level-001',
  SLOT_CAPACITY: 7,
};

const DESK_ITEMS: ItemType[] = ['book', 'pen'];
const KITCHEN_ITEMS: ItemType[] = ['plate', 'cup', 'fork', 'spoon', 'bottle'];
const BEDROOM_ITEMS: ItemType[] = ['cloth', 'towel'];
const LIVING_ROOM_ITEMS: ItemType[] = ['book', 'cup', 'cloth', 'towel', 'toy'];

export const SCENE_CONFIG: SceneConfigMap = {
  desk: {
    id: 'desk',
    name: 'desk',
    displayName: '书桌',
    bgSprite: 'bg_desk',
    ambientSfxKey: 'sfx_room_ambience',
    items: DESK_ITEMS,
    defaultTimeLimit: 0,
  },
  kitchen: {
    id: 'kitchen',
    name: 'kitchen',
    displayName: '厨房',
    bgSprite: 'bg_kitchen',
    ambientSfxKey: 'sfx_kitchen_ambience',
    items: KITCHEN_ITEMS,
    defaultTimeLimit: 90,
  },
  table: {
    id: 'table',
    name: 'table',
    displayName: '桌面',
    bgSprite: 'bg_table',
    ambientSfxKey: 'sfx_room_ambience',
    items: ['towel', 'bottle', 'plate', 'cup'],
    defaultTimeLimit: 90,
  },
  bedroom: {
    id: 'bedroom',
    name: 'bedroom',
    displayName: '卧室',
    bgSprite: 'bg_bedroom',
    ambientSfxKey: 'sfx_room_ambience',
    items: BEDROOM_ITEMS,
    defaultTimeLimit: 120,
  },
  living_room: {
    id: 'living_room',
    name: 'living_room',
    displayName: '客厅',
    bgSprite: 'bg_living_room',
    ambientSfxKey: 'sfx_room_ambience',
    items: LIVING_ROOM_ITEMS,
    defaultTimeLimit: 150,
  },
} as const;

export const AUDIO_CONFIG: AudioConfig = {
  bgm: {
    bgm_tutorial: {
      path: 'audio/bgm_tutorial',
      loop: true,
      volume: 0.6,
    },
    bgm_tutorial_boss: {
      path: 'audio/bgm_tutorial_boss',
      loop: true,
      volume: 0.65,
    },
  },
  sfx: {
    sfx_item_pickup: {
      path: 'audio/sfx_item_pickup',
      volume: 0.9,
    },
    sfx_item_place: {
      path: 'audio/sfx_item_place',
      volume: 1,
    },
    sfx_item_wrong: {
      path: 'audio/sfx_item_wrong',
      volume: 0.85,
    },
    sfx_item_bounce: {
      path: 'audio/sfx_item_bounce',
      volume: 0.8,
    },
    sfx_merge_success: {
      path: 'audio/sfx_merge',
      volume: 1,
    },
    sfx_tool_upgrade: {
      path: 'audio/sfx_tool_upgrade',
      volume: 1,
    },
    sfx_room_ambience: {
      path: 'audio/sfx_room_ambience',
      volume: 0.4,
    },
    sfx_kitchen_ambience: {
      path: 'audio/sfx_kitchen_ambience',
      volume: 0.45,
    },
  },
};

export const CHAPTER_CONFIG: ChapterConfig[] = [
  {
    id: 1,
    name: 'chapter_1_tutorial',
    displayName: '第一章：整理入门',
    levelRange: [1, 5],
    bossLevels: [5],
    rewardChapter: 1,
    unlockRequirement: 0,
  },
];

export const LEVELS: LevelDataConfig[] = [];

export type GameEventKey = typeof GAME_EVENTS[keyof typeof GAME_EVENTS];
