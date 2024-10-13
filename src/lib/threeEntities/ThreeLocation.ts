import { LOCATION_OFFSET } from "$lib/constants";
import type { FirebaseLocation, Vector2D } from "$lib/interfaces";
import { getLocationColor } from "$lib/utils";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import ThreeArrow from "./ThreeArrow";
import ThreeEntity from "./ThreeEntity";
import { CylinderGeometry, Color, Mesh, MeshPhongMaterial, RingGeometry, Group, SphereGeometry } from "three";

function createLocationCore(materialColor: string) {
  const geometry = new CylinderGeometry(0.5, 0.5, 0.1, 8);
  const color = new Color(materialColor);
  const material = new MeshPhongMaterial({ color });
  const mesh = new Mesh(geometry, material);

  mesh.material.transparent = true;
  mesh.name = 'Location Core';

  return mesh;
}

function createLocationOutline(materialColor: string) {
  const outlineGeometry = new RingGeometry(0.5, 0.6, 8);
  const outlineColor = new Color(materialColor);
  const outlineMaterial = new MeshPhongMaterial({ color: outlineColor });
  const outlineMesh = new Mesh(outlineGeometry, outlineMaterial);

  outlineMesh.material.transparent = true;
  outlineMesh.rotation.x = -(Math.PI / 2);
  outlineMesh.name = 'Location Outline';

  return outlineMesh;
}

function createTrapIndicator() {
  const geometry = new SphereGeometry(0.2, 32, 32);
  const material = new MeshPhongMaterial({ color: 'white' });
  const mesh = new Mesh(geometry, material);

  mesh.visible = false;
  mesh.material.transparent = true;
  mesh.name = 'Trap Indicator';

  return mesh;
}

function createLocationMesh(coreColor: string, outlineColor: string) {
  const coreMesh = createLocationCore(coreColor);
  const outlineMesh = createLocationOutline(outlineColor);
  const trapIndicator = createTrapIndicator();

  coreMesh.add(trapIndicator);
  coreMesh.add(outlineMesh);

  return new Group().add(coreMesh);
}

class ThreeLocation extends ThreeEntity {
  private _gltfArrow: GLTF;
  private _arrows: ThreeArrow[] = [];

  constructor(location: FirebaseLocation, gltfArrow: GLTF, ownerColor?: string) {
    super({ id: location.id, object3d: createLocationMesh(ownerColor || '#777777', getLocationColor(location.type)) });

    this._gltfArrow = gltfArrow;

    const { x, y } = location.position;
    this.setPosition(x * LOCATION_OFFSET, 0, y * LOCATION_OFFSET);

    if (location.trap) {
      this.showTrapIndicator();
    }

    this._setupArrows(location.possibleMoves);
  }

  private showTrapIndicator() {
    const trapIndicator = this.object3d.getObjectByName('Trap Indicator');

    if (trapIndicator instanceof Mesh) {
      trapIndicator.visible = true;
    }
  }

  private _setupArrows(possibleMoves: Vector2D[]) {
    for (const direction of possibleMoves) {
      const arrow = new ThreeArrow(direction, this._gltfArrow);

      arrow.setPosition(direction.x * (LOCATION_OFFSET / 2), 0, direction.y * (LOCATION_OFFSET / 2));

      this.object3d.add(arrow.object3d);
      this._arrows.push(arrow);
    }
  }
}

export default ThreeLocation;

