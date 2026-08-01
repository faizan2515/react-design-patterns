import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Decorator",
  category: "classic",
  tier: 3,
  blurb:
    "Wrap something in something with the same signature, adding behaviour without changing how it is called.",
  problem:
    "Retries, timing, logging and caching all want to surround an operation rather than live inside it, and putting them inline leaves one function doing several unrelated jobs. A decorator takes the thing and returns a replacement with the same signature, so callers are unaffected and the wrappers stack. Preserving the signature is the defining constraint — change it and you have an adapter, not a decorator.",
  whenToUse: [
    "Cross-cutting concerns around functions: retry, timeout, memoise, instrument, rate-limit.",
    "Behaviour that should be composable and individually removable.",
    "Wrapping third-party functions you cannot edit.",
  ],
  whenNotToUse: [
    "Where the order of stacking would confuse more than it helps — timing inside versus outside retry mean different things.",
    "For components, when a hook would do. The component form is a HOC, and hooks replaced most of its uses.",
    "When the wrapper needs to change the signature. That is an adapter, and calling it a decorator misleads.",
  ],
  related: ["higher-order-component", "middleware-chain", "adapter"],
  docs: [
    {
      label: "react.dev — Reusing logic with custom hooks",
      href: "https://react.dev/learn/reusing-logic-with-custom-hooks",
    },
  ],
};

export default meta;
