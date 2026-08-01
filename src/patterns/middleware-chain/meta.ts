import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Chain of Responsibility",
  category: "classic",
  tier: 3,
  blurb:
    "A pipeline where each link can handle, rewrite, or stop an action — the shape Redux middleware and every HTTP framework use.",
  problem:
    "Logging, validation, authorisation and normalisation all want to sit between an action and its effect, and stuffing them into the handler produces a function that does five unrelated jobs. A chain gives each concern its own link that receives the action and a `next`. Holding `next` is what gives a link real authority: one that never calls it has vetoed the action, and nothing downstream ever runs.",
  whenToUse: [
    "Cross-cutting concerns around a dispatch, a request, or a command.",
    "Rules that need to be independently addable, removable and reorderable.",
    "Anywhere you would otherwise nest four `if` blocks before doing the actual work.",
  ],
  whenNotToUse: [
    "Two checks that will not grow. Inline them and keep the control flow visible.",
    "When order-dependence would be surprising — chains are sequential, and that is easy to forget.",
    "For anything a caller needs to trace easily; a veto deep in a chain is harder to find than an early return.",
  ],
  related: ["use-reducer", "context-reducer-store", "strategy"],
  docs: [
    {
      label: "Redux — middleware (the canonical example of this shape)",
      href: "https://redux.js.org/understanding/history-and-design/middleware",
    },
  ],
};

export default meta;
