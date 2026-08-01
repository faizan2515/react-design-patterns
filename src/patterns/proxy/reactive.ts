type Listener = () => void;

/**
 * A `Proxy` that notifies on write, giving mutable-looking state that React can track.
 *
 * `state.count++` is not something React can normally see. A proxy intercepts the write,
 * so the ergonomics of mutation come with the notification an immutable update would have
 * given you explicitly. This is, in outline, how Valtio and MobX work.
 *
 * The costs are real and worth naming. The proxy traps writes, not deep reads, so nested
 * objects need wrapping too. Equality gets confusing — the proxy is not `===` the target.
 * And because nothing forces a new reference, `memo` and dependency arrays lose their
 * signal, which is why these libraries ship their own subscription primitives rather than
 * relying on React's.
 */
export function reactive<T extends object>(target: T) {
  const listeners = new Set<Listener>();

  /* Bumped on every write so subscribers have a primitive that actually changes. */
  let version = 0;

  const proxy = new Proxy(target, {
    set(object, key, value, receiver) {
      const previous = Reflect.get(object, key, receiver);
      if (Object.is(previous, value)) return true;

      const ok = Reflect.set(object, key, value, receiver);
      version += 1;
      for (const listener of listeners) listener();
      return ok;
    },
  });

  return {
    state: proxy,
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getVersion: () => version,
  };
}
