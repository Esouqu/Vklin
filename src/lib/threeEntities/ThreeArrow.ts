import type { FirebaseLocation } from "$lib/interfaces";
import { ARROW_OBJECT } from "$lib/utils";
import { Color, Group, Mesh, Vector3, type BufferGeometry, type MeshPhongMaterial } from "three";
import ThreeEntity from "./ThreeEntity";
import { ENTITY_STATE } from "$lib/constants";
import gameController from "$lib/GameController.svelte";
import type GameLocation from "$lib/gameEntities/GameLocation";

function createArrow() {
  const arrowObjectName = "Arrow_Material001_0";
  const arrowMesh = ARROW_OBJECT.getObjectByName(arrowObjectName) as Mesh<BufferGeometry, MeshPhongMaterial>;
  const arrowMeshClone = arrowMesh!.clone();

  arrowMeshClone.scale.setScalar(0.2);
  arrowMeshClone.material = arrowMeshClone.material.clone();

  return new Group().add(arrowMeshClone);
}

class ThreeArrow extends ThreeEntity {
  private _targetLocation: GameLocation;
  private _disabledColor = new Color('#adadad');
  private _enabledColor = new Color('#00ff00');
  private _disabledOpacity = 0.3;
  private _enabledOpacity = 1;
  private _hiddenOpacity = 0.1;

  constructor(location: FirebaseLocation, targetLocationId: string) {
    super({ id: 'arrow', object3d: createArrow() });

    const targetLocation = gameController.getLocationById(targetLocationId);
    if (!targetLocation) throw new Error('Target location not found');

    const { direction, diff } = this._calculateDirection(location.id, targetLocationId);

    this._targetLocation = targetLocation;

    this._setupMesh(direction, diff);
    this._setupInteractions();
    this.disable();
  }

  private _setupMesh(direction: Vector3, diff: Vector3) {
    this._mesh.name = 'Arrow';

    this.setPosition(diff.x / 2, 0.01, diff.z / 2);
    this.mesh.rotation.set(1.5, -Math.atan2(direction.z, direction.x), 0, 'YXZ');
  }

  private _calculateDirection(originLocationId: string, targetLocationId: string) {
    const originLocation = gameController.getLocationById(originLocationId);
    const targetLocation = gameController.getLocationById(targetLocationId);

    if (!originLocation) throw new Error('Origin location not found');
    if (!targetLocation) throw new Error('Target location not found');

    const { x: targetX, y: targetY } = targetLocation.position;
    const { x: locationX, y: locationY } = originLocation.position;
    const diff = new Vector3(targetX - locationX, 0, targetY - locationY);
    const direction = new Vector3(diff.x, 0, diff.z).normalize();

    return {
      direction,
      diff
    };
  }

  private _setupInteractions() {
    this.onPointerEnter = () => {
      if (this.state === ENTITY_STATE.DISABLED) return;

      this.mesh.material.color = new Color('#ffffff');
    }
    this.onPointerLeave = () => {
      if (this.state === ENTITY_STATE.DISABLED) return;
      this.mesh.material.color = this._enabledColor;
    }
    this.onDisabled = () => {
      this.mesh.material.opacity = this._disabledOpacity;
      this.mesh.material.color = this._disabledColor;
    }
    this.onEnabled = () => {
      this.mesh.material.opacity = this._enabledOpacity;
      this.mesh.material.color = this._enabledColor;
    }
    this.onHidden = () => {
      this.mesh.material.opacity = this._hiddenOpacity;
    }
    this.onShowed = () => {
      this.mesh.material.opacity = this._enabledOpacity;
    }
  }

  get targetLocation() { return this._targetLocation }
}

export default ThreeArrow;
