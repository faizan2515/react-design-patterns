import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Proxy",
  category: "classic",
  tier: 3,
  blurb:
    "Intercept property writes so mutable-looking state can still notify React — roughly how Valtio and MobX work.",
  problem:
    "React tracks change by reference, so `state.count++` is invisible to it and every update has to produce a new object. A `Proxy` intercepts the write itself, letting mutation carry the notification that an immutable update would have made explicit. The ergonomics are genuinely nicer for deeply nested state; the trade is that you leave the model the rest of React is built around.",
  whenToUse: [
    "Deeply nested state where spreading every level is noisy and error-prone.",
    "Wrapping a mutable third-party object so React can observe it.",
    "Access logging, validation on write, or debugging where a field is changed.",
  ],
  whenNotToUse: [
    "Ordinary component state. `useState` with immutable updates is what everything else in React expects.",
    "Where you rely on referential equality — `memo`, dependency arrays and `Object.is` all lose their signal when nothing changes identity.",
    "Without accounting for depth: the trap catches writes on the wrapped object only, so nested objects need wrapping too.",
  ],
  related: ["store-singleton", "external-store", "memoization"],
  docs: [
    {
      label: "MDN — Proxy",
      href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy",
    },
  ],
};

export default meta;
