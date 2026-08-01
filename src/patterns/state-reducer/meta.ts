import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "State Reducer",
  category: "composition",
  tier: 3,
  blurb:
    "Let the consumer supply a reducer that overrides the component's own state transitions.",
  problem:
    "A reusable component accumulates policy props — `maxToggles`, `disableOff`, `lockAfterSubmit` — one per requirement its author did not foresee. The state reducer pattern inverts that: the component ships its default reducer and accepts a replacement, so callers express arbitrary rules by intercepting the transitions they care about and delegating the rest. Control props hand over the value; this hands over the rules.",
  whenToUse: [
    "A widely used component keeps growing one-off behaviour flags.",
    "Consumers need to veto, clamp or rewrite transitions you cannot anticipate.",
    "You maintain a component library and want extension without a release for every policy.",
  ],
  whenNotToUse: [
    "Application components with one call site — just write the rule inline.",
    "You are unwilling to treat action names as public API; overrides switch on them, so renaming becomes a breaking change.",
    "A single boolean prop would genuinely cover it. This is a large amount of ceremony for one flag.",
  ],
  related: ["control-props", "use-reducer", "props-getters"],
  docs: [
    {
      label: "react.dev — Extracting state logic into a reducer",
      href: "https://react.dev/learn/extracting-state-logic-into-a-reducer",
    },
  ],
};

export default meta;
