import anime from "animejs";
import { ACESFilmicToneMapping, AmbientLight, BackSide, BasicShadowMap, BufferGeometry, Clock, Color, DirectionalLight, Float32BufferAttribute, Group, HemisphereLight, Mesh, MeshPhongMaterial, PerspectiveCamera, Points, PointsMaterial, Raycaster, Scene, ShaderMaterial, SkinnedMesh, SphereGeometry, TextureLoader, Vector2, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import type ThreeEntity from "./ThreeEntity";
import gameController from "$lib/GameController.svelte";
import { dev } from "$app/environment";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import snowflakePng from '$lib/assets/images/snowflake.png';

export type ThreeCanvasMeshType = Mesh | SkinnedMesh;

class ThreeCanvas {
  readonly canvas: HTMLCanvasElement;
  readonly scene = new Scene();
  readonly sceneObjects = new Group();
  readonly sceneHelpers = new Group();
  readonly camera = new PerspectiveCamera(45, 1, 0.1, 2000);
  readonly raycaster = new Raycaster();
  readonly pointer = new Vector2();
  readonly labelRenderer = new CSS2DRenderer();
  readonly clock = new Clock();
  readonly renderer: WebGLRenderer;
  readonly controls: OrbitControls;
  readonly transformControls: TransformControls | undefined;
  private _frameAnimationId = 0;
  private _hoverTarget: ThreeEntity | null = null;
  private _intersectedMesh: ThreeCanvasMeshType | null = null;
  private _introTime = 2000;
  private _snowflakesAmount = 10000;
  private _maxRange = 36;
  private _minRange = this._maxRange / 2;
  private _minHeight = 0;
  private _particles: Points = this._getSnowflakeParticles();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    if (dev) {
      this.transformControls = this._createTransformControls(canvas);
    }
    this.controls = this._createControls(canvas);
    this.labelRenderer = this._createLabelRenderer(canvas);
    this.renderer = this._createRenderer(canvas);

    this._addSkyBox();
    this._addLight();

    this.camera.position.set(50, 1000, 50);
    this.scene.add(this.camera);
    this.scene.add(this.sceneObjects);
    this.scene.add(this.sceneHelpers);
    this.scene.add(this._particles);

    this.scene.background = new Color('#0e1415');
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
    const intersects = this.raycaster.intersectObjects(this.sceneObjects.children);

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

    for (const player of gameController.threePlayers) {
      player.mixer.update(delta);
    }

    this._updateParticles();
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

    anime({
      targets: this.camera.position,
      x: 60,
      y: 60,
      z: 100,
      duration: this._introTime,
      easing: 'easeOutSine',
      complete: () => {
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.maxDistance = 125;
      },
    });
  }

  private _updateParticles() {
    const count = this._snowflakesAmount * 3;
    const positions = this._particles.geometry.attributes.position.array;
    const velocities = this._particles.geometry.attributes.velocity.array;

    for (let i = 0; i < count; i += 3) {
      positions[i] -= velocities[i];
      positions[i + 1] -= velocities[i + 1];
      positions[i + 2] -= velocities[i + 2];

      if (positions[i + 1] < 0) {
        const phi = Math.random() * Math.PI;
        const theta = Math.random() * Math.PI * 2;
        const radius = Math.random() * (this._maxRange - this._minRange) + this._minRange;
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi) + this._minHeight;
      }
    }

    this._particles.geometry.attributes.position.needsUpdate = true;
  }

  private _getSnowflakeParticles() {
    const geometry = new BufferGeometry();
    const textureLoader = new TextureLoader();
    const positions = new Float32Array(this._snowflakesAmount * 3);
    const velocities = new Float32Array(this._snowflakesAmount * 3);

    for (let i = 0; i < this._snowflakesAmount; i++) {
      const phi = Math.random() * Math.PI;
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * (this._maxRange - this._minRange) + this._minRange;

      const idx = i * 3;
      positions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      positions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[idx + 2] = radius * Math.cos(phi) + this._minHeight;

      velocities[idx] = (Math.random() - 0.5) * 0.1;
      velocities[idx + 1] = (Math.random() * 0.05 + 0.025);
      velocities[idx + 2] = (Math.random() - 0.5) * 0.1;
    }

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new Float32BufferAttribute(velocities, 3));


    const flakeMaterial = new PointsMaterial({
      size: 0.15,
      map: textureLoader.load(snowflakePng),
      depthTest: false,
      transparent: true,
      opacity: 0.4,
    });

    const points = new Points(geometry, flakeMaterial);
    points.position.set(40, 0, 28);
    return points;
  }

  private _addLight() {
    const directionalLight = new DirectionalLight('#09245d', 1);
    const hemisphereLight = new HemisphereLight('#09245d', '#ffffff', 1);
    // const directionalLight = new DirectionalLight('#f19b66', 1);
    // const hemisphereLight = new HemisphereLight('#f19b66', '#ffffff', 1);
    const ambientLight = new AmbientLight('white', 0.5);

    // const dlHelper = new DirectionalLightHelper(directionalLight, 10);
    // const hsHelper = new HemisphereLightHelper(hemisphereLight, 10);

    directionalLight.lookAt(38, 1, 30);
    directionalLight.position.set(40, 48, -1);
    directionalLight.rotation.set(-3.1, -1.6, -2.4);
    directionalLight.castShadow = true;

    // this.scene.add(dlHelper);
    this.scene.add(directionalLight);

    hemisphereLight.position.set(40, 34, 32);
    // this.scene.add(hsHelper);
    this.scene.add(hemisphereLight);
    this.scene.add(ambientLight);

    // this._addLightGUI(hemisphereLight);
  }

  private _addLightGUI(light: DirectionalLight | HemisphereLight) {
    const gui = new GUI();
    const params = {
      posX: light.position.x,
      posY: light.position.y,
      posZ: light.position.z,
      rotationX: light.rotation.x,
      rotationY: light.rotation.y,
      rotationZ: light.rotation.z,
      intensity: light.intensity,
    }

    gui.add(params, 'posX', -100, 100, 1).onChange(function () {
      light.position.x = params.posX;
    });
    gui.add(params, 'posY', -100, 100, 1).onChange(function () {
      light.position.y = params.posY;
    });
    gui.add(params, 'posZ', -100, 100, 1).onChange(function () {
      light.position.z = params.posZ;
    });
    gui.add(params, 'rotationX', -Math.PI, Math.PI, 0.1).onChange(function () {
      light.rotation.x = params.rotationX;
    });
    gui.add(params, 'rotationY', -Math.PI, Math.PI, 0.1).onChange(function () {
      light.rotation.y = params.rotationY;
    });
    gui.add(params, 'rotationZ', -Math.PI, Math.PI, 0.1).onChange(function () {
      light.rotation.z = params.rotationZ;
    });
    gui.add(params, 'intensity', -10, 10, 0.1).onChange(function () {
      light.intensity = params.intensity;
    });
  }

  private _addSkyBox() {
    // const sky = new Sky();
    // sky.scale.setScalar(10000);
    // this.scene.add(sky);

    // const skyUniforms = sky.material.uniforms;
    // skyUniforms['turbidity'].value = 10;
    // skyUniforms['rayleigh'].value = 2.5;
    // skyUniforms['mieCoefficient'].value = 0.0013;
    // skyUniforms['mieDirectionalG'].value = 0.8;
    // const elevation = 0.1;
    // const azimuth = 180;

    // const pmremGenerator = new PMREMGenerator(this.renderer);
    // const sceneEnv = new Scene();
    // const sun = new Vector3();
    // const phi = MathUtils.degToRad(90 - elevation);
    // const theta = MathUtils.degToRad(azimuth);

    // sun.setFromSphericalCoords(10, phi, theta);
    // sky.material.uniforms['sunPosition'].value.copy(sun);

    // sceneEnv.add(sky);
    // this.scene.add(sky);
    // this.scene.environment = pmremGenerator.fromScene(sceneEnv).texture;

    // Starfield shader material
    const vertexShader = `
      varying vec3 vPos;

      void main() {
        vPos = position;
        vec4 mvPosition = modelViewMatrix * vec4( vPos, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

      float cnoise(vec3 P){
        vec3 Pi0 = floor(P); // Integer part for indexing
        vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
        Pi0 = mod(Pi0, 289.0);
        Pi1 = mod(Pi1, 289.0);
        vec3 Pf0 = fract(P); // Fractional part for interpolation
        vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;

        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);

        vec4 gx0 = ixy0 / 7.0;
        vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);

        vec4 gx1 = ixy1 / 7.0;
        vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);

        vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
        vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
        vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
        vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
        vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
        vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
        vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
        vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x;
        g010 *= norm0.y;
        g100 *= norm0.z;
        g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x;
        g011 *= norm1.y;
        g101 *= norm1.z;
        g111 *= norm1.w;

        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);

        vec3 fade_xyz = fade(Pf0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
        return 2.2 * n_xyz;
      }

      varying vec3 vPos;
      uniform float skyRadius;
      uniform vec3 noiseOffset;

      uniform vec3 env_c1;
      uniform vec3 env_c2;

      uniform float clusterSize;
      uniform float clusterStrength;

      uniform float starSize;
      uniform float starDensity;

      void main() {
        float freq = 1.1/skyRadius;
        float noise = cnoise(vPos * freq);
        vec4 backgroundColor = vec4(mix(env_c1, env_c2, noise), 1.0);

        float scaledClusterSize = (1.0/clusterSize)/skyRadius;
        float scaledStarSize = (1.0/starSize)/skyRadius;

        float cs = pow(abs(cnoise(scaledClusterSize*vPos+noiseOffset)),1.0/clusterStrength) + cnoise(scaledStarSize*vPos);

        float c =clamp(pow(abs(cs), 1.0/starDensity),0.0,1.0);
        vec4 starColor = 0.5*vec4(c, c, c, 1.0);

        gl_FragColor = backgroundColor;
        gl_FragColor += starColor;
      }
    `;

    // Create skybox sphere
    const geometry = new SphereGeometry(1000, 32, 32);
    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        skyRadius: { value: 1000 },
        env_c1: { value: new Color("#0d1a2f") },
        env_c2: { value: new Color("#0f8682") },
        noiseOffset: { value: new Vector3(100.01, 100.01, 100.01) },
        starSize: { value: 0.01 },
        starDensity: { value: 0.09 },
        clusterStrength: { value: 0.01 },
        clusterSize: { value: 0.01 },
      },
      side: BackSide
    });

    const skybox = new Mesh(geometry, material);

    skybox.position.set(40, 0, 28);
    this.scene.add(skybox);
  }

  private _createTransformControls(canvas: HTMLCanvasElement) {
    const transformControls = new TransformControls(this.camera, canvas);
    transformControls.showY = false;
    transformControls.size = 0.5;

    transformControls.addEventListener('dragging-changed', (event) => {
      this.controls.enabled = !event.value;
    });

    this.sceneHelpers.add(transformControls.getHelper());
    return transformControls;
  }

  private _createControls(canvas: HTMLCanvasElement) {
    const orbitControls = new OrbitControls(this.camera, canvas);
    orbitControls.enablePan = false;
    orbitControls.screenSpacePanning = false;
    orbitControls.enableZoom = false;
    orbitControls.zoomToCursor = true;
    orbitControls.maxPolarAngle = Math.PI / 2;

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
    const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(canvas.width, canvas.height);
    renderer.render(this.scene, this.camera);
    // renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = BasicShadowMap;
    renderer.toneMapping = ACESFilmicToneMapping;

    return renderer;
  }

  get intersectedMesh() { return this._intersectedMesh }
}

export default ThreeCanvas;