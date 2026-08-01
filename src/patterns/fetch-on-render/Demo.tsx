import { useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import { useSearch } from "./useSearch";

export default function Demo() {
  const [query, setQuery] = useState("");
  const [latency, setLatency] = useState(500);
  const [guard, setGuard] = useState(false);
  const [entries, log] = useEventLog();

  const { status, results, appliedFor } = useSearch(query, {
    latency,
    guard,
    log,
  });

  // The bug made visible: what you typed versus what you are actually looking at.
  const stale = status === "ready" && appliedFor !== query.trim();

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label="ignore stale responses"
          checked={guard}
          onChange={setGuard}
        />
        <Knobs.Range
          label="Network"
          value={latency}
          onChange={setLatency}
          min={100}
          max={1200}
          step={100}
          unit="ms"
        />
      </Knobs>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Type a name quickly — try “ada”"
        aria-label="Search people"
        className="w-full rounded border border-line bg-surface-2 px-3 py-2 font-mono text-[13px] text-fg placeholder:text-muted focus:border-accent-line focus:outline-none"
      />

      <div className="rounded-md border border-line p-3">
        <div className="mb-2 flex items-center justify-between gap-3 font-mono text-[11px]">
          <span className={stale ? "text-accent" : "text-muted"}>
            {status === "idle" && "Waiting for input"}
            {status === "loading" && "Loading…"}
            {status === "ready" &&
              (stale
                ? `Showing results for “${appliedFor}” — you typed “${query}”`
                : `Showing results for “${appliedFor}”`)}
          </span>
        </div>

        <ul className="space-y-1">
          {results.map((person) => (
            <li key={person.id} className="text-sm text-fg">
              {person.name}
            </li>
          ))}
          {status === "ready" && results.length === 0 && (
            <li className="text-sm text-muted">No matches</li>
          )}
        </ul>
      </div>

      <EventLog
        entries={entries}
        onClear={log.clear}
        title="Request trace"
        empty="Type to send a request."
      />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        With the guard off, type <code className="text-fg">ada</code> quickly. Broad
        queries are slower, so the request for “a” returns last and overwrites the results
        for “ada”. The trace shows responses applying out of order. Turn the guard on and
        the late response is dropped instead.
      </p>
    </div>
  );
}
