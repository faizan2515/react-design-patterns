import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Observer",
  category: "classic",
  tier: 3,
  blurb:
    "Publishers keep a list of subscribers and call them on change — the primitive under every store, socket and browser event.",
  problem:
    "Sometimes a change has to reach parts of the app that share no ancestor worth threading it through. An emitter decouples them completely: the publisher does not know who listens, and listeners do not know each other. That decoupling is genuinely useful and genuinely costly — the wiring becomes invisible, so tracing who reacts to an event means searching for its name rather than reading the tree.",
  whenToUse: [
    "Bridging non-React sources into React: sockets, browser events, third-party SDKs.",
    "Cross-cutting notifications with no natural owner — toasts, telemetry, keyboard shortcuts.",
    "Building a store; `subscribe` is this pattern, and `useSyncExternalStore` is how React consumes it.",
  ],
  whenNotToUse: [
    "Communication between components with a common ancestor. Props or context keep the data flow visible.",
    "Without returning an unsubscribe and using it — every remount otherwise adds a handler that is never removed.",
    "With an effect that calls `setState` on every event. Use `useSyncExternalStore`, which handles the concurrent-rendering cases correctly.",
  ],
  related: ["external-store", "store-singleton", "mediator"],
  docs: [
    {
      label: "react.dev — useSyncExternalStore",
      href: "https://react.dev/reference/react/useSyncExternalStore",
    },
  ],
};

export default meta;
