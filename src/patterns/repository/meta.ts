import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Repository & Adapter",
  category: "data",
  tier: 2,
  blurb:
    "Define the shape the UI wants, and make adapters produce it — so a backend change stops being a change to your components.",
  problem:
    "When components consume API payloads directly, the backend's naming, nesting and quirks spread through the tree. A field rename becomes a find-and-replace across files that have nothing to do with it, and swapping or mocking the backend is impossible without a mocking framework reaching into module internals. A repository inverts the dependency: the application declares the interface and the view model it wants, and each adapter's job is to satisfy them.",
  whenToUse: [
    "The API's shape does not match what the UI needs — snake_case, split fields, deep nesting, inconsistent nulls.",
    "You need more than one implementation: real, fake, offline, or a migration between two versions.",
    "Tests would otherwise mock modules rather than substitute behaviour.",
  ],
  whenNotToUse: [
    "The payload is already the shape you want and there is exactly one backend. The layer earns nothing.",
    "Prototypes, where the indirection costs more than the coupling.",
    "As a pass-through. A repository whose methods only forward a fetch call is a file, not a boundary.",
  ],
  related: ["fetch-on-render", "swr-cache", "provider-context", "custom-hooks"],
  docs: [
    {
      label: "react.dev — Passing data deeply with context (for injecting the repository)",
      href: "https://react.dev/learn/passing-data-deeply-with-context",
    },
  ],
};

export default meta;
