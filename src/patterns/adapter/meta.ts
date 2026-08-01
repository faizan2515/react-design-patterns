import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Adapter",
  category: "classic",
  tier: 2,
  blurb:
    "Translate a foreign shape into the one your UI already speaks, at the boundary rather than throughout.",
  problem:
    "External data rarely arrives in the shape a component wants — names split, amounts in cents, timestamps in seconds, three spellings of the same status. Consuming it directly spreads those quirks through the tree, so a provider change becomes a change everywhere. An adapter converts at the boundary, leaving one internal vocabulary that outlives whichever service is currently behind it.",
  whenToUse: [
    "Third-party APIs whose shape you do not control.",
    "Supporting several providers behind one interface, or migrating between API versions.",
    "Anywhere backend naming is leaking into component props.",
  ],
  whenNotToUse: [
    "The payload already matches what you need and there is one provider.",
    "As a dumping ground — an adapter that also fetches, caches and validates has stopped being an adapter.",
    "Where deriving the value at the point of use is clearer than converting the whole object.",
  ],
  related: ["repository", "derived-state", "decorator"],
  docs: [
    {
      label: "TypeScript — interfaces",
      href: "https://www.typescriptlang.org/docs/handbook/2/objects.html",
    },
  ],
};

export default meta;
