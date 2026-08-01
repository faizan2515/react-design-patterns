import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Slots",
  category: "composition",
  tier: 2,
  blurb:
    "Named regions a caller fills in — as typed props when the regions are fixed, as children when they are not.",
  problem:
    "A layout component needs content in several places, not just one. Passing regions as props puts the contract in the type signature, where it is checkable and self-documenting but finite. Passing them as child components reads like markup and scales to any arrangement, at the cost of the compiler no longer knowing a header exists. Both beat the third option — inspecting `children` at runtime to find the header — which breaks as soon as someone wraps one in a fragment.",
  whenToUse: [
    "Props as slots: a small fixed set of regions, some required, where you want type errors for a missing one.",
    "Children as slots: an open-ended set, repeatable regions, or callers who need to control order.",
    "Either one whenever a component would otherwise grow `renderHeader`-style callbacks.",
  ],
  whenNotToUse: [
    "There is only one region — that is `children`, and it needs no name.",
    "The parts need to share state with each other; that is compound components, with context doing the work.",
    "You would have to filter or clone `children` to make it work. Reach for context or explicit props instead.",
  ],
  related: ["compound-components", "polymorphic-as", "render-props"],
  docs: [
    {
      label: "react.dev — Passing JSX as children",
      href: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children",
    },
  ],
};

export default meta;
