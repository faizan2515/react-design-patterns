import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Anti-pattern: Mutating State",
  category: "anti-patterns",
  tier: 1,
  blurb:
    "Changing an object in place and setting it back — React compares by reference, sees no change, and renders nothing.",
  problem:
    "React decides whether to re-render by comparing the new state to the old with `Object.is`. Mutating an array or object and passing the same reference back means that comparison finds them identical, so nothing re-renders even though the data changed. The update is not lost — it is invisible, and it appears later when something unrelated triggers a render, which is what makes these bugs so hard to reproduce.",
  whenToUse: [
    "Always replace rather than mutate: `map`, `filter`, spread, or a library like Immer.",
    "Use the updater form — `setState(current => …)` — so you build from the latest value rather than a captured one.",
    "For deeply nested state, reach for Immer or restructure the state to be flatter.",
  ],
  whenNotToUse: [
    "Never mutate state that React owns, including nested objects and arrays inside it.",
    "Refs are the exception — they are for values React deliberately does not track.",
    "Mutating a local object you just created inside a function is fine; it only matters once React holds the reference.",
  ],
  related: ["derived-state", "use-reducer", "keys-and-lists"],
  docs: [
    {
      label: "react.dev — Updating objects in state",
      href: "https://react.dev/learn/updating-objects-in-state",
    },
    {
      label: "react.dev — Updating arrays in state",
      href: "https://react.dev/learn/updating-arrays-in-state",
    },
  ],
};

export default meta;
