type Listener = () => void;

export interface AppConfig {
  region: string;
  requests: number;
}

/**
 * A module-scoped instance. Importing this file anywhere gets the same object, because
 * module evaluation is cached — that caching *is* the singleton, with no class and no
 * `getInstance()` in sight.
 *
 * Two hazards come free with it:
 *
 *   1. On a server, one module instance is shared by every request and every user. State
 *      put here leaks between them. That is a data-protection bug, not a slow page.
 *   2. In tests, the instance survives between cases, so one test's writes become the
 *      next test's starting state and failures depend on file order.
 *
 * Both are fixed the same way: create the instance per request or per test and pass it
 * down, which is exactly what dependency injection through context is for.
 */
let config: AppConfig = { region: "eu-west", requests: 0 };
const listeners = new Set<Listener>();

export const appConfig = {
  get: () => config,

  setRegion(region: string) {
    config = { ...config, region };
    for (const listener of listeners) listener();
  },

  recordRequest() {
    config = { ...config, requests: config.requests + 1 };
    for (const listener of listeners) listener();
  },

  reset() {
    config = { region: "eu-west", requests: 0 };
    for (const listener of listeners) listener();
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
