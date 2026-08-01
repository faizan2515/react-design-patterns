import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "External Store",
  category: "state",
  tier: 2,
  blurb:
    "Subscribe React to state that lives outside it, with `useSyncExternalStore` doing the bridging correctly.",
  problem:
    "Plenty of state is not React's: a WebSocket, `localStorage`, a media query, a router, a third-party SDK, or a store you wrote in plain JavaScript. Wiring it up with `useEffect` and `setState` looks fine and is subtly wrong — updates that land between render and effect are missed, and under concurrent rendering two components can read the same store in one paint and disagree. `useSyncExternalStore` is the supported bridge that avoids both.",
  whenToUse: [
    "Browser APIs: `matchMedia`, `navigator.onLine`, `localStorage`, `document.visibilityState`.",
    "Non-React state: a vanilla store, an event emitter, a socket, an SDK singleton.",
    "State that must outlive any particular component, or be shared with non-React code.",
  ],
  whenNotToUse: [
    "State that belongs to a component. `useState` is simpler and colocated.",
    "Server data — this has no caching, staleness or revalidation story.",
    "If you cannot make `getSnapshot` referentially stable. A fresh object per call causes an infinite render loop.",
  ],
  related: ["store-singleton", "context-reducer-store", "custom-hooks"],
  docs: [
    {
      label: "react.dev — useSyncExternalStore",
      href: "https://react.dev/reference/react/useSyncExternalStore",
    },
  ],
};

export default meta;
