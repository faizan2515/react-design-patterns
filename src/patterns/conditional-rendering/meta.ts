import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Conditional Rendering",
  category: "rendering",
  tier: 1,
  blurb:
    "Choosing what to show — and avoiding the stray zero that `&&` puts on screen.",
  problem:
    "`cond && <View />` reads like an if statement but is not one: it evaluates to the left operand when that operand is falsy. React skips `false`, `null` and `undefined`, but renders `0` and `NaN`, so a length check leaks a literal zero into the page. Beyond that one trap, the question is which shape to use — `&&`, ternary, early return, or a lookup — and the answer depends on how many branches there are.",
  whenToUse: [
    "Guarding a single optional element — `&&` with an explicit boolean on the left.",
    "Two mutually exclusive branches — a ternary, or an early return if the component does nothing else.",
    "Three or more states — a lookup keyed by the state, which TypeScript can check for exhaustiveness.",
  ],
  whenNotToUse: [
    "Do not use `&&` with a number or a possibly-`NaN` value on the left. Coerce it: `count > 0 &&`.",
    "Do not nest ternaries past two branches — the flat lookup is the same logic and readable.",
    "Do not conditionally render to hide something you need to keep alive; unmounting throws away its state.",
  ],
  related: ["keys-and-lists", "error-boundaries"],
  docs: [
    {
      label: "react.dev — Conditional rendering",
      href: "https://react.dev/learn/conditional-rendering",
    },
  ],
};

export default meta;
