import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Optimistic UI",
  category: "state",
  tier: 2,
  blurb:
    "Show the expected result immediately and let React discard it if the server disagrees — with `useOptimistic`, no rollback code required.",
  problem:
    "Waiting for a round trip before showing a like, a rename or a reorder makes an app feel slow even when it is fast. Applying the change immediately fixes that but raises the hard question: what happens when the request fails? Hand-rolled optimism answers it with a compensating update, which has to be correct for every interleaving of concurrent requests and usually is not. `useOptimistic` scopes the guess to the transition that made it, so failure means the value is never committed rather than undone.",
  whenToUse: [
    "High-frequency, low-stakes actions: likes, toggles, reordering, marking read.",
    "Actions that almost always succeed and are cheap to be wrong about.",
    "Anywhere a spinner on a button would be more disruptive than a rare correction.",
  ],
  whenNotToUse: [
    "Consequential or irreversible actions — payments, deletions, publishing. Show real progress instead.",
    "Where the server's result is genuinely unpredictable, so your guess would usually be wrong.",
    "Outside a transition. `useOptimistic` needs a pending scope to attach to, or the value vanishes at once.",
  ],
  related: ["actions-forms", "undo-redo", "fetch-on-render"],
  docs: [
    {
      label: "react.dev — useOptimistic",
      href: "https://react.dev/reference/react/useOptimistic",
    },
    {
      label: "react.dev — useTransition",
      href: "https://react.dev/reference/react/useTransition",
    },
  ],
};

export default meta;
