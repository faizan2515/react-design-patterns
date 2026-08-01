import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "State Colocation",
  category: "state",
  tier: 1,
  blurb:
    "Keep state in the smallest component that reads it, so a keystroke re-renders a text box instead of a page.",
  problem:
    "State gets lifted to a common ancestor because two children needed it once, and then it stays there. Every update now re-renders the whole subtree, including expensive siblings that never read the value. Pushing state back down is usually a bigger win than any amount of memoisation, because it removes the re-render rather than making it cheaper.",
  whenToUse: [
    "Only one branch of the tree reads the state — that branch should own it.",
    "Typing, hovering or dragging feels laggy, and the counters show unrelated components re-rendering.",
    "You are reaching for memo() to paper over a render that should not be happening at all.",
  ],
  whenNotToUse: [
    "Genuinely shared state that several siblings read and write — lift it, or move it to a store.",
    "The state has to outlive the component that owns it, such as surviving a route change.",
    "The subtree is cheap. Colocation costs a component; do not pay it for a render nobody can perceive.",
  ],
  related: [
    "derived-state",
    "context-reducer-store",
    "provider-context",
    "custom-hooks",
  ],
  docs: [
    {
      label: "react.dev — Sharing state between components",
      href: "https://react.dev/learn/sharing-state-between-components",
    },
    {
      label: "react.dev — React Compiler",
      href: "https://react.dev/learn/react-compiler",
    },
  ],
};

export default meta;
