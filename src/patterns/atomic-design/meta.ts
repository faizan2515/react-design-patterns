import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Atomic Design",
  category: "architecture",
  tier: 3,
  blurb:
    "Layer components by how much they know about the product — and keep the dependencies pointing one way.",
  problem:
    "Without a stated hierarchy, a button ends up importing a data hook, and a page-level component ends up being copied because it cannot be reused. Atomic Design names the layers — atoms, molecules, organisms — so primitives stay free of application knowledge and dependencies point in one direction. The taxonomy itself is where teams waste time; the durable part is the rule about which layer may import which.",
  whenToUse: [
    "Design systems, where a genuinely reusable base layer is the whole point.",
    "Large codebases needing an agreed answer to 'where does this component go'.",
    "When primitives keep acquiring product-specific props.",
  ],
  whenNotToUse: [
    "Small apps. The ceremony outweighs the clarity.",
    "As a naming argument. If the team debates whether something is a molecule, the vocabulary is costing more than it returns.",
    "Where feature-based organisation fits better — most product code is grouped more usefully by feature than by size.",
  ],
  related: ["feature-slices", "layout-components", "slots"],
  docs: [
    {
      label: "Brad Frost — Atomic Design",
      href: "https://atomicdesign.bradfrost.com/chapter-2/",
    },
  ],
};

export default meta;
