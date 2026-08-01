import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Debounce & Throttle",
  category: "performance",
  tier: 2,
  blurb:
    "Wait for a pause, or sample at a fixed rate — two different answers to the same flood of events.",
  problem:
    "Typing, scrolling, resizing and dragging produce events far faster than anything downstream can usefully consume. Debounce waits until the burst stops and acts once, which is right when only the final value matters. Throttle acts at most once per interval while the burst continues, which is right when you want a regular sample of something ongoing. Reaching for the wrong one is why some search boxes fire on every keystroke and some scroll indicators never move until you stop.",
  whenToUse: [
    "Debounce: search-as-you-type, autosave, validation that hits the network, resize handlers that recompute layout.",
    "Throttle: scroll position, pointer tracking, drag updates, progress reporting.",
    "Any handler whose work is heavier than the event that triggers it.",
  ],
  whenNotToUse: [
    "To fix an expensive render — that is `useDeferredValue`, which keeps the input responsive without delaying anything.",
    "On actions users expect to be immediate. A debounced button feels broken.",
    "Where a cancelled request would do the job better; debouncing plus an abort is usually the real answer for search.",
  ],
  related: ["transitions", "fetch-on-render", "swr-cache"],
  docs: [
    {
      label: "react.dev — You might not need an effect",
      href: "https://react.dev/learn/you-might-not-need-an-effect",
    },
  ],
};

export default meta;
