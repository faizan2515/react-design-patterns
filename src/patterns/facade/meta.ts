import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Facade",
  category: "classic",
  tier: 3,
  blurb:
    "One small interface in front of several collaborating parts — which in React is usually a well-named custom hook.",
  problem:
    "A screen that wires up four subsystems itself carries all four: their state, their failure modes, and the order they have to run in. A facade exposes only what a caller needs and keeps the coordination behind it. Not because the internals are secret, but because a caller that can see them becomes responsible for keeping them correct.",
  whenToUse: [
    "Several subsystems must be used together in a particular order.",
    "A common flow can be reduced to a couple of values and one function.",
    "You want the freedom to restructure the internals without touching call sites.",
  ],
  whenNotToUse: [
    "One subsystem with a decent API already — a pass-through facade adds a file and a name.",
    "Callers legitimately need fine control. A facade that everyone reaches past is worse than none.",
    "When the return type is hard to name. That usually means the boundary is wrong, not that the name is hard.",
  ],
  related: ["custom-hooks", "repository", "container-presentational"],
  docs: [
    {
      label: "react.dev — Reusing logic with custom hooks",
      href: "https://react.dev/learn/reusing-logic-with-custom-hooks",
    },
  ],
};

export default meta;
