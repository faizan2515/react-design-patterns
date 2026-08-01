import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Cache, Dedup & Revalidate",
  category: "data",
  tier: 2,
  blurb:
    "Share one request between callers, serve cached data instantly, and refresh it behind the screen.",
  problem:
    "Every component fetching its own data means the same request fires several times on one screen, and every navigation back to a page you just left shows a spinner for data you already had. Three behaviours fix it: deduplication (store the in-flight promise, so simultaneous callers join one request), stale-while-revalidate (return cached data immediately and refresh behind it), and invalidation (mark an entry wrong without throwing it away). Together they are most of what a data library sells.",
  whenToUse: [
    "The same data is read by several components, or across navigations.",
    "Showing something slightly stale beats showing a spinner — lists, profiles, dashboards.",
    "You need a mutation to refresh dependent views without a full reload.",
  ],
  whenNotToUse: [
    "Data that must be exactly current at read time — balances, stock levels, anything transactional.",
    "One-shot requests read in one place. A cache adds a lifecycle you then have to reason about.",
    "In production, instead of a library. Retries, focus revalidation, garbage collection and pagination are all missing here, and all matter.",
  ],
  related: ["render-as-you-fetch", "fetch-on-render", "external-store", "pagination"],
  docs: [
    {
      label: "react.dev — useSyncExternalStore",
      href: "https://react.dev/reference/react/useSyncExternalStore",
    },
  ],
};

export default meta;
