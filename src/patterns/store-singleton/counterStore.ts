import { createStore } from "./createStore";

export interface AppState {
  count: number;
  name: string;
}

/**
 * A module-scoped instance — the singleton half of the pattern. Import it anywhere and you
 * get the same store, with no provider and no tree.
 *
 * The cost is that "anywhere" includes the server. A module singleton on an SSR server is
 * shared between every request and every user, which is a data-leak bug rather than a
 * performance one. Client-only apps like this one are safe; anything server-rendered needs
 * a per-request instance handed down through context.
 */
export const counterStore = createStore<AppState>({ count: 0, name: "Ada" });

export const increment = () =>
  counterStore.setState((state) => ({ count: state.count + 1 }));

export const rename = (name: string) => counterStore.setState({ name });
