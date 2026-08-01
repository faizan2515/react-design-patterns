import type { Category } from "./types";

/** Order here is the order of the sidebar and the home page. */
export const CATEGORIES: Category[] = [
  {
    id: "composition",
    label: "Composition",
    blurb: "How components are built out of, and share behaviour with, other components.",
  },
  {
    id: "rendering",
    label: "Rendering & Structure",
    blurb: "Getting things onto the screen: conditionals, lists, boundaries, portals.",
  },
  {
    id: "state",
    label: "State",
    blurb: "Where state lives, who owns it, and how it changes over time.",
  },
  {
    id: "data",
    label: "Data Fetching",
    blurb: "Talking to the network without races, waterfalls or stale screens.",
  },
  {
    id: "performance",
    label: "Performance",
    blurb: "Doing less work per render, and deferring the work that remains.",
  },
  {
    id: "classic",
    label: "Classic Patterns",
    blurb: "Gang-of-Four patterns as they actually appear in React code.",
  },
  {
    id: "architecture",
    label: "Architecture",
    blurb: "Organising a codebase once it outgrows a single folder.",
  },
  {
    id: "anti-patterns",
    label: "Anti-Patterns",
    blurb: "Common mistakes, shown broken and then fixed.",
  },
];

export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));
