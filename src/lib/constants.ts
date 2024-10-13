import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const gltfLoader = new GLTFLoader();
export const LOCATION_OFFSET = 3;

export enum PLAYER_ACTION_STATE {
  IDLE = 'idle',
  MOVING = 'moving',
  STUNNED = 'stunned',
  ACTIVATING = 'activating',
  USING_ITEM = 'using_item',
}

export enum PLAYER_ACTIVATION_STATE {
  NONE = 'none',
  STARTING = 'starting',
  AUCTION = 'auction',
  PLAYING = 'playing',
  TAKING_REWARD = 'taking_reward',
}

export enum PLAYER_ANIMATION_STATE {
  IDLE = 'idle',
  RUN = 'run',
  DICE_HIT = 'dice_hit',
}

export enum ENTITY_STATE {
  NONE,
  HOVERED,
  SELECTED,
  DISABLED,
  HIDDEN,
  SHOWED,
  ENABLED,
}

export const playerColors = [
  '#f44336', // red
  '#4caf50', // green
  '#2196f3', // blue
  '#e91e63', // pink
  '#009688', // teal
  '#9c27b0', // purple
]