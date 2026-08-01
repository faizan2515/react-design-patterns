import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Portals",
  category: "rendering",
  tier: 2,
  blurb:
    "Render into a different part of the DOM while staying in the same React tree — so events and context still flow normally.",
  problem:
    "Modals, tooltips and dropdowns need to escape their ancestors' `overflow: hidden`, `z-index` and stacking contexts, none of which can be undone from inside. A portal moves the DOM node without moving the React node: the element appears under `document.body`, but context still reaches it and its events still bubble to the React component that rendered it. That last part catches people out — a portal is not an escape hatch from React, only from CSS.",
  whenToUse: [
    "Overlays that must not be clipped: modals, tooltips, popovers, toasts, context menus.",
    "Anything that has to sit above the page regardless of where it was declared.",
    "Rendering into a DOM node owned by non-React code you are embedded in.",
  ],
  whenNotToUse: [
    "The element is not being clipped. A portal adds indirection and a focus-management obligation for nothing.",
    "You expect it to stop events reaching the parent — it will not. Stop propagation explicitly if that is what you want.",
    "Without handling focus, Escape and `aria-modal`. A portal alone does not make a dialog accessible.",
  ],
  related: ["error-boundaries", "conditional-rendering", "imperative-handle"],
  docs: [
    {
      label: "react.dev — createPortal",
      href: "https://react.dev/reference/react-dom/createPortal",
    },
  ],
};

export default meta;
