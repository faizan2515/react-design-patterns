import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Reducer",
  category: "state",
  tier: 1,
  blurb:
    "Move state transitions into one pure function, so every update is described as an action instead of scattered across handlers.",
  problem:
    "As a component grows, related pieces of state get updated from a dozen handlers, and the rules connecting them — decrementing to zero removes the line, clearing resets the coupon — are duplicated wherever someone remembered them. A reducer collects those rules in one pure function outside the component. It is testable without React, and because it is pure, replaying the same actions from the same start always yields the same state.",
  whenToUse: [
    "Several pieces of state change together, or one update's rules depend on other state.",
    "The same transition is triggered from multiple places and must stay consistent.",
    "You want an audit trail, undo, or optimistic updates — all of which need actions as data.",
  ],
  whenNotToUse: [
    "One or two independent values. `useState` is shorter and reads better.",
    "The reducer would be a switch of `setX` cases with no rules of its own — that is indirection, not structure.",
    "State that belongs on the server. A reducer manages local transitions; it is not a cache.",
  ],
  related: ["context-reducer-store", "derived-state", "state-colocation"],
  docs: [
    {
      label: "react.dev — Extracting state logic into a reducer",
      href: "https://react.dev/learn/extracting-state-logic-into-a-reducer",
    },
    {
      label: "react.dev — useReducer",
      href: "https://react.dev/reference/react/useReducer",
    },
  ],
};

export default meta;
