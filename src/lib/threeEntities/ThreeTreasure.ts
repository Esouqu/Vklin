import { AnimationClip, LoopOnce, Object3D } from "three";
import ThreeEntity from "./ThreeEntity";

class ThreeTreasure extends ThreeEntity {
  // private _hiddenOpacity = 0.1;
  // private _visibleOpacity = 1;

  constructor(object3d: Object3D, animations: AnimationClip[]) {
    super({ id: 'treasure', object3d, animations });

    this._object3d.scale.set(0.5, 0.5, 0.5);
    this._actions['take'].setLoop(LoopOnce, 1);
  }

  public show() {
    this._object3d.scale.set(0.5, 0.5, 0.5);
  }

  public hide() {
    this._object3d.scale.set(0, 0, 0);
  }
}

export default ThreeTreasure;
