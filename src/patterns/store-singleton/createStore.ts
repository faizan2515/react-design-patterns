import { useSyncExternalStore } from "react";

type Listener = () => void;

export interface Store<T> {
  getState: () => T;
  setState: (update: Partial<T> | ((current: T) => Partial<T>)) => void;
  subscribe: (listener: Listener) => () => void;
}

/**
 * A store in about thirty lines. This is, in outline, what Zustand is.
 *
 * The value over context is precision. A context re-renders every consumer when its value
 * changes; a store lets each component subscribe to a *slice*, so a component reading
 * `count` is untouched when `name` changes. That is the whole reason store libraries exist
 * alongside context rather than instead of it.
 */
export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<Listener>();

  return {
    getState: () => state,

    setState(update) {
      const patch = typeof update === "function" ? update(state) : update;
      state = { ...state, ...patch };
      for (const listener of listeners) listener();
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/**
 * Subscribe to one slice.
 *
 * `useSyncExternalStore` re-renders only when the selected value changes by `Object.is`,
 * so selecting a primitive gives precise subscriptions for free. Select an object or an
 * array and you are back to re-rendering on every change, because a fresh object is never
 * `Object.is`-equal to the last one — the single most common way people accidentally
 * defeat this.
 */
export function useStore<T, S>(store: Store<T>, selector: (state: T) => S): S {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
}
