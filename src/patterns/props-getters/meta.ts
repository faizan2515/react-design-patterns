import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Props Getters",
  category: "composition",
  tier: 3,
  blurb:
    "Return functions that build a complete, correct set of props for each element — merging the caller's props instead of overwriting them.",
  problem:
    "A hook that returns loose values (`open`, `toggle`, `id`) leaves every caller to wire up the click handler, the ids and the ARIA attributes, and to get them consistent across the codebase. A getter returns the finished prop object for one element, so `<button {...getButtonProps()}>` is correct by default. The subtlety is merging: a caller who passes their own `onClick` must not silently lose the built-in one, so the getter composes both and lets `preventDefault()` opt out.",
  whenToUse: [
    "A behaviour hook needs several elements wired together — button and panel, input and listbox, trigger and tooltip.",
    "Accessibility attributes must be paired correctly and you would rather callers could not forget them.",
    "Callers keep ownership of the markup, so compound components would be too controlling.",
  ],
  whenNotToUse: [
    "One element and one handler. Returning `toggle` is clearer than returning a getter.",
    "You would not compose the caller's handlers properly — a getter that overwrites `onClick` is worse than no getter.",
    "The component can own the elements itself; compound components need no merging at all.",
  ],
  related: ["state-reducer", "custom-hooks", "compound-components"],
  docs: [
    {
      label: "react.dev — useId",
      href: "https://react.dev/reference/react/useId",
    },
  ],
};

export default meta;
