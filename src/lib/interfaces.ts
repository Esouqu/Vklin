import type { PLAYER_ACTION_STATE, PLAYER_ACTIVATION_STATE, PLAYER_ANIMATION_STATE } from "./constants";

export type LocationType = 'key' | 'chest' | 'drain' | 'skull' | 'exclamation' | 'start';
export type Vector2D = { x: number; y: number };

export interface IEffect {
  id: string;
  name: string;
  description: string;
  isNegative: boolean;
}

export interface FirebaseLocation {
  id: string;
  type: LocationType;
  position: Vector2D;
  possibleMoves: Vector2D[];
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

export interface FirebasePlayer {
  id: string;
  name: string;
  avatar: string | null;
  color: string;
  keys: number;
  keysModifier: number;
  trophies: number;
  lastTurnKeys: number;
  position: Vector2D;
  gameTitle: string | null;
  actionState: PLAYER_ACTION_STATE;
  activationState: PLAYER_ACTIVATION_STATE;
  animationState: PLAYER_ANIMATION_STATE;
  items: { [key: string]: { uses: number } } | null;
  effects: { [key: string]: { duration: number } } | null;
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

export interface FirebaseLog {
  username: string;
  type: 'game' | 'other';
  message: string;
  timestamp: number;
}

export interface LogsCollection {
  [key: string]: {
    [key: string]: FirebaseLog;
  }
}