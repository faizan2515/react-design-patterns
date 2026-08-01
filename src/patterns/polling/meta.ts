import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Polling & Backoff",
  category: "data",
  tier: 3,
  blurb:
    "Re-fetch on a schedule without overlapping requests, hammering a failing server, or burning battery in a hidden tab.",
  problem:
    "`setInterval(fetch, 5000)` is wrong in three ways that only surface in production. It keeps requesting in background tabs, so an app left open all day sends thousands of unseen requests per user. It keeps the same rate when the server is failing, so every client increases load at the worst possible moment. And when a response is slower than the interval, requests overlap and pile up. Scheduling the next run after the previous finishes, backing off on failure, and pausing when hidden fixes all three.",
  whenToUse: [
    "Data that changes on the server without the client acting — job status, queues, dashboards.",
    "Where a socket is unavailable or not worth the infrastructure.",
    "Anything long-running that a user is waiting on.",
  ],
  whenNotToUse: [
    "High-frequency or low-latency updates — that is a WebSocket or server-sent events.",
    "Data that only changes in response to user actions. Refetch on the action instead.",
    "Without backoff and a visibility check. Naive polling is a load-generation tool aimed at your own servers.",
  ],
  related: ["fetch-on-render", "swr-cache", "external-store"],
  docs: [
    {
      label: "MDN — Page Visibility API",
      href: "https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API",
    },
  ],
};

export default meta;
