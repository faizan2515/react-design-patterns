import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Render as You Fetch",
  category: "data",
  tier: 2,
  blurb:
    "Start requests before rendering the components that need them, and read the promises with `use()` under Suspense.",
  problem:
    "Fetching inside the component that displays the data guarantees a waterfall: the second request cannot begin until the first resolves, because the component firing it does not render until its parent stops waiting. Two independent requests then take as long as their sum. Starting both up front and reading them with `use()` makes the total the slower of the two. The catch is that `use()` requires a cached promise — one created during render is replaced on every retry and never settles.",
  whenToUse: [
    "Several independent requests are needed by one screen.",
    "The data to load is known before render — from a route param, a selection, a link hover.",
    "You already have a cache or a data library that returns stable promises.",
  ],
  whenNotToUse: [
    "Without a cache. A promise created in render will suspend forever; this is the number one way `use()` goes wrong.",
    "Requests that genuinely depend on each other — a waterfall is correct when the second needs the first's result.",
    "Where an error path matters and there is no boundary: a rejected promise read by `use()` needs an error boundary to land in.",
  ],
  related: ["fetch-on-render", "swr-cache", "suspense-lazy", "error-boundaries"],
  docs: [
    {
      label: "react.dev — use",
      href: "https://react.dev/reference/react/use",
    },
    {
      label: "react.dev — Suspense",
      href: "https://react.dev/reference/react/Suspense",
    },
  ],
};

export default meta;
