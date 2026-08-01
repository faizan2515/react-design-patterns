import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Polymorphic Components",
  category: "composition",
  tier: 2,
  blurb:
    "One component, any element — with TypeScript narrowing the accepted props to whatever `as` was given.",
  problem:
    "Styling and semantics are different concerns, but a component that hardcodes its tag welds them together. You end up with `Text`, `TextLink` and `TextButton`, or worse, a `span` with an onClick that no keyboard user can reach. A polymorphic `as` prop keeps the styling in one component and lets the caller pick the element the accessibility tree sees — and a generic makes the compiler enforce that `href` only appears on anchors.",
  whenToUse: [
    "Design-system primitives — Text, Box, Stack, Button — where semantics vary but appearance does not.",
    "A component whose correct element depends on context: a link here, a button there, a heading elsewhere.",
    "Anywhere you are tempted to add click handling to a non-interactive element.",
  ],
  whenNotToUse: [
    "The element is genuinely fixed. `as` on a component that is always a `div` is unused API surface.",
    "Application components. This pays off across many call sites, not a handful.",
    "You need refs and are not ready for the extra generic; forwarding a typed ref through a polymorphic component is where this gets genuinely awkward.",
  ],
  related: ["slots", "compound-components", "control-props"],
  docs: [
    {
      label: "react.dev — Your first component",
      href: "https://react.dev/learn/your-first-component",
    },
    {
      label: "MDN — Interactive elements and keyboard accessibility",
      href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role",
    },
  ],
};

export default meta;
