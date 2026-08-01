import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Context Splitting",
  category: "performance",
  tier: 2,
  blurb:
    "Context has no selectors, so the granularity of your contexts is the granularity of your re-renders.",
  problem:
    "One context holding theme, session and preferences re-renders every consumer whenever any field changes — a component reading only the accent colour wakes up because someone logged in. React offers no way to subscribe to part of a context value, so splitting by concern is the only tuning available. Memoising the value is required regardless; without it a fresh object every render wakes every consumer constantly.",
  whenToUse: [
    "One context is carrying unrelated concerns that change at different rates.",
    "A frequently-changing value sits beside a rarely-changing one in the same provider.",
    "Splitting state from dispatch, where dispatch never changes identity at all.",
  ],
  whenNotToUse: [
    "The fields genuinely change together — splitting adds providers and buys nothing.",
    "The consumers are cheap. Re-rendering three small components costs less than the indirection.",
    "Past three or four splits. That is the signal to use a store with selectors instead of subdividing further.",
  ],
  related: ["provider-context", "context-reducer-store", "store-singleton", "memoization"],
  docs: [
    {
      label: "react.dev — Passing data deeply with context",
      href: "https://react.dev/learn/passing-data-deeply-with-context",
    },
  ],
};

export default meta;
