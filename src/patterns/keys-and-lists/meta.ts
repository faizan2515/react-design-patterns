import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Keys & List Identity",
  category: "rendering",
  tier: 1,
  blurb:
    "Keys tell React which item is which — get them wrong and state attaches to the wrong row; use them deliberately and they reset a component on purpose.",
  problem:
    "A key is an identity claim, not a uniqueness requirement. `key={index}` claims that the item at position 2 is the same thing it was last render, so when the list reorders, React keeps the existing DOM node and its state exactly where it was — inputs, scroll position and selection end up beside the wrong data. The same mechanism run deliberately is the cleanest reset in React: change the key and you get a new component instance.",
  whenToUse: [
    "Always key list items by something stable and intrinsic to the item — a database id, not its position.",
    "Change a key on purpose to reset a subtree: a form when the record changes, a chart when the dataset does.",
    "Index keys are fine only for a list that never reorders, never filters and never inserts anywhere but the end.",
  ],
  whenNotToUse: [
    "Do not key by array index in any list that can change shape — this is the bug, not a shortcut.",
    "Do not generate keys during render with `Math.random()` or `crypto.randomUUID()`: a new key every render remounts every row and throws away all its state.",
    "Do not reach for a key-reset when the component simply should not hold that state — colocating or lifting it may be the real fix.",
  ],
  related: ["conditional-rendering", "state-colocation", "control-props"],
  docs: [
    {
      label: "react.dev — Rendering lists",
      href: "https://react.dev/learn/rendering-lists#why-does-react-need-keys",
    },
    {
      label: "react.dev — Resetting state with a key",
      href: "https://react.dev/learn/preserving-and-resetting-state#resetting-state-with-a-key",
    },
  ],
};

export default meta;
