import { AnimationClip, LoopOnce, Object3D } from "three";
import ThreeEntity from "./ThreeEntity";

class ThreeTreasure extends ThreeEntity {

  constructor(object3d: Object3D, animations: AnimationClip[]) {
    super({ id: 'treasure', object3d, animations });

    this._object3d.scale.set(0.5, 0.5, 0.5);
    this._actions['take'].setLoop(LoopOnce, 1);
  }
}

export default ThreeTreasure;
