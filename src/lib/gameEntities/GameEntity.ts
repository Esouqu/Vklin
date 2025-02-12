import type ThreeEntity from "$lib/threeEntities/ThreeEntity";

class GameEntity {
  protected _id: string;
  protected _name: string;
  protected _model: ThreeEntity;

  constructor(id: string, name: string, model: ThreeEntity) {
    this._id = id;
    this._name = name;
    this._model = model;
  }

  get id() { return this._id }
  get name() { return this._name }
  get model() { return this._model }
}

export default GameEntity;

