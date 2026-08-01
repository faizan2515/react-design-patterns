import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Custom Hooks",
  category: "composition",
  tier: 1,
  blurb:
    "Move stateful logic out of a component and behind a small API — the modern replacement for HOCs and render props.",
  problem:
    "State, effects and their cleanup accumulate inside a component until the markup is buried and none of it can be reused. A custom hook is the seam: it is an ordinary function that calls hooks, so the logic moves out while staying subject to the same rules. Crucially it shares logic and never state — each call site gets its own, which is the part people most often get wrong.",
  whenToUse: [
    "The same stateful behaviour is needed in more than one component.",
    "A component mixes unrelated concerns and you want them separable and testable.",
    "Effects need cleanup, and you would rather callers could not forget it.",
  ],
  whenNotToUse: [
    "The logic is pure and calls no hooks — that is a plain function, and it does not need to be one.",
    "You want components to share the same state. A hook gives each caller its own; you need lifted state, context, or a store.",
    "Extracting would produce a hook with one caller and no clearer boundary than the code it replaced.",
  ],
  related: [
    "higher-order-component",
    "render-props",
    "props-getters",
    "container-presentational",
  ],
  docs: [
    {
      label: "react.dev — Reusing logic with custom hooks",
      href: "https://react.dev/learn/reusing-logic-with-custom-hooks",
    },
  ],
};

export default meta;
