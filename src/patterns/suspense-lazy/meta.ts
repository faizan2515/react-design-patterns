import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Suspense & Lazy Loading",
  category: "rendering",
  tier: 1,
  blurb:
    "Split code out of the initial bundle, and let boundary placement decide what waits together.",
  problem:
    "Everything imported at the top level ships in the first bundle, including routes and panels most visitors never open. `lazy()` turns an import into a chunk fetched on first render, and Suspense gives React somewhere to show a fallback while it arrives. The subtle part is not the splitting but the boundaries: a boundary is the unit of waiting, so one wrapped around several loaders makes all of them appear at the pace of the slowest.",
  whenToUse: [
    "Routes, modals, editors, charts — anything substantial that is not needed on first paint.",
    "Third-party libraries that are large and rarely reached.",
    "Wherever you want a deliberate loading state instead of a blank region.",
  ],
  whenNotToUse: [
    "Small components. A chunk has its own request overhead and can be slower than just including it.",
    "Anything needed immediately on first paint — splitting it only adds a round trip.",
    "Around each item in a list, where many tiny fallbacks read as flicker. Put the boundary around the group.",
  ],
  related: ["error-boundaries", "conditional-rendering", "fetch-on-render"],
  docs: [
    {
      label: "react.dev — lazy",
      href: "https://react.dev/reference/react/lazy",
    },
    {
      label: "react.dev — Suspense",
      href: "https://react.dev/reference/react/Suspense",
    },
  ],
};

export default meta;
