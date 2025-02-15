import type { PLAYER_ACTIVATION_STATE, PLAYER_ANIMATION_STATE, PLAYER_ACTION_STATE } from "./constants";
import type GamePlayer from "./gameEntities/GamePlayer.svelte";

export type LocationType = 'key' | 'chest' | 'drain' | 'skull' | 'exclamation' | 'start';
export type Vector2D = { x: number; y: number };
export type GameTimeRange = 'none' | '0-5' | '6-10' | '11-20' | '20+';
export type GameRating = "none" | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
export interface FirebaseItem { uses: number | null };
export interface FirebaseEffect { duration: number | null };

export interface IEffect {
  id: string;
  name: string;
  description: string;
  isNegative: boolean;
  onApply?: (owner: GamePlayer) => void;
  onRemove?: (owner: GamePlayer) => void;
}

export interface FirebaseLocation {
  id: string;
  type: LocationType;
  position: Vector2D;
  possibleMoves: string[];
  ownerId: string | null;
  trap: {
    id: string;
    ownerId: string;
  } | null;
}

export interface FirebaseTreasure {
  keysRequired: number;
  position: Vector2D;
}

export interface FirebasePlayerStats {
  id: string;
  finishedTurns: number;
  completedGames: string[];
  droppedGames: string[];
}

export interface IGame {
  name: string;
  status: 'active' | 'completed' | 'dropped' | 'rerolled';
  review?: string;
  rating?: GameRating;
  ingameTime?: GameTimeRange;
}

export interface FirebasePlayer {
  id: string;
  name: string;
  avatar: string | null;
  color: string;
  currentLocationId: string;
  keys: number;
  keysModifier: number;
  trophies: number;
  lastTurnKeys: number;
  game: IGame | null;
  turn: number;
  streamUrl: string | null;
  actionState: PLAYER_ACTION_STATE;
  activationState: PLAYER_ACTIVATION_STATE;
  animationState: PLAYER_ANIMATION_STATE;
  items: {
    [key: string]: FirebaseItem | null;
  } | null;
  effects: {
    [key: string]: FirebaseEffect | null
  } | null;
  isUsedItem: boolean;
  canLoseKeys: boolean;
  isInvulnerable: boolean;
  isStunned: boolean;
  isOnline: boolean;
}

export interface PlayersStatsCollection {
  [key: string]: FirebasePlayerStats;
}

export interface PlayersCollection {
  [key: string]: FirebasePlayer;
}

export interface LocationsCollection {
  [key: string]: FirebaseLocation;
}

export interface BaseFirebaseLog {
  playerId: string;
  timestamp: number;
}

export interface GameLog extends BaseFirebaseLog {
  type: 'game';
  data: IGame;
}

export interface ItemLog extends BaseFirebaseLog {
  type: 'item';
  data: {
    itemId: string;
    itemAction: 'used' | 'received' | 'trapped';
    itemTargetType: 'player' | 'location';
    itemTargetIds?: string[];
  };
}

export interface KeyLog extends BaseFirebaseLog {
  type: 'key';
  data: {
    keyAmount: number;
    keyAction: 'lost' | 'gained' | 'transfered';
  };
}

export interface TrophyLog extends BaseFirebaseLog {
  type: 'trophy';
  data: {
    trophyAmount: number;
  }
}

export type FirebaseLog = GameLog | ItemLog | KeyLog | TrophyLog;

export interface LogsCollection {
  [key: string]: {
    [key: string]: FirebaseLog;
  }
}

export interface ISteamAppsCollection {
  appList: {
    apps: ISteamApp[];
  }
}
export interface ISteamApp {
  appId: number;
  name: string;
}