import type { FirebaseLocation } from "$lib/interfaces";
import type ThreeLocation from "$lib/threeEntities/ThreeLocation";
import GameEntity from "./GameEntity";

class GameLocation extends GameEntity {
  private _data: FirebaseLocation;

  constructor(location: FirebaseLocation, model: ThreeLocation) {
    super(location.id, `location-${location.id}`, model);

    this._data = location;
    this._model = model;

    if (this._data.trap) {
      (this.model as ThreeLocation).showTrapIndicator();
    }
  }

  get model() { return this._model }
  get type() { return this._data.type }
  get position() { return this._data.position }
  get ownerId() { return this._data.ownerId }
  get possibleMoves() { return this._data.possibleMoves }
  get trap() { return this._data.trap }
}

export default GameLocation;

