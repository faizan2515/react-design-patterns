type Listener = () => void;

export interface Entry<T> {
  data: T | undefined;
  updatedAt: number;
  /** The in-flight request, if any. Storing it is what makes dedup possible. */
  inFlight: Promise<T> | undefined;
}

export interface CacheStats {
  hits: number;
  misses: number;
  deduped: number;
  revalidations: number;
}

/**
 * A cache with the three behaviours every data library is really selling.
 *
 * 1. Dedup — two components asking for the same key at the same moment share one request,
 *    because the promise is stored, not just the result.
 * 2. Stale-while-revalidate — a cached value is returned immediately even when past its
 *    freshness window, and a refresh runs behind it, so the screen never blanks to show
 *    you something it already had.
 * 3. Invalidation — a way to say "this is wrong now" without reloading the page.
 *
 * Note the split between reading and fetching. `getEntry` and `getStats` are pure reads
 * safe to call during render; `ensure` starts work and notifies subscribers, so it belongs
 * in an effect. Collapsing the two — reading in a way that also triggers a notification —
 * makes a `useSyncExternalStore` snapshot notify the store that produced it, and the app
 * renders in a loop until it locks up.
 */
export function createCache(staleAfter = 4000) {
  const entries = new Map<string, Entry<unknown>>();
  const listeners = new Set<Listener>();

  /* Replaced rather than mutated, so React can see it changed by reference. */
  let stats: CacheStats = { hits: 0, misses: 0, deduped: 0, revalidations: 0 };

  function emit() {
    for (const listener of listeners) listener();
  }

  function getEntry<T>(key: string): Entry<T> | undefined {
    return entries.get(key) as Entry<T> | undefined;
  }

  function fetchInto<T>(key: string, loader: () => Promise<T>): Promise<T> {
    const existing = getEntry<T>(key);

    const request = loader()
      .then((data) => {
        entries.set(key, { data, updatedAt: Date.now(), inFlight: undefined });
        emit();
        return data;
      })
      .catch((error: unknown) => {
        // Keep whatever was cached — a failed refresh should not blank the screen.
        const current = getEntry<T>(key);
        entries.set(key, {
          data: current?.data,
          updatedAt: current?.updatedAt ?? 0,
          inFlight: undefined,
        });
        emit();
        throw error;
      });

    entries.set(key, {
      data: existing?.data,
      updatedAt: existing?.updatedAt ?? 0,
      inFlight: request as Promise<unknown>,
    });
    emit();

    return request;
  }

  return {
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /** Pure. Safe to call from a `getSnapshot`. */
    getEntry,

    /** Pure. */
    getStats: () => stats,

    /**
     * Impure: may start a request and always notifies. Call from an effect, never
     * from render.
     */
    ensure<T>(key: string, loader: () => Promise<T>) {
      const entry = getEntry<T>(key);
      const hasData = entry?.data !== undefined;

      if (hasData) {
        const fresh = Date.now() - entry.updatedAt < staleAfter;
        stats = { ...stats, hits: stats.hits + 1 };

        if (!fresh && !entry.inFlight) {
          stats = { ...stats, revalidations: stats.revalidations + 1 };
          void fetchInto(key, loader).catch(() => {});
          return;
        }

        emit();
        return;
      }

      // No data yet, but someone is already asking for it — join that request.
      if (entry?.inFlight) {
        stats = { ...stats, deduped: stats.deduped + 1 };
        emit();
        return;
      }

      stats = { ...stats, misses: stats.misses + 1 };
      void fetchInto(key, loader).catch(() => {});
    },

    invalidate(key: string) {
      const entry = entries.get(key);
      if (entry) entries.set(key, { ...entry, updatedAt: 0 });
      emit();
    },

    clear() {
      entries.clear();
      stats = { hits: 0, misses: 0, deduped: 0, revalidations: 0 };
      emit();
    },
  };
}

export const peopleCache = createCache();
