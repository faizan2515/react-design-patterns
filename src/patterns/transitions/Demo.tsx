import { useDeferredValue, useState, useTransition } from "react";
import { burn } from "../../lab/burn";
import { manyPeople } from "../../lab/data";
import { Knobs } from "../../lab/Knobs";

const ALL = manyPeople(600);

const MODES = [
  { value: "sync", label: "No transition" },
  { value: "deferred", label: "useDeferredValue" },
  { value: "transition", label: "useTransition" },
] as const;

type Mode = (typeof MODES)[number]["value"];

export default function Demo() {
  const [mode, setMode] = useState<Mode>("sync");
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  /* One deferred copy, always declared — hooks cannot be called conditionally. */
  const deferred = useDeferredValue(query);

  const [committed, setCommitted] = useState("");
  const listQuery =
    mode === "deferred" ? deferred : mode === "transition" ? committed : query;

  function onChange(next: string) {
    setQuery(next);
    if (mode === "transition") {
      startTransition(() => setCommitted(next));
    }
  }

  const stale = mode !== "sync" && listQuery !== query;

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice label="Mode" value={mode} onChange={setMode} options={MODES} />
        {mode === "transition" && (
          <Knobs.Readout label="pending">{String(pending)}</Knobs.Readout>
        )}
      </Knobs>

      <input
        value={query}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Type quickly — the list is deliberately slow"
        aria-label="Filter"
        className="w-full rounded border border-line bg-surface-2 px-3 py-2 font-mono text-[13px] text-fg placeholder:text-muted focus:border-accent-line focus:outline-none"
      />

      <div
        className={`h-56 overflow-y-auto rounded-md border border-line transition-opacity ${
          stale ? "opacity-50" : ""
        }`}
      >
        <SlowList query={listQuery} />
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        The list costs a few milliseconds per render on purpose. In “No transition” the
        input and the list update together, so every keystroke waits for the list and
        typing feels stuck.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The other two keep the input responsive by letting the list fall behind.{" "}
        <code className="text-fg">useDeferredValue</code> is the one to reach for when you
        only have a value — no change to how state is set.{" "}
        <code className="text-fg">useTransition</code> is for when you control the update
        and want the pending flag, which is what dims the list here.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Neither makes the render faster. They change what is allowed to be interrupted, so
        urgent work — your keystrokes — stops queueing behind work that can wait. If the
        list were fast, neither would be needed.
      </p>
    </div>
  );
}

function SlowList({ query }: { query: string }) {
  "use no memo";

  const needle = query.trim().toLowerCase();
  const matches = ALL.filter((person) =>
    person.name.toLowerCase().includes(needle),
  ).slice(0, 60);

  // Deliberate cost, standing in for a genuinely heavy tree.
  burn(Math.min(matches.length, 40));

  return (
    <ul className="divide-y divide-line">
      {matches.map((person) => (
        <li key={person.id} className="px-3 py-1.5 text-[13px] text-fg">
          {person.name}
        </li>
      ))}
      {matches.length === 0 && (
        <li className="px-3 py-2 text-[13px] text-muted">No matches</li>
      )}
    </ul>
  );
}
