/*
  The three snippets are illustrative code, not code this project runs — they import a
  database client and call `revalidatePath`, neither of which exists here. They carry a
  `.snippet.ts` extension so tsc, oxlint and the source-tab glob all skip them, while Vite
  still routes them through the transform pipeline.

  That last part is the reason they are not `.txt`. Vite serves unknown extensions
  statically as `text/plain`, so a custom `?highlight` query on a `.txt` never reaches the
  plugin in dev — it builds correctly and then fails in the browser as a MIME type error.

  The plugin takes the language explicitly, since the extension says `ts` but the code is
  JSX.
*/
export { default as SERVER_COMPONENT_HTML } from "./rsc-server.snippet.ts?highlight&lang=tsx";
export { default as CLIENT_COMPONENT_HTML } from "./rsc-client.snippet.ts?highlight&lang=tsx";
export { default as SERVER_ACTION_HTML } from "./rsc-action.snippet.ts?highlight&lang=tsx";

export const BOUNDARY_RULES = [
  {
    rule: "Server Components are the default",
    detail:
      "In an RSC framework a component is a Server Component unless something marks it otherwise. Client components are the exception you opt into.",
  },
  {
    rule: '"use client" marks a boundary, not a file',
    detail:
      "Everything imported below that boundary is bundled for the browser too. One misplaced directive high in the tree can send most of your app to the client.",
  },
  {
    rule: "Props must be serializable",
    detail:
      "Data crosses the network to reach a client component, so functions, class instances and Dates-with-methods cannot be passed. Children can, because they are already-rendered output.",
  },
  {
    rule: "Server Components have no state and no effects",
    detail:
      "They render once, on the server. No useState, no useEffect, no event handlers — if you need any of those, you need a client boundary.",
  },
  {
    rule: "Client components can render Server Components as children",
    detail:
      "The common misconception is that the boundary is one-way. A client component cannot import a server one, but it can receive it as children — which is how layouts stay on the server.",
  },
];
