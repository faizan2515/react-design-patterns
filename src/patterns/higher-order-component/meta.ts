import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Higher-Order Component",
  category: "composition",
  tier: 2,
  blurb:
    "A function that takes a component and returns an enhanced one — the pre-hooks way to share behaviour, and still the right shape for genuine wrapping.",
  problem:
    "Before hooks, sharing stateful behaviour between components meant wrapping them. An HOC does exactly that: component in, component out. It works, but the cost is indirection — the wrapped component's source says nothing about which props are injected, consumed or renamed, the DevTools tree fills with wrappers, and stacking several produces names like `withAccess(withRenderLog(Profile))`. Hooks removed the wrapper for most of these cases.",
  whenToUse: [
    "Something genuinely needs to sit *around* a component: an error boundary, a provider, a suspense boundary.",
    "Cross-cutting instrumentation applied uniformly to many components.",
    "You are working in a codebase that already uses them and consistency matters more than fashion.",
  ],
  whenNotToUse: [
    "Sharing stateful logic — that is a custom hook, with no wrapper and no hidden props.",
    "Anywhere prop collisions are likely; two HOCs injecting the same prop name fail silently.",
    "Composing them inside a component. That creates a new component type per render and remounts the subtree.",
  ],
  related: ["custom-hooks", "render-props", "container-presentational"],
  docs: [
    {
      label: "react.dev — Reusing logic with custom hooks (the modern alternative)",
      href: "https://react.dev/learn/reusing-logic-with-custom-hooks",
    },
  ],
};

export default meta;
