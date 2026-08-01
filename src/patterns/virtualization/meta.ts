import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Virtualization",
  category: "performance",
  tier: 3,
  blurb:
    "Render only the rows in view, with a full-height spacer so the scrollbar still tells the truth.",
  problem:
    "A list of ten thousand rows is ten thousand DOM nodes, and the browser pays for all of them — on mount, on every style recalculation, and in memory — while the user can see perhaps twenty. Windowing renders the visible slice plus a small overscan, and props up the scroll height with a spacer so scrolling behaves normally. It is the difference between a list that janks and one that does not, and no amount of memoisation substitutes for it.",
  whenToUse: [
    "Long lists, tables and grids — thousands of rows, or hundreds of expensive ones.",
    "Where pagination is not appropriate because users need to scroll continuously.",
    "Feeds and logs that grow without bound.",
  ],
  whenNotToUse: [
    "Short lists. Under a few hundred simple rows this is complexity for nothing.",
    "Content that must be findable with the browser's own search, or copied whole — offscreen rows do not exist to Ctrl+F.",
    "Variable row heights, unless you use a library. Measuring rows and correcting scroll offset without visible jumping is the hard part, and hand-rolling it rarely goes well.",
  ],
  related: ["pagination", "transitions", "memoization"],
  docs: [
    {
      label: "MDN — ResizeObserver",
      href: "https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver",
    },
  ],
};

export default meta;
