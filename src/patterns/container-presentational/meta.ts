import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Container / Presentational",
  category: "composition",
  tier: 1,
  blurb:
    "Split a component in two: one that knows where data comes from, one that only knows how to draw it.",
  problem:
    "A component that fetches, holds state, handles errors and renders markup is hard to test and impossible to reuse — every new data source means copying the markup. Separating the two halves gives you a view that takes props and nothing else, and containers you can swap freely behind it.",
  whenToUse: [
    "The same view needs to be driven by more than one source — live API, fixtures, tests, offline mode.",
    "You want to render a component in isolation without standing up a network layer.",
    "Data logic has grown large enough that it obscures the markup it sits above.",
  ],
  whenNotToUse: [
    "The component is small and has exactly one data source. Splitting it adds a file for no benefit.",
    "You are splitting on reflex rather than need — most modern code extracts a custom hook instead of a container component.",
    "The 'container' would only pass props straight through, adding a layer that does nothing.",
  ],
  related: ["custom-hooks", "higher-order-component", "provider-context"],
  docs: [
    {
      label: "react.dev — Passing props to a component",
      href: "https://react.dev/learn/passing-props-to-a-component",
    },
    {
      label: "Dan Abramov — Presentational and Container Components (and his later note on it)",
      href: "https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0",
    },
  ],
};

export default meta;
