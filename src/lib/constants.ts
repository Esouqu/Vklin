import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Color from "color";
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

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

export const gltfLoader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
export const fbxLoader = new FBXLoader();
export const START_LOCATION_ID = '8-9';
export const INITIAL_PLAYER = {
  id: '',
  keys: 5,
  lastTurnKeys: 5,
  trophies: 0,
  keysModifier: 1,
  currentLocationId: START_LOCATION_ID,
  canLoseKeys: true,
  isInvulnerable: false,
  isUsedItem: false,
  isStunned: false,
  isOnline: true,
  game: null,
  turn: 1,
  effects: {},
  items: {},
  actionState: PLAYER_ACTION_STATE.IDLE,
  activationState: PLAYER_ACTIVATION_STATE.NONE,
  animationState: PLAYER_ANIMATION_STATE.IDLE,
  name: '',
  avatar: '',
  color: '',
  streamUrl: '',
};

export enum ENTITY_STATE {
  NONE,
  HOVERED,
  SELECTED,
  DISABLED,
  HIDDEN,
  SHOWED,
  ENABLED,
}

export const playerColors: Color[] = [
  Color('#ef4444'), // red
  Color('#f97316'), // orange
  Color('#f59e0b'), // amber
  Color('#eab308'), // yellow
  Color('#84cc16'), // lime
  Color('#22c55e'), // green
  Color('#10b981'), // emerald
  Color('#14b8a6'), // teal
  Color('#06b6d4'), // cyan
  Color('#0ea5e9'), // sky
  Color('#3b82f6'), // blue
  Color('#6366f1'), // indigo
  Color('#8b5cf6'), // violet
  Color('#a855f7'), // purple
  Color('#d946ef'), // fuchsia
  Color('#ec4899'), // pink
];

export const FIREBASE_COLLECTIONS = {
  PLAYERS: '/players',
  LOCATIONS: '/locations',
  TREASURE: '/treasure',
  LOGS: '/logs',
  CONFIG: '/config',
}

export const consoleStyles = {
  bold: 'font-weight: bold; text-transform: uppercase; color: black;',
  join: ' background-color: springgreen;',
  left: 'background-color: crimson;',
  online: 'background-color: royalblue;',
}