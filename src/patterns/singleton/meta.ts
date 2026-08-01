import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Singleton",
  category: "classic",
  tier: 3,
  blurb:
    "One shared instance for the whole app — which in JavaScript is just a module, along with the hazards that brings.",
  problem:
    "Some things should exist once: a config object, an analytics client, a connection. JavaScript gives this away for free, because module evaluation is cached — any file importing the module gets the same instance, with no class and no `getInstance()`. The cost is that 'once' means once per process, which on a server is once for every user, and once per test run rather than per test.",
  whenToUse: [
    "Genuinely global, immutable configuration read from the environment.",
    "Client-only apps, where one process serves one user anyway.",
    "Expensive clients that are safe to share and hold no per-user state.",
  ],
  whenNotToUse: [
    "Server-rendered apps holding anything user-specific. One instance shared across requests leaks data between users.",
    "Anything tests need to isolate — a surviving instance makes results depend on file order.",
    "State that should be scoped to a subtree. Pass it through context so it can be swapped and reset.",
  ],
  related: ["store-singleton", "provider-context", "factory"],
  docs: [
    {
      label: "react.dev — Passing data deeply with context (the per-request alternative)",
      href: "https://react.dev/learn/passing-data-deeply-with-context",
    },
  ],
};

export default meta;
