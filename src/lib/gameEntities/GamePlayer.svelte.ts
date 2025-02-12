import { INITIAL_PLAYER, PLAYER_ANIMATION_STATE } from "$lib/constants";
import type { FirebasePlayer } from "$lib/interfaces";
import { ThreeDice } from "$lib/threeEntities/ThreeDice";
import ThreeLabel from "$lib/threeEntities/ThreeLabel";
import type ThreePlayer from "$lib/threeEntities/ThreePlayer";
import GameEntity from "./GameEntity";
import gameController from "$lib/GameController.svelte";
import { Vector3 } from "three";

class GamePlayer extends GameEntity {
  private _data: FirebasePlayer = $state(INITIAL_PLAYER);
  private _usernameLabel = new ThreeLabel(new Vector3(0, 17, 0));
  readonly dice = new ThreeDice(8);

  constructor(player: FirebasePlayer, model: ThreePlayer) {
    super(player.id, player.name, model);

    this._data = player;
    this._model = model;
    this.dice.updateColor(player.color);

    // at this moment locations are not loaded yet, so we need to wait for some time
    setTimeout(() => {
      this._initializePosition();
    }, 300);

    setTimeout(() => {
      this._modifyUsernameLabel();
    }, 1000);

    this._addDice();
  }

  public async updateModelPosition(targetLocationId: string) {
    const targetLocation = gameController.getLocationById(targetLocationId);

    if (!targetLocation) throw new Error('Target Location not found!');

    const otherPlayers = gameController.gamePlayers.filter((player) => player.currentLocationId === targetLocationId && player.id !== this.id);
    const angle = (2 * Math.PI) / (otherPlayers.length + 1);
    const offset = otherPlayers.findIndex((player) => player.id === this.id) * angle;

    const { x, y, z } = {
      x: targetLocation.position.x + (otherPlayers.length > 0 ? Math.cos(offset) * 0.5 : 0),
      y: targetLocation.position.y + (otherPlayers.length > 0 ? Math.sin(offset) * 0.5 : 0),
      z: 0.05
    }

    this.model.object3d.lookAt(targetLocation.model.object3d.position);
    await this._model.move(x, y, z);

    if (this.dice.rollResult < 2) {
      const currentLocation = this.getCurrentLocation();
      const nextLocationId = currentLocation.possibleMoves[0];
      const nextLocation = gameController.getLocationById(nextLocationId);

      if (!nextLocation) throw new Error('Next Location not found!');

      this.model.object3d.lookAt(nextLocation.model.object3d.position);
    }
  }

  public getCurrentLocation() {
    const location = gameController.getLocationById(this._data.currentLocationId);
    if (!location) throw new Error('Location not found');

    return location;
  }

  public handleAnimationState(state: PLAYER_ANIMATION_STATE) {
    switch (state) {
      case PLAYER_ANIMATION_STATE.IDLE: {
        this.model.playAnimation('idle');
        break;
      }
      case PLAYER_ANIMATION_STATE.DICE_HIT: {
        this.model.playAnimation('dice_hit');
        break;
      }
      case PLAYER_ANIMATION_STATE.RUN: {
        this.model.playAnimation('run');
        break;
      }
    }
  }

  private _initializePosition() {
    const currentLocation = this.getCurrentLocation();
    const otherPlayers = gameController.gamePlayers.filter((player) => player.currentLocationId === currentLocation.id);
    const angle = (2 * Math.PI) / (otherPlayers.length);
    const offset = otherPlayers.findIndex((player) => player.id === this.id) * angle;

    const nextLocationId = currentLocation.possibleMoves[0];
    const nextLocation = gameController.getLocationById(nextLocationId);

    if (!nextLocation) throw new Error('Next Location not found!');
    if (!currentLocation) throw new Error('Current Location not found!');

    const { x, y, z } = {
      x: currentLocation.position.x + (otherPlayers.length > 1 ? Math.cos(offset) * 0.5 : 0),
      y: currentLocation.position.y + (otherPlayers.length > 1 ? Math.sin(offset) * 0.5 : 0),
      z: 0.05
    }

    this.model.setPosition(x, z, y);
    this.model.object3d.lookAt(nextLocation.model.object3d.position);
  }

  private _addDice() {
    this.model.object3d.add(this.dice.object3d);
    this.dice.setPosition(0, 20, 0);
  }

  private _modifyUsernameLabel() {
    this._usernameLabel.setText(this._data.name);
    this._usernameLabel.label.element.style.color = 'white';
    // this._usernameLabel.label.element.style.color = this._data.color;
    this._usernameLabel.label.element.style.fontWeight = '500';
    this._usernameLabel.label.element.style.textShadow = '0 0 4px black';
    this.model.object3d.add(this._usernameLabel.label);
  }

  get currentLocationId() { return this._data.currentLocationId }
  get keys() { return this._data.keys }
  get turn() { return this._data.turn }
  get lastTurnKeys() { return this._data.lastTurnKeys }
  get effects() { return this._data.effects }
  get actionState() { return this._data.actionState }
  get activationState() { return this._data.activationState }
  get items() { return this._data.items }
  get keysModifier() { return this._data.keysModifier }
  get game() { return this._data.game }
  get isStunned() { return this._data.isStunned }
  get isOnline() { return this._data.isOnline }
  get avatar() { return this._data.avatar }
  get color() { return this._data.color }
  get name() { return this._data.name }
  get streamUrl() { return this._data.streamUrl }
  get trophies() { return this._data.trophies }
  get canLoseKeys() { return this._data.canLoseKeys }
  get isInvulnerable() { return this._data.isInvulnerable }
  get isUsedItem() { return this._data.isUsedItem }
}

export default GamePlayer;

