import type { FirebaseLocation } from "$lib/interfaces";
import { CircleGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";
import ThreePlayer from "./threeEntities/ThreePlayer";
import ThreeLocation from "./threeEntities/ThreeLocation";
import ThreeArrow from "./threeEntities/ThreeArrow";
import ThreeTreasure from "./threeEntities/ThreeTreasure";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import GameLocation from "./gameEntities/GameLocation";
import GamePlayer from "./gameEntities/GamePlayer.svelte";
import { SvelteMap } from 'svelte/reactivity'
import treasureData from "./data/treasureData";
import anime from "animejs";

class GameController {
  private _playersGroup = new Group();
  private _locationsGroup = new Group();
  private _treasureGroup = new Group();
  private _map = new Group();
  private _radius = new Group();

  private _threePlayers = new Map<number, ThreePlayer>();
  private _threeLocations = new Map<number, ThreeLocation>();
  private _threeArrows = new Map<number, ThreeArrow>();
  private _threeTreasure: ThreeTreasure | undefined;

  private _gamePlayers = new SvelteMap<string, GamePlayer>();
  private _gameLocations = new SvelteMap<string, GameLocation>();

  public drawRadius(point: Vector3, radius: number, color: number) {
    const geometry = new CircleGeometry(0, 50); // Start with radius 0 for animation
    const material = new MeshBasicMaterial({ color, opacity: 0.3, transparent: true, depthWrite: false });
    const circle = new Mesh(geometry, material);

    this._radius.add(circle);
    circle.position.set(point.x, point.y + 0.1, point.z);
    circle.rotation.x = -Math.PI / 2;
    circle.name = `item_radius`;

    anime({
      targets: geometry.parameters,
      radius: radius,
      duration: 300,
      easing: 'easeOutQuad',
      update: () => {
        geometry.dispose();
        circle.geometry = new CircleGeometry(geometry.parameters.radius, 50);
      }
    });
  }

  public removeRadius() {
    const circleName = `item_radius`;
    const circle = this._radius.getObjectByName(circleName);
    if (circle) {
      this._radius.remove(circle);
    }
  }

  public isInRange(origin: Vector3, target: Vector3, range: number) {
    if (range === -1) return true;

    const distance = origin.distanceTo(target);

    return Math.round(distance) <= range;
  }

  public addMap(scene: Group) {
    this._map.add(scene);
  }

  public createTreasure(gltfTreasure: GLTF) {
    const threeTreasure = new ThreeTreasure(gltfTreasure.scene, gltfTreasure.animations);
    const { x, y } = treasureData.position;
    threeTreasure.object3d.position.set(x, 0, y);

    this._threeTreasure = threeTreasure;
    this._treasureGroup.add(threeTreasure.object3d);
  }

  public getPlayerByName(playerName: string) {
    return Array.from(this._gamePlayers.values()).find((player) => player.name === playerName);
  }

  public getPlayerById(playerId: string) {
    return this._gamePlayers.get(playerId);
  }

  public getPlayerByMeshId(meshId: number) {
    return this._threePlayers.get(meshId);
  }

  public addPlayer(gamePlayer: GamePlayer) {
    this._gamePlayers.set(gamePlayer.id, gamePlayer);
    this._threePlayers.set(gamePlayer.model.mesh.id, (gamePlayer.model as ThreePlayer));

    this._playersGroup.add((gamePlayer.model as ThreePlayer).object3d);
  }

  public getLocationById(locationIdOrPosition: string): GameLocation | undefined {
    return this._gameLocations.get(locationIdOrPosition);
  }

  public getLocationByMeshId(meshId: number) {
    return this._threeLocations.get(meshId);
  }

  public addLocation(location: FirebaseLocation, ownerColor?: string) {
    const threeLocation = new ThreeLocation(location, ownerColor);
    const gameLocation = new GameLocation(location, threeLocation);

    this._gameLocations.set(location.id, gameLocation);
    this._threeLocations.set(threeLocation.mesh.id, threeLocation);

    this._locationsGroup.add(threeLocation.object3d);
  }

  public getArrowByMeshId(meshId: number) {
    return this._threeArrows.get(meshId);
  }

  public addArrows(gameLocation: GameLocation) {
    (gameLocation.model as ThreeLocation).createArrows();

    for (const arrow of (gameLocation.model as ThreeLocation).arrows) {
      this._threeArrows.set(arrow.mesh.id, arrow);
    }
  }

  get locationsGroup() { return this._locationsGroup }
  get playersGroup() { return this._playersGroup }
  get treasureGroup() { return this._treasureGroup }
  get map() { return this._map }
  get radius() { return this._radius }

  get gamePlayers() { return Array.from(this._gamePlayers.values()) }
  get gameLocations() { return Array.from(this._gameLocations.values()) }

  get threePlayers() { return Array.from(this._threePlayers.values()) }
  get threeLocations() { return Array.from(this._threeLocations.values()) }
  get threeArrows() { return Array.from(this._threeArrows.values()) }
  get threeTreasure() { return this._threeTreasure }
}

const gameController = new GameController();
export default gameController;
