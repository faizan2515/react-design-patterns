import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Compound Components",
  category: "composition",
  tier: 1,
  blurb:
    "Components that only make sense together, sharing state through context so the caller keeps control of the markup.",
  problem:
    "A component that accepts its content as configuration — `items`, `options`, `columns` — ends up owning markup it cannot anticipate. Every icon, badge, divider or disabled state becomes another prop, and the API grows without end. Compound components invert it: the parent provides behaviour through context and the caller writes the markup, so new presentation needs no new API.",
  whenToUse: [
    "The parts are meaningless apart — tabs, accordions, menus, selects, form fields.",
    "Callers need to control layout, ordering, or what sits between the parts.",
    "You are adding a third or fourth 'render this bit differently' prop to a component.",
  ],
  whenNotToUse: [
    "The structure is genuinely fixed and callers should not vary it — a config prop is simpler and harder to misuse.",
    "Consumers need to build the parts from data they map over; an items prop is more direct.",
    "The implicit context coupling would surprise people, for example parts that could plausibly be used standalone.",
  ],
  related: ["slots", "props-getters", "provider-context", "control-props"],
  docs: [
    {
      label: "react.dev — Passing data deeply with context",
      href: "https://react.dev/learn/passing-data-deeply-with-context",
    },
  ],
};

export default meta;
