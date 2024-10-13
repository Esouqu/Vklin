import { ENTITY_STATE } from "$lib/constants";
import { AnimationClip, AnimationMixer, BufferGeometry, Color, MeshStandardMaterial, Mesh, Object3D, SkinnedMesh, type Object3DEventMap, AnimationAction } from "three";

type ThreeMeshType = Mesh<BufferGeometry, MeshStandardMaterial> | SkinnedMesh<BufferGeometry, MeshStandardMaterial>;

interface ThreeEntityProps {
  id: string;
  object3d: Object3D<Object3DEventMap>;
  animations?: AnimationClip[];
}

class ThreeEntity {
  private _id: string;
  private _state = ENTITY_STATE.NONE;
  private _defaultColor = '#777777';
  protected _mesh: ThreeMeshType = new Mesh();
  protected _object3d: Object3D<Object3DEventMap>;
  protected _mixer: AnimationMixer;
  protected _actions: Record<string, AnimationAction>;
  protected _activeAction: AnimationAction;
  public onSelect?: () => void;
  public onDeselect?: () => void;
  public onPointerEnter?: () => void;
  public onPointerLeave?: () => void;
  public onDisabled?: () => void;
  public onEnabled?: () => void;
  public onShowed?: () => void;
  public onHidden?: () => void;

  constructor(props: ThreeEntityProps) {
    this._id = props.id;
    this._object3d = props.object3d;

    this._mesh = this._getMesh(this._object3d, props.id);
    this._mixer = new AnimationMixer(this._object3d);
    this._actions = this._getActions(props.animations || []);
    this._activeAction = this._actions['idle'];
  }

  public setDirection(x: number, y: number) {
    const targetAngle = Math.atan2(x, y);
    const currentAngle = this._object3d.rotation.y;

    // Вычисляем разницу углов
    let angleDiff = targetAngle - currentAngle;

    // Нормализуем разницу в диапазоне [-π, π]
    if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

    // Set the new rotation directly
    this._object3d.rotation.y = targetAngle;
  }

  public playAnimation(name: string) {
    if (this._activeAction) {
      this._activeAction.stop();
    }

    // const prevAction = this._activeAction;
    const nextAction = this._actions[name];

    // Убедитесь, что вес следующей анимации установлен в 1
    nextAction.setEffectiveWeight(1);
    nextAction.time = 0; // Сбросьте время анимации
    nextAction.play();

    this._activeAction = nextAction;
  }

  public updateColor(color?: string) {
    this._mesh.material.color = new Color(color || this._defaultColor);
  }

  public setPosition(x: number, y: number, z: number) {
    this._object3d.position.set(x, y, z);
  }

  public show() {
    this._state = ENTITY_STATE.SHOWED;
    this.onShowed?.();
  }

  public hide() {
    this._state = ENTITY_STATE.HIDDEN;
    this.onHidden?.();
  }

  public enable() {
    this._state = ENTITY_STATE.ENABLED;
    this.onEnabled?.();
  }

  public disable() {
    this._state = ENTITY_STATE.DISABLED;
    this.onDisabled?.();
  }

  public deselect() {
    this._state = ENTITY_STATE.NONE;
    this.onDeselect?.();
  }

  public select() {
    this._state = ENTITY_STATE.SELECTED;
    this.onSelect?.();
  }

  public pointerLeave() {
    this._state = ENTITY_STATE.NONE;
    this.onPointerLeave?.();
  }

  public pointerEnter() {
    this._state = ENTITY_STATE.HOVERED;
    this.onPointerEnter?.();
  }

  private _getActions(animations: AnimationClip[]) {
    return animations.reduce((acc, clip) => {
      acc[clip.name.toLowerCase()] = this._mixer.clipAction(clip);
      return acc;
    }, {} as Record<string, AnimationAction>);
  }

  private _getMesh(object3d: Object3D<Object3DEventMap>, id: string) {
    let mesh: ThreeMeshType = new Mesh();

    object3d.traverse((child) => {
      if (child instanceof Mesh || child instanceof SkinnedMesh) {
        mesh = child;
        mesh.uuid = id;
      }
    });

    return mesh;
  }

  get id() { return this._id }
  get state() { return this._state }
  get mesh() { return this._mesh }
  get object3d() { return this._object3d }
  get mixer() { return this._mixer }
  get animations() { return this._actions }
}

export default ThreeEntity;
