import type { PatternMeta } from "../../registry/types";

const meta: PatternMeta = {
  title: "Server Components & Actions",
  category: "architecture",
  tier: 2,
  blurb:
    "Components that run on the server and ship no JavaScript — explained rather than demonstrated, because a Vite SPA cannot run them.",
  problem:
    "In a client-only app, showing a list from a database takes an API route, a fetch, an effect, a loading state and an error state — machinery that exists only because the component runs in the wrong place. A Server Component runs on the server, awaits the query directly, and sends rendered output instead of code. What it cannot do is hold state, so anything interactive still needs a client boundary, and placing those boundaries well is the whole skill.",
  whenToUse: [
    "Data-heavy pages where most of the tree is display rather than interaction.",
    "Reducing bundle size by keeping formatting libraries, markdown parsers and query clients on the server.",
    "Removing an API route that exists only to feed your own UI.",
  ],
  whenNotToUse: [
    "Apps without a server. This needs a framework such as Next.js or React Router in framework mode — you cannot adopt RSC in a static SPA.",
    "Highly interactive surfaces — editors, canvases, dashboards — which end up client components anyway.",
    "Without watching where `\"use client\"` sits. One placed too high pulls the subtree it imports into the browser bundle and undoes the benefit.",
  ],
  related: ["actions-forms", "render-as-you-fetch", "suspense-lazy", "feature-slices"],
  docs: [
    {
      label: "react.dev — Server Components",
      href: "https://react.dev/reference/rsc/server-components",
    },
    {
      label: "react.dev — Server Functions",
      href: "https://react.dev/reference/rsc/server-functions",
    },
  ],
};

export default meta;
