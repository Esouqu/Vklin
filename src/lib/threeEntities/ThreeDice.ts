import { createDiceMesh } from "$lib/utils";
import anime from "animejs";
import { randInt } from "three/src/math/MathUtils.js";
import ThreeEntity from "./ThreeEntity";
import ThreeLabel from "./ThreeLabel";

type ThreeDiceValue = 4 | 6 | 8 | 12 | 20;

export class ThreeDice extends ThreeEntity {
  private _value: ThreeDiceValue;
  private _isRolling = false;
  private _throwAnimationId = 0;
  private _animationDuration = 700;
  private _rollResult = 0;
  private _valueLabel: ThreeLabel;

  constructor(diceValue: ThreeDiceValue, color?: string) {
    super({ id: 'dice', object3d: createDiceMesh(diceValue, color) });

    this._value = diceValue;
    this._valueLabel = this._createValueLabel();

    this._object3d.add(this._valueLabel.label);
    this._valueLabel.hide();
    this.hide();
  }

  public setResult(result: number) {
    this._rollResult = result;
    this._valueLabel.setText(result.toString());
  }

  public subtractRollResult(amount = 1) {
    this._rollResult -= amount;
    this._valueLabel.setText(this._rollResult.toString());
  }

  public hide() {
    this._object3d.scale.setScalar(0);
  }

  public show() {
    this._object3d.scale.setScalar(2);
  }

  public async roll() {
    return new Promise<number>((resolve, reject) => {
      if (this._isRolling) return reject('Already rolling');

      this.show();
      this._valueLabel.hide();
      this._isRolling = true;

      this._throwAnimationId = requestAnimationFrame(this._animateRoll.bind(this));

      setTimeout(() => {
        cancelAnimationFrame(this._throwAnimationId);
        this._isRolling = false;

        const rollResult = randInt(1, this._value);

        anime({
          targets: this._object3d.scale,
          x: 0,
          y: 0,
          z: 0,
          duration: 300,
          easing: 'easeInOutQuad',
          complete: () => {
            this.hide();
            this._rollResult = rollResult;
            this._valueLabel.setText(rollResult.toString());
            this._valueLabel.show();
            resolve(rollResult);
          },
        })
      }, this._animationDuration);
    });
  }

  private _animateRoll() {
    const xRotation = Math.random() * Math.PI * 2;
    const yRotation = Math.random() * Math.PI * 2;
    const zRotation = Math.random() * Math.PI * 2;

    this._mesh.rotation.set(xRotation, yRotation, zRotation);

    if (!this._isRolling) {
      cancelAnimationFrame(this._throwAnimationId);
      return;
    }

    this._throwAnimationId = requestAnimationFrame(this._animateRoll.bind(this));
  }

  private _createValueLabel() {
    const valueLabel = new ThreeLabel();

    valueLabel.setText(this._value.toString());
    valueLabel.label.position.set(0, 5, 0);

    valueLabel.label.element.style.color = 'white';
    valueLabel.label.element.style.fontWeight = '500';
    valueLabel.label.element.style.textShadow = '0 0 4px black';
    valueLabel.label.element.style.fontSize = '24px';

    return valueLabel;
  }

  get rollResult() { return this._rollResult }
  get valueLabel() { return this._valueLabel }
}