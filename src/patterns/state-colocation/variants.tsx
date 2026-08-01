import { useState } from "react";
import { RenderBadge } from "../../lab/RenderBadge";
import { useRenderCount } from "../../lab/useRenderCount";
import { Panel, Results, SearchBox, Sibling } from "./parts";

/**
 * State at the top, React Compiler opted out.
 *
 * This is how React behaved before the compiler, and how it still behaves anywhere
 * memoisation is missing. Every keystroke re-renders this component, and re-rendering it
 * re-renders the expensive sibling that has nothing to do with the search box.
 */
export function LiftedUncompiled({ cost }: { cost: number }) {
  "use no memo";

  const renders = useRenderCount();
  const [query, setQuery] = useState("");

  return (
    <Panel title="Lifted · compiler off" renders={renders}>
      <SearchBox value={query} onChange={setQuery} />
      <Sibling cost={cost} />
      <Results query={query} />
    </Panel>
  );
}

/**
 * Identical code, compiler left on.
 *
 * The sibling's props do not change between keystrokes, so the compiler reuses its
 * element and React skips re-rendering it. The parent still re-renders on every
 * keystroke — the compiler makes the mistake cheaper, not absent.
 */
export function LiftedCompiled({ cost }: { cost: number }) {
  const renders = useRenderCount();
  const [query, setQuery] = useState("");

  return (
    <Panel title="Lifted · compiler on" renders={renders}>
      <SearchBox value={query} onChange={setQuery} />
      <Sibling cost={cost} />
      <Results query={query} />
    </Panel>
  );
}

/**
 * State pushed down to the only component that reads it.
 *
 * The parent now has no reason to re-render at all, so its count stays at 1 no matter
 * how much you type. This holds with or without the compiler, which is what makes it a
 * structural fix rather than an optimisation.
 */
export function Colocated({ cost }: { cost: number }) {
  const renders = useRenderCount();

  return (
    <Panel title="Colocated" renders={renders}>
      <Search />
      <Sibling cost={cost} />
    </Panel>
  );
}

function Search() {
  const renders = useRenderCount();
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-2">
      <SearchBox value={query} onChange={setQuery} />
      <div className="flex items-center justify-between gap-3">
        <Results query={query} />
        <RenderBadge label="search only" count={renders} />
      </div>
    </div>
  );
}
