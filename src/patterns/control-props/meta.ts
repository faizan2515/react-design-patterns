import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Control Props",
  category: "composition",
  tier: 1,
  blurb:
    "Let a component own its state by default, but hand ownership to the parent when a `value` prop appears.",
  problem:
    "A component that always owns its state is easy to drop in and impossible to steer — the parent cannot clamp it, validate it, sync it with a URL, or reset it. One that never owns its state forces every consumer to write boilerplate for the common case. Control props support both from one implementation, which is exactly how the DOM's own inputs behave.",
  whenToUse: [
    "Most consumers want it to just work, but some need to constrain or derive the value.",
    "The value sometimes needs to live elsewhere — a form library, a URL, a store.",
    "You are building a reusable input-like component for other people to consume.",
  ],
  whenNotToUse: [
    "The value always belongs to the parent. Just take `value` and `onChange` and skip the branch.",
    "The state is purely internal and no caller has any business reading it.",
    "You cannot commit to the discipline: switching a component between controlled and uncontrolled mid-life is a real bug, and supporting both makes it possible.",
  ],
  related: ["state-reducer", "props-getters", "compound-components", "custom-hooks"],
  docs: [
    {
      label: "react.dev — Controlled and uncontrolled components",
      href: "https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components",
    },
    {
      label: "react.dev — You might not need an effect (avoiding state duplication)",
      href: "https://react.dev/learn/you-might-not-need-an-effect",
    },
  ],
};

export default meta;
