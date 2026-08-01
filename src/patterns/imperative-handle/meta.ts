import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Refs & Imperative Handle",
  category: "rendering",
  tier: 2,
  blurb:
    "Expose a small, deliberate API from a component instead of handing out its DOM node — with `ref` as a plain prop in React 19.",
  problem:
    "Some things are genuinely imperative: focus, scroll, select, play, measure. Passing the raw DOM node up lets a parent do anything to it, which quietly makes every internal detail part of your public API. `useImperativeHandle` narrows that to named methods you choose, so the implementation stays replaceable. React 19 also removes the `forwardRef` wrapper — `ref` is now an ordinary prop.",
  whenToUse: [
    "Focus management, scrolling into view, text selection, media playback, canvas drawing.",
    "A component library that needs to offer imperative escape hatches without exposing internals.",
    "Integrating with non-React code that expects to call methods on things.",
  ],
  whenNotToUse: [
    "Anything expressible as props and state. An imperative `setValue` is state wearing a disguise.",
    "Reading values during render — refs are for escape hatches, not for data flow.",
    "Reaching into a child to change what it renders. Pass a prop; that is what they are for.",
  ],
  related: ["portals", "control-props", "custom-hooks"],
  docs: [
    {
      label: "react.dev — useImperativeHandle",
      href: "https://react.dev/reference/react/useImperativeHandle",
    },
    {
      label: "react.dev — ref as a prop (React 19)",
      href: "https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop",
    },
  ],
};

export default meta;
