import type { IEffect } from "$lib/interfaces";

class EffectManager {
  private effects: Map<string, IEffect> = new Map();

  public addEffects(effects: IEffect[]): void {
    for (const effect of effects) {
      this.effects.set(effect.id, effect);
    }
  }

  public getEffect(effectId: string) {
    return this.effects.get(effectId);
  }
}

const effectManager = new EffectManager();

export default effectManager;