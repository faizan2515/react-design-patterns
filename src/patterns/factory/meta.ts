import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Factory",
  category: "classic",
  tier: 3,
  blurb:
    "A function that builds hooks or components with configuration baked in — `createStore`, `createContext`, `createRouter`.",
  problem:
    "Several hooks or components differ only by configuration, so writing each by hand duplicates their bodies. A factory closes over the differences and returns the finished thing. In class languages the pattern exists to hide which subclass you get; in JavaScript functions already return whatever they like, so it appears instead as configuration capture — which is why so much of the React ecosystem's API surface is a `create*` function.",
  whenToUse: [
    "Several hooks or components that vary only by settings.",
    "Building a typed API around a generic primitive — a store, a context, a client.",
    "Library code, where consumers configure once and use many times.",
  ],
  whenNotToUse: [
    "One instance. A factory called once is a longer way to write the thing.",
    "During render — a component factory called in render produces a new component type each time and remounts the subtree, losing its state.",
    "Where props would do. Configuration that can vary per use belongs in props, not in a closure.",
  ],
  related: ["custom-hooks", "higher-order-component", "store-singleton"],
  docs: [
    {
      label: "react.dev — Reusing logic with custom hooks",
      href: "https://react.dev/learn/reusing-logic-with-custom-hooks",
    },
  ],
};

export default meta;
