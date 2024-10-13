import type { FirebaseLocation } from "$lib/interfaces";
import { Group } from "three";
import ThreePlayer from "./threeEntities/ThreePlayer";
import ThreeLocation from "./threeEntities/ThreeLocation";
import ThreeTreasure from "./threeEntities/ThreeTreasure";
import { LOCATION_OFFSET } from "$lib/constants";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

class MapController {
  private _playersObjects = new Group();
  private _locationsObjects = new Group();
  private _treasureObject = new Group();

  private _threePlayers = new Map<number, ThreePlayer>();
  private _threeLocations = new Map<number, ThreeLocation>();
  private _threeTreasure: ThreeTreasure | undefined;

  constructor() {
    this._playersObjects.name = 'players';
    this._locationsObjects.name = 'locations';
  }

  public createTreasure(gltfTreasure: GLTF) {
    const threeTreasure = new ThreeTreasure(gltfTreasure.scene, gltfTreasure.animations);
    const { x, y, z } = {
      x: 5 * LOCATION_OFFSET,
      y: 0,
      z: 5 * LOCATION_OFFSET,
    }
    threeTreasure.object3d.position.set(x, y, z);

    this._threeTreasure = threeTreasure;
    this._treasureObject.add(threeTreasure.object3d);
  }

  public addPlayer(threePlayer: ThreePlayer) {
    this._threePlayers.set(threePlayer.mesh.id, threePlayer);

    this._playersObjects.add(threePlayer.object3d);
  }

  public addLocation(location: FirebaseLocation, gltfArrow: GLTF, ownerColor?: string,) {
    const threeLocation = new ThreeLocation(location, gltfArrow, ownerColor);

    this._threeLocations.set(threeLocation.mesh.id, threeLocation);
    this._locationsObjects.add(threeLocation.object3d);
  }

  get locationsObjects() { return this._locationsObjects }
  get playersObjects() { return this._playersObjects }
  get treasureObject() { return this._treasureObject }

  get threePlayers() { return Array.from(this._threePlayers.values()) }
  get threeLocations() { return Array.from(this._threeLocations.values()) }
  get treasure() { return this._threeTreasure }
}

const mapController = new MapController();
export default mapController;
