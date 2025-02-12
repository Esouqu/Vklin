import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as THREE from "three";
import type { Vector2D } from "./interfaces";
import { gltfLoader } from "./constants";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export const ARROW_OBJECT: THREE.Group<THREE.Object3DEventMap> = new THREE.Group();
export const POINTS_OBJECT: THREE.Group<THREE.Object3DEventMap> = new THREE.Group();

export function getLocationColor(cellType: string) {
  switch (cellType) {
    case 'drain': {
      return '#ff0000';
    }
    case 'exclamation': {
      return '#ffff00';
    }
    case 'chest': {
      return '#00ff00';
    }
    case 'key': {
      return '#0000ff';
    }
    case 'skull': {
      return '#000000';
    }
    case 'start': {
      return '#fff';
    }
    default: {
      return '#fff';
    }
  }
}

export function loadAudio(audioFile: string) {
  const audio = new Audio(audioFile);

  audio.load();

  return new Audio(audioFile);
}

export async function playSound(sound: HTMLAudioElement, volume: number = 0.1, loop = false) {
  sound.volume = volume;
  sound.pause();
  sound.currentTime = 0;
  sound.loop = loop;
  sound.play();
}

export function randomWithinRange(max: number): number {
  return Math.round(Math.random() * max * 2 - max);
}

export function randomFromArray<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function arrayFromRange(min: number, max: number): number[] {
  const result = [];

  for (let i = min; i <= max; i++) {
    result.push(i);
  }

  return result;
}

export function getNoun(num: number, words: string[]) {
  const lastTwoDigits = Math.abs(num) % 100;
  const lastDigit = lastTwoDigits % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${num} ${words[2]}`;
  } else if (lastDigit === 1) {
    return `${num} ${words[0]}`;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${num} ${words[1]}`;
  } else {
    return `${num} ${words[2]}`;
  }
}

export function getGroupCenter(group: THREE.Group) {
  const center = new THREE.Vector3();
  const children = group.children;
  const count = children.length;

  for (let i = 0; i < count; i++) {
    center.add(children[i].position);
  }
  center.divideScalar(count);

  return center;
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isSamePosition(a: Vector2D, b: Vector2D) {
  return a.x === b.x && a.y === b.y
}

export function subtractVectors(a: Vector2D, b: Vector2D) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  }
}

export async function loadGLB(glb: string) {
  return new Promise<GLTF>((resolve) => {
    gltfLoader.load(glb, async (gltf) => {
      resolve(gltf);
    });
  });
}

export function createDiceMesh(sides: number, meshColor = '#000') {
  const geometry = getDiceGeometry(sides);
  const color = new THREE.Color(meshColor);
  const material = new THREE.MeshPhongMaterial({ color })
  const mesh = new THREE.Mesh(geometry, material);

  return new THREE.Group().add(mesh);
}

export function getDiceGeometry(sides: number) {
  switch (sides) {
    case 4: {
      return new THREE.TetrahedronGeometry();
    }
    case 6: {
      return new THREE.BoxGeometry();
    }
    case 8: {
      return new THREE.OctahedronGeometry();
    }
    case 12: {
      return new THREE.DodecahedronGeometry();
    }
    case 20: {
      return new THREE.IcosahedronGeometry();
    }
  }
}

export function getLocalTime(timestamp: number) {
  return new Date(timestamp).toLocaleString('ru-RU', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function remToPixel(rem: number) {
  return rem * parseFloat(getComputedStyle(document.body).fontSize);
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
