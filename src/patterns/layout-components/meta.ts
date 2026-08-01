import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Layout Components",
  category: "rendering",
  tier: 2,
  blurb:
    "Make spacing and arrangement the parent's job, so components describe themselves and nothing else.",
  problem:
    "A component with `margin-bottom` has an opinion about its neighbours, and carries it everywhere it is used — including where it appears last, alone, or in a row. That produces the familiar `:last-child` overrides and `margin-top: -8px` corrections. Layout components move the decision to whoever is arranging things: `Stack`, `Row` and `Grid` own the gap, children own nothing, and rearranging means swapping the container rather than editing every child.",
  whenToUse: [
    "Anywhere you are about to add a margin to a reusable component.",
    "Design systems, where consistent rhythm matters more than local tweaks.",
    "Layouts that need to be rearranged without touching their contents.",
  ],
  whenNotToUse: [
    "One-off page scaffolding. A plain flex container is not worth a component.",
    "Spacing genuinely intrinsic to a component — padding inside a card is its own business.",
    "As a wrapper for every div. Layout primitives earn their keep by being few and used everywhere.",
  ],
  related: ["slots", "polymorphic-as", "compound-components"],
  docs: [
    {
      label: "MDN — CSS gap",
      href: "https://developer.mozilla.org/en-US/docs/Web/CSS/gap",
    },
  ],
};

export default meta;
