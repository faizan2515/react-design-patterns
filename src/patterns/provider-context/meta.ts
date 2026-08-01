import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Provider / Context",
  category: "composition",
  tier: 1,
  blurb:
    "Publish a value to a whole subtree so the components in between never have to carry it.",
  problem:
    "When a value owned near the top is read near the bottom, every component in between takes a prop it does not use. The prop shows up in signatures, tests and refactors that have nothing to do with it. Context delivers the value directly to whoever reads it, and skips everyone who does not — including when it updates.",
  whenToUse: [
    "A value is genuinely ambient for a subtree: theme, locale, current user, feature flags, design density.",
    "Intermediate components are forwarding a prop they never read.",
    "You want to swap an implementation — a fake service in tests, a mock backend in a demo — without touching consumers.",
  ],
  whenNotToUse: [
    "The tree is two or three levels deep. Passing a prop is simpler than a context, and simpler is the point.",
    "The value changes very often and is read very widely — every consumer re-renders on every change. Split the context or use a store with selectors.",
    "You are reaching for it to avoid composition. Passing elements as children often removes the drilling entirely, with no context at all.",
  ],
  related: [
    "context-reducer-store",
    "compound-components",
    "custom-hooks",
    "state-colocation",
  ],
  docs: [
    {
      label: "react.dev — Passing data deeply with context",
      href: "https://react.dev/learn/passing-data-deeply-with-context",
    },
    {
      label: "react.dev — Scaling up with reducer and context",
      href: "https://react.dev/learn/scaling-up-with-reducer-and-context",
    },
  ],
};

export default meta;
