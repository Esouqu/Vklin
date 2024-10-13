import { Vector3 } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

class ThreeLabel {
  private _label: CSS2DObject;

  constructor(position?: Vector3) {
    const domElement = document.createElement('div');
    const label = new CSS2DObject(domElement);
    const { x, y, z } = position || new Vector3(0, 15, 0);
    label.position.set(x, y, z);

    this._label = label;
  }

  public show() {
    // this._label.element.animate({ opacity: 1, scale: 1 }, 500);
    this._label.element.style.opacity = '1';
    this._label.element.style.scale = '1';
  }

  public hide() {
    // this._label.element.animate({ opacity: 0, scale: 0 }, { duration: 500, fill: 'forwards' });
    this._label.element.style.opacity = '0';
    this._label.element.style.scale = '0';
  }

  public setText(text: string) {
    this._label.element.textContent = text;
  }

  public get label() {
    return this._label;
  }
}

export default ThreeLabel;
