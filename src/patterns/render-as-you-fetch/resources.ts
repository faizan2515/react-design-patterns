import { PEOPLE } from "../../lab/data";
import type { Person } from "../../lab/data";
import { fakeRequest } from "../../lab/fakeApi";

/**
 * Promises for `use()` must be cached.
 *
 * `use()` reads a promise and suspends until it settles. Creating the promise during
 * render would make a new one on every attempt, so the component would suspend forever —
 * each retry starting a fresh request that the next render throws away. The cache gives
 * the same key the same promise, which is what lets React resume.
 *
 * Nothing here is React-specific. This is the minimum a data library does for you, and
 * the reason you usually want one.
 */
const cache = new Map<string, Promise<unknown>>();

function resource<T>(key: string, load: () => Promise<T>): Promise<T> {
  const existing = cache.get(key);
  if (existing) return existing as Promise<T>;

  const created = load();
  cache.set(key, created);
  return created;
}

/** Bumped by the demo's Reload button to invalidate everything. */
let generation = 0;

export function reload() {
  generation += 1;
  cache.clear();
}

export function fetchProfile(latency: number): Promise<Person> {
  return resource(`profile:${generation}:${latency}`, () =>
    fakeRequest(PEOPLE[0], { latency }),
  );
}

export function fetchTeammates(latency: number): Promise<Person[]> {
  return resource(`teammates:${generation}:${latency}`, () =>
    fakeRequest(PEOPLE.slice(1, 5), { latency }),
  );
}
