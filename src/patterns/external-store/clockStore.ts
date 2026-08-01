type Listener = () => void;

/**
 * A plain JavaScript store. No React anywhere in this file — it would work identically in
 * a Vue app, a test, or a script tag.
 *
 * The contract `useSyncExternalStore` needs is only three things: subscribe to changes,
 * read the current value, and return the *same* value when nothing has changed. That last
 * requirement is the one that bites — returning a fresh object from `getSnapshot` every
 * call makes React think the store changed on every render and loop forever.
 */
function createClockStore() {
  let ticks = 0;
  let running = false;
  let timer: ReturnType<typeof setInterval> | undefined;

  const listeners = new Set<Listener>();

  /* Cached so repeated reads are referentially equal until something actually changes. */
  let snapshot = { ticks, running };

  function emit() {
    snapshot = { ticks, running };
    for (const listener of listeners) listener();
  }

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    getSnapshot() {
      return snapshot;
    },

    start() {
      if (running) return;
      running = true;
      timer = setInterval(() => {
        ticks += 1;
        emit();
      }, 1000);
      emit();
    },

    stop() {
      if (!running) return;
      running = false;
      clearInterval(timer);
      emit();
    },

    reset() {
      ticks = 0;
      emit();
    },

    /** For the demo: how many React components are currently subscribed. */
    listenerCount() {
      return listeners.size;
    },
  };
}

export const clockStore = createClockStore();
