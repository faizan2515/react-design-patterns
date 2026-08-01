import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Transitions & Deferred Values",
  category: "performance",
  tier: 2,
  blurb:
    "Mark slow updates as interruptible so typing stays responsive while an expensive view catches up.",
  problem:
    "When a keystroke triggers an expensive re-render, the input waits for it, and typing feels stuck even though nothing is technically slow about the input. Transitions split updates into urgent and non-urgent: the input updates immediately, the heavy view is allowed to lag and be interrupted by the next keystroke. Nothing gets faster — the ordering changes, so urgent work stops queueing behind work that can wait.",
  whenToUse: [
    "Filtering, sorting or charting a large dataset as the user types.",
    "Tab or route switches where the incoming view is heavy and a blank flash would be worse than a brief stale one.",
    "`useDeferredValue` when you only have the value; `useTransition` when you control the update and want a pending flag.",
  ],
  whenNotToUse: [
    "As a substitute for making the work cheaper. Deferring a render that should have been memoised or virtualised only hides it.",
    "On updates users expect to be instant and exact — a checkbox lagging behind its own click is worse than slow.",
    "Around data fetching on its own; a transition does not prevent a waterfall.",
  ],
  related: ["memoization", "debounce-throttle", "virtualization"],
  docs: [
    {
      label: "react.dev — useTransition",
      href: "https://react.dev/reference/react/useTransition",
    },
    {
      label: "react.dev — useDeferredValue",
      href: "https://react.dev/reference/react/useDeferredValue",
    },
  ],
};

export default meta;
