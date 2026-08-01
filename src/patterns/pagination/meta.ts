import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Pagination & Infinite Scroll",
  category: "data",
  tier: 2,
  blurb:
    "Load a list in cursor-addressed pages, and let an IntersectionObserver ask for the next one.",
  problem:
    "Long lists cannot be fetched or rendered all at once, so they arrive in pages — and the two everyday mistakes are addressing those pages by offset and driving them from a scroll handler. Offsets shift whenever data is inserted or deleted while the user reads, silently skipping or repeating rows. Scroll handlers fire constantly and need manual position maths. Cursors and an observer fix both, leaving one real concurrency concern: never let a second page request start while one is already running.",
  whenToUse: [
    "Lists too long to fetch in one go — feeds, logs, search results, activity.",
    "Data that changes while the user reads it, where offsets would skip or repeat rows.",
    "Infinite scroll for browsing; an explicit button for anything people need to work through deliberately.",
  ],
  whenNotToUse: [
    "Bounded lists. Fetching 60 rows once is simpler than paginating them.",
    "Content users need to search, share, or return to a specific position in — infinite scroll makes all three worse.",
    "As a substitute for virtualization. Paging limits what you fetch; it does not stop 5,000 loaded rows from being 5,000 DOM nodes.",
  ],
  related: ["swr-cache", "fetch-on-render", "virtualization"],
  docs: [
    {
      label: "MDN — IntersectionObserver",
      href: "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API",
    },
  ],
};

export default meta;
