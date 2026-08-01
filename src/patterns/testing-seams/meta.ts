import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Testing Seams",
  category: "architecture",
  tier: 3,
  blurb:
    "Inject the things a test needs to control — clocks, randomness, network — instead of mocking modules from the outside.",
  problem:
    "Code that calls `Date.now()`, `Math.random()` or `fetch()` directly is not testable without reaching into another module and replacing its internals. Module mocks work until someone refactors the module, at which point tests break despite the behaviour being unchanged. A seam makes the dependency part of the component's own interface — visible in the signature, checked by the compiler, and defaulted to the real thing so production code is unaffected.",
  whenToUse: [
    "Anything non-deterministic: time, randomness, ids, locale, network.",
    "Where several cases matter but only one is reachable at a time — times of day, feature flags, error paths.",
    "Swapping a real backend for a fake in tests, Storybook, or an offline mode.",
  ],
  whenNotToUse: [
    "Pure logic, which needs no seam — just call it.",
    "Every dependency indiscriminately. A component with nine injected collaborators is harder to use than to test.",
    "Where a fake would be so elaborate it tests itself rather than the code.",
  ],
  related: ["repository", "provider-context", "feature-slices"],
  docs: [
    {
      label: "react.dev — Passing data deeply with context",
      href: "https://react.dev/learn/passing-data-deeply-with-context",
    },
  ],
};

export default meta;
