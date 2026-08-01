import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Mediator",
  category: "classic",
  tier: 3,
  blurb:
    "Siblings coordinate through one component that owns the rules, instead of holding references to each other.",
  problem:
    "When a filter, a list and a summary must agree, wiring them directly needs a reference per relationship and scatters the rules across all three. A mediator owns the shared state and the rules about how changes interact, so each component reports upward and reads downward. React's ordinary parent-owns-state flow already is this pattern — naming it is what stops people reaching for an event bus the first time two siblings need to agree on something.",
  whenToUse: [
    "Several sibling components whose interactions have rules that belong to none of them.",
    "Coordinated behaviour: clearing a selection when a filter hides it, resetting a step when an earlier one changes.",
    "Anywhere you are tempted to give one sibling a ref to another.",
  ],
  whenNotToUse: [
    "Two components that do not actually interact — lifting their state together couples them for nothing.",
    "Once the mediator has grown into a component that does everything. That is the signal to move to a reducer or a store.",
    "For genuinely unrelated broadcast across the app, where an external store is a better fit.",
  ],
  related: ["state-colocation", "context-reducer-store", "use-reducer"],
  docs: [
    {
      label: "react.dev — Sharing state between components",
      href: "https://react.dev/learn/sharing-state-between-components",
    },
  ],
};

export default meta;
