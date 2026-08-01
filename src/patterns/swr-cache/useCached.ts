import { useEffect, useRef, useSyncExternalStore } from "react";
import { peopleCache } from "./cache";
import type { Entry } from "./cache";

/**
 * Reads an entry during render and starts the work in an effect — deliberately two steps.
 *
 * `getSnapshot` must be pure. Fetching from inside it means reading the store also
 * notifies the store, which re-renders, which reads again: the app locks up rather than
 * failing loudly, which is what makes it worth calling out.
 *
 * The loader lives in a ref so the effect can depend on the key alone. An inline arrow
 * function in the dependency array would be a new value every render, re-running the
 * effect forever — the second way this hook goes wrong.
 */
export function useCached<T>(
  key: string,
  loader: () => Promise<T>,
): Entry<T> | undefined {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const entry = useSyncExternalStore(
    peopleCache.subscribe,
    () => peopleCache.getEntry<T>(key),
    () => undefined,
  );

  useEffect(() => {
    peopleCache.ensure<T>(key, () => loaderRef.current());
  }, [key]);

  return entry;
}
