import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Anti-pattern: Syncing State with an Effect",
  category: "anti-patterns",
  tier: 1,
  blurb:
    "Keeping a second copy of state in step with an effect — twice the renders, and a window where the two disagree.",
  problem:
    "Storing something derivable and refilling it from an effect creates a second source of truth plus machinery to hide that fact. Every update renders twice: once with the stale copy, once after the effect corrects it. Between those renders the UI is showing data that does not match its own inputs, and the moment a dependency is forgotten, that mismatch stops being momentary.",
  whenToUse: [
    "Essentially never for derivable values — compute them during render instead.",
    "An effect is right when you are synchronising with something *outside* React: the DOM, a subscription, a network request.",
    "If the derivation is genuinely expensive, memoise it — but keep it derived rather than stored.",
  ],
  whenNotToUse: [
    "Filtering, sorting, totalling, formatting, validity — all functions of state you already hold.",
    "Copying props into state on mount. That silently ignores later prop changes; use a `key` to reset instead.",
    "Anywhere the fix is 'add the missing dependency'. That is a signal the state should not exist.",
  ],
  related: ["derived-state", "keys-and-lists", "state-colocation"],
  docs: [
    {
      label: "react.dev — You might not need an effect",
      href: "https://react.dev/learn/you-might-not-need-an-effect",
    },
  ],
};

export default meta;
