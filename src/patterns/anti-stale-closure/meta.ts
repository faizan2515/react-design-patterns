import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Anti-pattern: Stale Closures",
  category: "anti-patterns",
  tier: 1,
  blurb:
    "An effect with empty dependencies captures the first render's values and keeps them forever — the counter that stops at one.",
  problem:
    "A callback created inside a render closes over that render's variables. Set it up once with an empty dependency array and it keeps those values permanently, so an interval reading `count` computes `0 + 1` on every tick, for as long as the component lives. Adding the value to the dependencies technically works and rebuilds the timer on every change, which is usually worse. The real fix is to stop reading the value from the closure at all.",
  whenToUse: [
    "Use the updater form — `setState(current => …)` — whenever the next value depends on the previous one.",
    "Use a ref when an effect must *read* a changing value it should not re-subscribe on.",
    "Include a dependency when the effect genuinely should re-run on that change — a subscription keyed by an id, for example.",
  ],
  whenNotToUse: [
    "Do not silence the lint rule to keep a dependency array empty; that warning is describing a real capture.",
    "Do not add every dependency reflexively either — an interval or subscription rebuilt on every keystroke is its own bug.",
    "Do not store values in refs to dodge re-renders you actually need. Refs do not trigger renders, so the UI will not update.",
  ],
  related: ["custom-hooks", "polling", "anti-effect-sync"],
  docs: [
    {
      label: "react.dev — Synchronizing with effects",
      href: "https://react.dev/learn/synchronizing-with-effects",
    },
    {
      label: "react.dev — Removing effect dependencies",
      href: "https://react.dev/learn/removing-effect-dependencies",
    },
  ],
};

export default meta;
