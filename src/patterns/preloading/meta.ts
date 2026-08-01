import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Preloading on Intent",
  category: "performance",
  tier: 3,
  blurb:
    "Start fetching a lazy chunk when the user shows intent — a hover, a focus — so it has arrived by the time they click.",
  problem:
    "Code splitting trades a smaller initial bundle for a wait at the moment of use, and that wait lands precisely when the user is paying attention. Intent arrives earlier than action: a hover or a focus precedes a click by a few hundred milliseconds, which is usually enough to fetch the chunk. The requirement is that the preload and the render share one promise — otherwise the render starts its own request and the head start is wasted.",
  whenToUse: [
    "Routes and modals reachable from a link or button the user hovers first.",
    "Heavy editors, charts and maps behind a toggle.",
    "Next-page prefetching in a paginated flow, where the next step is predictable.",
  ],
  whenNotToUse: [
    "On mount. Preloading everything immediately returns the bytes the split was meant to save.",
    "On touch-only devices, where hover does not exist — use touch-start or viewport proximity instead.",
    "For chunks small enough that the request overhead outweighs the download.",
  ],
  related: ["suspense-lazy", "swr-cache", "transitions"],
  docs: [
    {
      label: "react.dev — lazy",
      href: "https://react.dev/reference/react/lazy",
    },
  ],
};

export default meta;
