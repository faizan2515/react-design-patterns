import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Derived State",
  category: "state",
  tier: 1,
  blurb:
    "If a value can be computed from state you already hold, compute it during render instead of storing a copy that can go stale.",
  problem:
    "Storing something you could derive creates a second source of truth, and the two will eventually disagree. Keeping the selected *object* rather than its id is the everyday version: the list updates, the copy does not, and the detail panel shows a record that no longer exists. The usual response is an effect that copies the new value back in, which adds a render, a dependency array to get wrong, and does not remove the duplication it exists to hide.",
  whenToUse: [
    "Filtered, sorted, grouped or totalled views of data you already have — derive them in render.",
    "Selection, expansion and focus: store the id, look the item up.",
    "Validity, counts and formatted values — all functions of state, not state themselves.",
  ],
  whenNotToUse: [
    "The value genuinely cannot be recomputed — a draft the user is editing, a server response, a random seed.",
    "You deliberately want a snapshot frozen at a point in time, such as an invoice capturing prices at purchase.",
    "Derivation is measurably expensive and runs often — then memoise it, but keep it derived rather than stored.",
  ],
  related: ["use-reducer", "state-colocation", "keys-and-lists"],
  docs: [
    {
      label: "react.dev — You might not need an effect",
      href: "https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state",
    },
    {
      label: "react.dev — Choosing the state structure",
      href: "https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state",
    },
  ],
};

export default meta;
