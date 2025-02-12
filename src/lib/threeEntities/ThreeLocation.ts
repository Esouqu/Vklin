import type { FirebaseLocation } from "$lib/interfaces";
import { POINTS_OBJECT } from "$lib/utils";
import anime from "animejs";
import ThreeEntity from "./ThreeEntity";
import { Group, Mesh, MeshStandardMaterial, SphereGeometry } from "three";
import ThreeArrow from "./ThreeArrow";

function createTrapIndicator() {
  const geometry = new SphereGeometry(0.2, 32, 32);
  const material = new MeshStandardMaterial({ color: 'white' });
  const mesh = new Mesh(geometry, material);

  mesh.visible = false;
  mesh.name = 'Trap Indicator';

  return mesh;
}

function createLocation(location: FirebaseLocation, color?: string) {
  const group = new Group();

  POINTS_OBJECT.children[0].children.forEach((child) => {
    const material = (child.children[0] as Mesh).material as MeshStandardMaterial;

    if (material.name === location.type) {
      const mesh = (child.children[0] as Mesh).clone();
      mesh.rotation.set(-Math.PI / 2, 0, 0);
      mesh.material = material.clone();
      if (color) {
        (mesh.material as MeshStandardMaterial).color.set(color);
      }

      group.add(mesh);
      group.add(createTrapIndicator());
    }
  });

  return group;
}

class ThreeLocation extends ThreeEntity {
  private _data: FirebaseLocation;
  private _arrows: ThreeArrow[] = [];

  constructor(location: FirebaseLocation, ownerColor?: string) {
    super({ id: location.id, object3d: createLocation(location, ownerColor) });

    const { x, y } = location.position;
    this._data = location;

    this.setPosition(x, 0.01, y);
    this._setupInteractions();
  }

  public changeCoreColor(color?: string) {
    if (!color) return;

    this._object3d.traverse((child) => {
      if (child instanceof Mesh && child.name === "hexagon") {
        (child.material as MeshStandardMaterial).color.set(color);
      }
    });
  }

  public hideTrapIndicator() {
    const trapIndicator = this.object3d.getObjectByName('Trap Indicator');

    if (trapIndicator instanceof Mesh) {
      trapIndicator.visible = false;
    }
  }

  public showTrapIndicator() {
    const trapIndicator = this.object3d.getObjectByName('Trap Indicator');

    if (trapIndicator instanceof Mesh) {
      trapIndicator.visible = true;
    }
  }

  public disableArrows() {
    for (const arrow of this._arrows) {
      arrow.disable();
    }
  }

  public enableArrows() {
    for (const arrow of this._arrows) {
      arrow.enable();
    }
  }

  public createArrows() {
    for (const direction of this._data.possibleMoves) {
      const arrow = new ThreeArrow(this._data, direction);

      this.object3d.add(arrow.object3d);
      this._arrows.push(arrow);
    }
  }

  private _setupInteractions() {
    this.onSelect = () => {
      this._object3d.traverse((child) => {
        if (child instanceof Mesh && child.name === "hexagon") {
          anime({
            targets: child.material.emissive,
            r: 1,
            g: 1,
            b: 1,
            duration: 300,
            easing: 'easeOutSine',
          });
        }
      });
    }
    this.onDeselect = () => {
      this._object3d.traverse((child) => {
        if (child instanceof Mesh && child.name === "hexagon") {
          anime({
            targets: child.material.emissive,
            r: 0,
            g: 0,
            b: 0,
            duration: 300,
            easing: 'easeOutSine',
          });
        }
      });
    }
  }

  get arrows() { return this._arrows }
}

export default ThreeLocation;

