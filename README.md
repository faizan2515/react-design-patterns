# React Design Patterns

An interactive catalog of React design patterns. Every pattern is a component that actually
runs, with the source that renders it displayed directly underneath.

**[Live demo →](https://faizan2515.github.io/react-design-patterns/)**

## What's in it

57 patterns across 8 categories:

| Category | Patterns |
| --- | --- |
| Composition | Container/Presentational, custom hooks, HOCs, render props, compound components, control props, state reducer, props getters, polymorphic `as`, slots, context providers |
| Rendering & Structure | Conditional rendering, keys and list identity, portals, error boundaries, Suspense and lazy loading, layout components, refs and imperative handles |
| State | Colocation, reducers, context stores, external stores, state machines, derived state, undo/redo, optimistic UI, store singletons |
| Data Fetching | Fetch on render, render as you fetch, caching and dedup, pagination, polling, repositories and adapters, actions and form state |
| Performance | Memoization, transitions, virtualization, debounce and throttle, preloading, context splitting |
| Classic Patterns | Singleton, factory, strategy, observer, decorator, adapter, facade, proxy, mediator, chain of responsibility |
| Architecture | Atomic design, feature slices, testing seams, Server Components |
| Anti-patterns | Syncing state with effects, mutating state, stale closures |

Each page covers the problem the pattern solves, an interactive demo, the full source, and
when *not* to reach for it.

## Running it

```bash
bun install
bun run dev
```

Other scripts:

```bash
bun run build     # type-check and build for production
bun run lint      # oxlint
bun run preview   # serve the production build
```

## How it's built

- **React 19** with the React Compiler enabled
- **Vite 8** and **TypeScript**
- **Tailwind CSS 4**, themed with semantic tokens and `light-dark()`
- **React Router** for navigation

Two details worth knowing if you're reading the code:

**Syntax highlighting runs at build time.** A small Vite plugin (`vite/highlight.ts`)
resolves `?highlight` imports into pre-rendered Shiki markup, so no highlighter or grammar
ships to the browser. Tokens carry both light and dark palettes as CSS custom properties.

**There's no `<StrictMode>` at the root.** It double-invokes render in development, which
would report two renders where React commits one — and several demos here are built around
render counts that need to mean something.

## Adding a pattern

Create a folder under `src/patterns/`. The registry picks it up automatically; there's no
list to update and no route to register.

```
src/patterns/your-pattern/
  meta.ts      # title, category, tier, problem, when to use / when not to
  Demo.tsx     # default export — the interactive example
  ...          # any supporting files, all shown in the source tabs
```

Shared demo utilities live in `src/lab/` — render counters, an event log, control knobs, a
fake network, and a deliberately slow component for performance demos.

## Deployment

Pushing to `main` builds and publishes to GitHub Pages via `.github/workflows/deploy.yml`.
Enable it once under **Settings → Pages → Build and deployment → Source: GitHub Actions**.

The site is served from a subpath, so `vite.config.ts` sets a `base` for production builds
and the router reads it back through `import.meta.env.BASE_URL`. If the repository is
renamed, `BASE` in `vite.config.ts` is the only thing to change. The build also emits a
`404.html` copy of `index.html`, which is what makes deep links survive a refresh on Pages.

## Fonts

Martian Mono and JetBrains Mono, both under the SIL Open Font License. See
`src/assets/fonts/OFL-NOTICE.md`.
