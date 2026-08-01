type Handler<T> = (payload: T) => void;

/**
 * An event emitter — Observer in its plainest form.
 *
 * Subjects keep a list of handlers and call them on publish. The value is decoupling: the
 * emitter does not know who is listening, and listeners do not know each other.
 *
 * The cost is that the wiring becomes invisible. With props you can trace who receives
 * what by reading the tree; with an emitter you have to search for the event name and hope
 * every subscriber was found. That is the trade every pub/sub system makes, and the reason
 * to prefer props and context until the coupling genuinely hurts.
 */
export function createEmitter<Events extends Record<string, unknown>>() {
  const handlers = new Map<keyof Events, Set<Handler<never>>>();

  return {
    on<K extends keyof Events>(event: K, handler: Handler<Events[K]>) {
      const set = handlers.get(event) ?? new Set();
      set.add(handler as Handler<never>);
      handlers.set(event, set);

      // Returning the unsubscribe function makes cleanup the caller's default, rather
      // than something they have to remember to construct.
      return () => {
        set.delete(handler as Handler<never>);
      };
    },

    emit<K extends keyof Events>(event: K, payload: Events[K]) {
      const set = handlers.get(event);
      if (!set) return 0;
      for (const handler of set) (handler as Handler<Events[K]>)(payload);
      return set.size;
    },

    countFor(event: keyof Events) {
      return handlers.get(event)?.size ?? 0;
    },
  };
}

export const bus = createEmitter<{ notice: string }>();
