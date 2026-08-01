import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Error Boundaries",
  category: "rendering",
  tier: 1,
  blurb:
    "Contain a crash to one part of the page instead of unmounting the whole tree.",
  problem:
    "An error thrown while React renders is not recoverable in place — React unmounts the entire tree rather than leave a half-built UI on screen, so one broken widget blanks the page. A boundary gives React somewhere to put a fallback, turning a total failure into a local one. It catches render and effect errors only: event handlers, timers and promise rejections happen when React is no longer on the stack, and need ordinary try/catch.",
  whenToUse: [
    "Around anything independently failable — a widget, a route, a third-party embed, a dashboard panel.",
    "At route level, so a broken page still leaves navigation working.",
    "Anywhere you want a retry affordance rather than a blank screen.",
  ],
  whenNotToUse: [
    "For expected failures. A failed request is a state to render, not an exception to throw.",
    "As a substitute for handling errors in event handlers or async code — boundaries never see those.",
    "One boundary at the root and nothing else: that catches everything and still blanks everything.",
  ],
  related: ["suspense-lazy", "conditional-rendering", "fetch-on-render"],
  docs: [
    {
      label: "react.dev — Catching rendering errors with an error boundary",
      href: "https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary",
    },
  ],
};

export default meta;
