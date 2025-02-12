import type { FirebasePlayer } from "$lib/interfaces";
import ThreeEntity from "./ThreeEntity";
import { AnimationClip, LoopOnce, MeshStandardMaterial, Object3D, SpotLight, TextureLoader, type Object3DEventMap } from "three";
import anime from "animejs";
import yugybunyg from '$lib/assets/textures/yugybunyg.png';
import archiedos from '$lib/assets/textures/archiedos.png';
import arrowwoods from '$lib/assets/textures/arrowwoods.png';
import nenormova from '$lib/assets/textures/nenormova.png';
import bradhi from '$lib/assets/textures/bradhi.png';
import citinez from '$lib/assets/textures/citinez.png';
import sgtgrafoyni from '$lib/assets/textures/sgtgrafoyni.png';
import rasenganss904 from '$lib/assets/textures/rasenganss904.png';

interface Props extends FirebasePlayer {
  object3d: Object3D<Object3DEventMap>;
  animations: AnimationClip[];
}
class ThreePlayer extends ThreeEntity {
  private _enabledOpacity = 1;
  private _hiddenOpacity = 0.1;
  constructor({ id, color, object3d, animations, name }: Props) {
    super({ id, object3d, animations });

    this._mesh.name = name;
    this._object3d.scale.set(0.075, 0.075, 0.075);

    this._actions['dice_hit'].setLoop(LoopOnce, 1);

    this.playAnimation('idle');
    this._changeTexture(name);
    // this._changeColor(color);
    this._addLight(color);
    this._setupInteractions();
  }

  private _changeColor(color: string) {
    this._mesh.material = new MeshStandardMaterial({ color });
  }

  private _changeTexture(name: string) {
    const image = this._getImage(name);
    const texture = new TextureLoader().load(image);
    texture.flipY = false;

    this._mesh.material = this._mesh.material.clone();
    this._mesh.material.map = texture;
  }

  private _getImage(name: string) {
    switch (name) {
      case 'Archiedos':
        return archiedos;
      case 'Arrowwoods':
        return arrowwoods;
      case 'nenormova':
        return nenormova;
      case 'citinez':
        return citinez;
      case 'Bradhi':
        return bradhi;
      case 'SgtGrafoyni':
        return sgtgrafoyni;
      case 'yugybunyg':
        return yugybunyg;
      case 'rasenganss904':
        return rasenganss904;
      default:
        return archiedos;
    }
  }

  private _addLight(color?: string) {
    const spotlight = new SpotLight(color, 3, 2);
    spotlight.angle = Math.PI;
    spotlight.penumbra = 0;
    spotlight.position.set(0, 5, 0);
    spotlight.lookAt(this._mesh.position);
    this._object3d.add(spotlight);
  }

  private _setupInteractions() {
    this.onSelect = () => {
      this._mesh.material.emissive.setRGB(1, 1, 1);
    }
    this.onDeselect = () => {
      this._mesh.material.emissive.setRGB(0, 0, 0);
    }
    this.onHidden = () => {
      anime({
        targets: this._mesh.material,
        opacity: this._hiddenOpacity,
        duration: 300,
        easing: 'easeOutSine',
      });
    }
    this.onShowed = () => {
      anime({
        targets: this._mesh.material,
        opacity: this._enabledOpacity,
        duration: 300,
        easing: 'easeOutSine',
      });
    }
  }
}

export default ThreePlayer;
