import type { FirebasePlayer, Vector2D } from "$lib/interfaces";
import ThreeEntity from "./ThreeEntity";
import { LOCATION_OFFSET, PLAYER_ANIMATION_STATE } from "$lib/constants";
import { AnimationClip, LoopOnce, MeshStandardMaterial, Object3D, type Object3DEventMap } from "three";
import ThreeLabel from "./ThreeLabel";

interface Props extends FirebasePlayer {
  object3d: Object3D<Object3DEventMap>;
  animations: AnimationClip[];
  direction: Vector2D;
}

class ThreePlayer extends ThreeEntity {
  private _usernameLabel = new ThreeLabel();
  private _baseZ = 0.05;

  constructor({ id, position, color, object3d, animations, name, direction }: Props) {
    super({ id, object3d, animations });

    const { x, y, z } = {
      x: position.x * LOCATION_OFFSET,
      y: this._baseZ,
      z: position.y * LOCATION_OFFSET,
    }

    this._mesh.name = name;
    this._object3d.position.set(x, y, z);
    this._object3d.scale.set(0.1, 0.1, 0.1);

    this._actions['dice_hit'].setDuration(2).setLoop(LoopOnce, 1);

    this.playAnimation('idle');
    this._changeColor(color);

    // setTimeout(() => {
    this.setDirection(direction.x, direction.y);
    // }, 300);

    this._setUsernameLabel(name);
  }

  public handleAnimationState(state: PLAYER_ANIMATION_STATE) {
    switch (state) {
      case PLAYER_ANIMATION_STATE.IDLE: {
        this.playAnimation('idle');
        break;
      }
      case PLAYER_ANIMATION_STATE.DICE_HIT: {
        this.playAnimation('dice_hit');
        break;
      }
      case PLAYER_ANIMATION_STATE.RUN: {
        this.playAnimation('run');
        break;
      }
    }
  }

  private _changeColor(color: string) {
    this._mesh.material = new MeshStandardMaterial({ color });
    this._mesh.material.transparent = true;
  }

  private _setUsernameLabel(name: string) {
    this._usernameLabel.setText(name);
    this._usernameLabel.label.element.style.color = 'white';
    this._usernameLabel.label.element.style.fontWeight = '400';
    this.object3d.add(this._usernameLabel.label);
  }
}

export default ThreePlayer;
