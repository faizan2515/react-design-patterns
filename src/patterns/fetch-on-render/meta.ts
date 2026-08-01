import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Fetch on Render",
  category: "data",
  tier: 1,
  blurb:
    "Fetch from an effect when inputs change — and cancel the responses you no longer want.",
  problem:
    "Starting a request in an effect is easy. Finishing it correctly is where the bugs live: requests fired in one order can return in another, so a slow response for an old query overwrites a fast response for the current one. The component ends up displaying data that does not match its own state, and it only reproduces on connections slower than the developer's.",
  whenToUse: [
    "Data depends on props or state that change over time — a search box, a selected row, a route param.",
    "You want a small, dependency-free approach and are willing to own cancellation yourself.",
    "The request should follow the component's lifecycle and stop when it unmounts.",
  ],
  whenNotToUse: [
    "Several components need the same data — you will reinvent caching and dedup badly. Reach for a query library or a shared store.",
    "The fetch can start before render does. An effect guarantees a waterfall; render-as-you-fetch does not.",
    "Data is needed during the initial render of a route — load it at the route level instead.",
  ],
  related: [
    "custom-hooks",
    "error-boundaries",
    "suspense-lazy",
    "container-presentational",
  ],
  docs: [
    {
      label: "react.dev — You might not need an effect",
      href: "https://react.dev/learn/you-might-not-need-an-effect",
    },
    {
      label: "react.dev — Synchronizing with effects (race conditions)",
      href: "https://react.dev/learn/synchronizing-with-effects#fetching-data",
    },
  ],
};

export default meta;
