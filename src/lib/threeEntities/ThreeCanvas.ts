import anime from "animejs";
import { AmbientLight, BufferGeometry, Clock, Color, DirectionalLight, Mesh, MeshPhongMaterial, MOUSE, PerspectiveCamera, Raycaster, Scene, SkinnedMesh, Vector2, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import type ThreeEntity from "./ThreeEntity";
import mapController from "$lib/MapController.svelte";

export type ThreeCanvasMeshType = Mesh | SkinnedMesh;

class ThreeCanvas {
  readonly canvas: HTMLCanvasElement;
  readonly scene = new Scene();
  readonly camera = new PerspectiveCamera(45, 1, 0.1, 1000);;
  readonly mainLight = new DirectionalLight('white', 2);
  readonly ambientLight = new AmbientLight('white', 0.5);
  readonly raycaster = new Raycaster();
  readonly pointer = new Vector2();
  readonly labelRenderer = new CSS2DRenderer();
  readonly clock = new Clock();
  readonly renderer: WebGLRenderer;
  readonly controls: OrbitControls;
  private _frameAnimationId = 0;
  private _hoverTarget: ThreeEntity | null = null;
  private _intersectedMesh: ThreeCanvasMeshType | null = null;
  private _introTime = 1000;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.scene.add(this.ambientLight);
    this.scene.add(this.camera);
    this.scene.add(this.mainLight);
    this.mainLight.position.z = 15;
    this.camera.add(this.mainLight);

    this.scene.background = new Color('#101510');

    this.controls = this._createControls(canvas);
    this.labelRenderer = this._createLabelRenderer(canvas);
    this.renderer = this._createRenderer(canvas);
  }

  public removeHover() {
    if (!this._hoverTarget) {
      this.canvas.style.cursor = 'default';
      return;
    };

    this._hoverTarget.onPointerLeave?.();

    this._hoverTarget = null;
    this.canvas.style.cursor = 'default';
  }

  public hover(target: ThreeEntity) {
    if (this._hoverTarget) this.removeHover();

    this._hoverTarget = target;
    this.canvas.style.cursor = 'pointer';

    target.onPointerEnter?.();
  }

  public setIntersectedMesh() {
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      const closestObject = intersects.sort((a, b) => a.distance - b.distance)[0].object;
      const currentTarget = closestObject as Mesh<BufferGeometry, MeshPhongMaterial>;

      this._intersectedMesh = currentTarget;
    } else {
      this._intersectedMesh = null;
    }
  }

  public dispose() {
    this.renderer.dispose();
    this.controls.dispose();
    this.scene.clear();
    cancelAnimationFrame(this._frameAnimationId);
  }

  public setPointer(event: MouseEvent) {
    this.pointer.x = (event.clientX / this.canvas.width) * 2 - 1;
    this.pointer.y = -(event.clientY / this.canvas.height) * 2 + 1;
  }

  public renderFrame() {
    const delta = this.clock.getDelta();

    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.setIntersectedMesh();

    for (const player of mapController.threePlayers) {
      player.mixer.update(delta);
    }

    this.controls.update();
    this.labelRenderer.render(this.scene, this.camera);
    this.renderer.render(this.scene, this.camera);
    this._frameAnimationId = requestAnimationFrame(this.renderFrame.bind(this));
  }

  public onResize(width: number, height: number, aspectRatio: number) {
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();

    this.labelRenderer.setSize(width, height);
    this.labelRenderer.render(this.scene, this.camera);

    this.renderer.setSize(width, height);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  public runIntro(lookAt: Vector3) {
    this.controls.target = lookAt;
    this.camera.position.set(300, 500, 700);

    anime({
      targets: this.camera.position,
      x: 20,
      y: 30,
      z: 50,
      duration: this._introTime,
      easing: 'easeOutQuint',
    });
  }

  private _createControls(canvas: HTMLCanvasElement) {
    const orbitControls = new OrbitControls(this.camera, canvas);
    orbitControls.enablePan = false;
    orbitControls.screenSpacePanning = false;
    orbitControls.enableZoom = false;
    orbitControls.zoomToCursor = true;
    orbitControls.maxPolarAngle = Math.PI / 2;
    orbitControls.mouseButtons = {
      RIGHT: MOUSE.ROTATE,
      MIDDLE: MOUSE.PAN
    };

    setTimeout(() => {
      orbitControls.enablePan = true;
      orbitControls.enableZoom = true;
    }, this._introTime);

    return orbitControls;
  }

  private _createLabelRenderer(canvas: HTMLCanvasElement) {
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.userSelect = 'none';
    labelRenderer.domElement.style.pointerEvents = 'none';
    canvas.parentElement?.appendChild(labelRenderer.domElement);

    return labelRenderer;
  }

  private _createRenderer(canvas: HTMLCanvasElement) {
    const rendererInstance = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    rendererInstance.setClearColor(0x000000, 0);
    rendererInstance.setSize(canvas.width, canvas.height);
    rendererInstance.render(this.scene, this.camera);

    return rendererInstance;
  }

  get intersectedMesh() { return this._intersectedMesh }
}

export default ThreeCanvas;