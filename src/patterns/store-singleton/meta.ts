import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Store Singleton",
  category: "state",
  tier: 3,
  blurb:
    "A module-scoped store with selector subscriptions — roughly what Zustand is, in about thirty lines.",
  problem:
    "Context delivers a value to a subtree and re-renders every consumer when it changes, which is correct but blunt: a component reading one field wakes up for changes to all the others. A store keeps state outside the tree and lets each component subscribe to a slice, so updates reach only the components whose selected value actually changed. Being a module singleton also means no provider — and, on a server, means one store shared by every request.",
  whenToUse: [
    "Frequently-updating state read by many components in different parts of the tree.",
    "You want to read or write state from outside React — an event handler in vanilla code, a socket, a test.",
    "Context is causing measurable re-render churn and splitting it further is getting silly.",
  ],
  whenNotToUse: [
    "Server-rendered apps, unless the store is created per request. A module singleton is shared across users and will leak data between them.",
    "Server data. Use a query cache; this has no revalidation or dedup.",
    "Small or local state — a singleton makes it global forever, including in tests, which then need resetting between runs.",
  ],
  related: ["external-store", "context-reducer-store", "use-reducer"],
  docs: [
    {
      label: "react.dev — useSyncExternalStore",
      href: "https://react.dev/reference/react/useSyncExternalStore",
    },
  ],
};

export default meta;
