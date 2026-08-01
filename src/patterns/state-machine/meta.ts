import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Finite State Machine",
  category: "state",
  tier: 3,
  blurb:
    "Name the states and the transitions between them, so illegal states cannot be reached rather than merely guarded against.",
  problem:
    "A flow modelled with booleans — `isLoading`, `isError`, `isConfirmed` — describes eight combinations, and most of them are nonsense. Every render then has to defend against states like 'submitting and confirmed at once', and every bug fix adds another guard. A machine inverts this: enumerate the real states, list which events each accepts, and everything unlisted becomes impossible by construction. Double submits and back-during-request stop being bugs to fix and become transitions that do not exist.",
  whenToUse: [
    "Multi-step flows: checkout, onboarding, upload, authentication.",
    "Anything with an in-flight state where the wrong action must be impossible, not just discouraged.",
    "When you catch yourself adding a boolean to prevent a combination of other booleans.",
  ],
  whenNotToUse: [
    "Two states. `useState<boolean>` is a state machine already, and a smaller one.",
    "State that is really data — a list, a form's field values. Machines model control flow, not content.",
    "Where a library is the honest answer: real machines want guards, entry and exit actions, and nested states, which is when XState earns its weight.",
  ],
  related: ["use-reducer", "derived-state", "fetch-on-render"],
  docs: [
    {
      label: "react.dev — useReducer",
      href: "https://react.dev/reference/react/useReducer",
    },
    {
      label: "Statecharts — the concept this scales into",
      href: "https://statecharts.dev/",
    },
  ],
};

export default meta;
