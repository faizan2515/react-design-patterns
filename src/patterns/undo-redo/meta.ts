import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Undo & Redo",
  category: "state",
  tier: 3,
  blurb:
    "Keep past, present and future as three stacks — the Memento pattern, and why it usually beats Command in UI code.",
  problem:
    "Undo looks like it needs every action to know how to reverse itself. It does not, if the state is small enough to copy: keep a stack of snapshots, and undoing becomes moving a value between stacks with nothing to invert. That is Memento. The Command alternative — storing operations plus their inverses — is dramatically more memory-efficient for large documents and dramatically more work, because every new action needs a correct inverse written and maintained forever.",
  whenToUse: [
    "Editors, canvases, form builders, query builders — anywhere destructive edits deserve a way back.",
    "State small enough that snapshots are cheap, which covers most UI state.",
    "You want branching to behave correctly for free: a new action after undo should discard the redo stack.",
  ],
  whenNotToUse: [
    "Large documents where snapshots are expensive — use commands with inverses, or a persistent data structure.",
    "Actions with side effects outside your state. Undoing a snapshot does not un-send an email.",
    "Server-owned state, where 'undo' is a new request rather than a local stack.",
  ],
  related: ["use-reducer", "state-machine", "optimistic-ui"],
  docs: [
    {
      label: "react.dev — useReducer",
      href: "https://react.dev/reference/react/useReducer",
    },
  ],
};

export default meta;
