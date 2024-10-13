import type { Vector2D } from "$lib/interfaces";
import { Color, Group, Mesh, type BufferGeometry, type MeshPhongMaterial } from "three";
import ThreeEntity from "./ThreeEntity";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

function createArrow(arrowGroup: Group) {
  const arrowObjectName = "Arrow_Material001_0";
  const arrowMesh = arrowGroup.getObjectByName(arrowObjectName) as Mesh<BufferGeometry, MeshPhongMaterial>;
  const arrowMeshClone = arrowMesh!.clone();

  arrowMeshClone.scale.setScalar(0.2);
  arrowMeshClone.material = arrowMeshClone.material.clone();
  arrowMeshClone.material.transparent = true;

  return new Group().add(arrowMeshClone);
}

class ThreeArrow extends ThreeEntity {
  private _direction: Vector2D;

  constructor(direction: Vector2D, arrowGLTF: GLTF) {
    super({ id: 'arrow', object3d: createArrow(arrowGLTF.scene) });

    this._mesh.name = 'Arrow';
    this._direction = direction;
    this.mesh.rotation.set(1.5, -Math.atan2(direction.y, direction.x), 0, 'YXZ');
    this.mesh.material.opacity = 0.3;
    this.mesh.material.color = new Color('#777');
  }

  get direction() { return this._direction }
}

export default ThreeArrow;
