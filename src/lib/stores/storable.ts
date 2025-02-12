import { browser } from "$app/environment";
import { writable } from "svelte/store";

function storable<T>(initialValue: T, key: string) {
  if (browser) initialValue = JSON.parse(localStorage.getItem(key) ?? JSON.stringify(initialValue));

  const store = writable<T>(initialValue);
  const { subscribe, set: _set } = store;

  return {
    subscribe,
    set(newValue: T) {
      localStorage.setItem(key, JSON.stringify(newValue));
      _set(newValue);
    },
  }
}

export default storable;