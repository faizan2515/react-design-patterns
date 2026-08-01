import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Context + Reducer Store",
  category: "state",
  tier: 1,
  blurb:
    "A reducer published through context — the smallest real store, with no library and no prop drilling.",
  problem:
    "Once several distant components need the same state and the same transitions, passing props stops scaling and every component in between becomes a courier. A reducer behind a context gives any component direct access to both, which is most of what a state library provides. The detail that decides whether it performs well is splitting state and dispatch into separate contexts: dispatch never changes identity, so components that only write are not woken up every time something is read.",
  whenToUse: [
    "State is genuinely app-wide or feature-wide — a cart, a filter panel, an editor session.",
    "Distant components both read and write the same thing.",
    "You want the ergonomics of a store without adding a dependency.",
  ],
  whenNotToUse: [
    "The state is server data. This is not a cache — it has no revalidation, dedup or staleness story.",
    "Updates are very frequent and consumers are many; every consumer re-renders on every change. A store with selectors subscribes far more precisely.",
    "Only a couple of nearby components need it. Lift the state instead and skip the machinery.",
  ],
  related: ["use-reducer", "provider-context", "derived-state"],
  docs: [
    {
      label: "react.dev — Scaling up with reducer and context",
      href: "https://react.dev/learn/scaling-up-with-reducer-and-context",
    },
  ],
};

export default meta;
