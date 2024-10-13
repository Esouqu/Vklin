import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { LocationType, Vector2D } from "./interfaces";
import * as THREE from 'three';
import { gltfLoader } from "./constants";

export function remToPixel(rem: number) {
  return rem * parseFloat(getComputedStyle(document.body).fontSize);
}

export function getLocationColor(cellType: LocationType) {
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

export function isSamePosition(a: Vector2D, b: Vector2D) {
  return a.x === b.x && a.y === b.y
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
    return words[2];
  } else if (lastDigit === 1) {
    return words[0];
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return words[1];
  } else {
    return words[2];
  }
}

export function subtractVectors(a: Vector2D, b: Vector2D) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
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

export async function loadGLB(glb: string) {
  return new Promise<GLTF>((resolve) => {
    gltfLoader.load(glb, async (gltf) => {
      resolve(gltf);
    });
  });
}
