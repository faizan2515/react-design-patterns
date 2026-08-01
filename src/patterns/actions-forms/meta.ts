import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Actions & Form State",
  category: "data",
  tier: 2,
  blurb:
    "Hand an async function to `<form action>` and let React own the pending state, the result, and the reset behaviour.",
  problem:
    "Every hand-written form grows the same scaffolding: an `isSubmitting` boolean, a result or error state, a try/catch, controlled state for each field, and an `onSubmit` that opens with `preventDefault()`. `useActionState` collapses that into one async function that receives `FormData` and returns the next result, with pending tracked for you. `useFormStatus` then lets any component inside the form know it is submitting without that being threaded down as a prop.",
  whenToUse: [
    "Ordinary submit-and-respond forms — profiles, settings, comments, sign-up.",
    "Where returning the submitted values matters, so a failed attempt does not clear the fields.",
    "Shared submit buttons or toolbars that should be pending-aware wherever they are dropped.",
  ],
  whenNotToUse: [
    "Rich per-keystroke validation and cross-field rules — a form library still does that far better.",
    "Fields whose values other parts of the UI need to read live. Those want controlled state.",
    "`useFormStatus` outside the form. It reads the nearest enclosing form, so calling it beside one always reports idle.",
  ],
  related: ["optimistic-ui", "control-props", "fetch-on-render"],
  docs: [
    {
      label: "react.dev — useActionState",
      href: "https://react.dev/reference/react/useActionState",
    },
    {
      label: "react.dev — useFormStatus",
      href: "https://react.dev/reference/react-dom/hooks/useFormStatus",
    },
  ],
};

export default meta;
