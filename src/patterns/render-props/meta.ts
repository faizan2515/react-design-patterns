import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Render Props",
  category: "composition",
  tier: 2,
  blurb:
    "A component owns the behaviour and passes its result to a function, letting the caller decide what to draw.",
  problem:
    "Two components need the same behaviour but must look completely different. An HOC injects props and hides where they came from; a render prop makes the hand-off explicit — the component computes, the caller renders, and the data flow is visible at the call site. Most uses of this have since become hooks, but not all: a hook cannot render, so anything that must own the element the behaviour attaches to still needs this shape.",
  whenToUse: [
    "The provider must render something itself — a measured box, a scroll window, a drag layer.",
    "One behaviour needs several unrelated presentations and you want the wiring visible.",
    "You are exposing an API to consumers you do not control and want them free to render anything.",
  ],
  whenNotToUse: [
    "The behaviour is pure logic with nothing to render — a custom hook is simpler and composes better.",
    "Nesting several would produce a staircase of callbacks; hooks flatten that entirely.",
    "The caller only ever renders one thing. Then it is indirection with no payoff.",
  ],
  related: ["higher-order-component", "custom-hooks", "compound-components"],
  docs: [
    {
      label: "react.dev — Passing JSX as children",
      href: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children",
    },
  ],
};

export default meta;
