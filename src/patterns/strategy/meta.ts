import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Strategy",
  category: "classic",
  tier: 2,
  blurb:
    "Interchangeable algorithms behind one signature — which in JavaScript is just passing a function in.",
  problem:
    "A component that branches on a mode grows a conditional for every new mode, and each addition edits code that already worked. Strategy moves each behaviour behind a shared signature so the caller supplies one and the component simply calls it. In class-based languages this needs an interface and a class per variant; in JavaScript a function is the interface, which is why React is full of this pattern under other names — `comparator`, `renderItem`, `validate`, `formatter`.",
  whenToUse: [
    "Several algorithms serve the same purpose: sorting, formatting, validating, pricing.",
    "Callers need to supply their own variant without you anticipating it.",
    "A `switch` in a component keeps gaining cases.",
  ],
  whenNotToUse: [
    "Two branches that will never grow — an `if` is clearer than an abstraction.",
    "The variants need different inputs. A shared signature that is mostly ignored is not a strategy, it is a lie.",
    "Behaviour that also needs to render — that is a render prop or a component.",
  ],
  related: ["render-props", "state-reducer", "control-props"],
  docs: [
    {
      label: "react.dev — Passing props to a component",
      href: "https://react.dev/learn/passing-props-to-a-component",
    },
  ],
};

export default meta;
