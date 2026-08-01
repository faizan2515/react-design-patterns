import { useEffect, useState } from "react";
import { PEOPLE } from "../../lab/data";
import { RenderBadge } from "../../lab/RenderBadge";
import { useRenderCount } from "../../lab/useRenderCount";

export default function Demo() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-4">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Type to filter…"
        aria-label="Filter"
        className="w-full rounded border border-line bg-surface-2 px-3 py-2 font-mono text-[13px] text-fg placeholder:text-muted focus:border-accent-line focus:outline-none"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Broken query={query} />
        <Fixed query={query} />
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Both show the same results. The broken one keeps a second copy of them in state and
        an effect to refill it, so every keystroke renders twice — once with stale results,
        once with fresh — and its counter runs at double the other's.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The double render is the visible symptom. The real problem is the second source of
        truth: there is now a moment, every single keystroke, when{" "}
        <code className="text-fg">query</code> and{" "}
        <code className="text-fg">results</code> disagree. Add a dependency to that effect
        and forget it, and the moment becomes permanent.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The fix is not a better effect. It is deleting the state and the effect together,
        and computing the value during render — where it cannot be stale, because there is
        nothing to keep in sync.
      </p>
    </div>
  );
}

/** ✗ The anti-pattern: state mirroring state, kept in step by an effect. */
function Broken({ query }: { query: string }) {
  "use no memo";

  const renders = useRenderCount();
  const [results, setResults] = useState(PEOPLE);

  useEffect(() => {
    setResults(
      PEOPLE.filter((person) =>
        person.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    );
  }, [query]);

  return (
    <Panel title="✗ synced with an effect" renders={renders} broken>
      {results.map((person) => (
        <li key={person.id} className="text-[13px] text-fg">
          {person.name}
        </li>
      ))}
    </Panel>
  );
}

/** ✓ Derived during render. No extra state, no effect, never out of step. */
function Fixed({ query }: { query: string }) {
  "use no memo";

  const renders = useRenderCount();

  const results = PEOPLE.filter((person) =>
    person.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Panel title="✓ derived during render" renders={renders}>
      {results.map((person) => (
        <li key={person.id} className="text-[13px] text-fg">
          {person.name}
        </li>
      ))}
    </Panel>
  );
}

function Panel({
  title,
  renders,
  broken,
  children,
}: {
  title: string;
  renders: number;
  broken?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`space-y-2 rounded-md border p-3 ${
        broken ? "border-accent-line" : "border-line"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">{title}</span>
        <RenderBadge count={renders} highlight={broken} />
      </div>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}
