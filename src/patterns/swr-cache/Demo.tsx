import { useState, useSyncExternalStore } from "react";
import { PEOPLE } from "../../lab/data";
import type { Person } from "../../lab/data";
import { fakeRequest } from "../../lab/fakeApi";
import { Knobs } from "../../lab/Knobs";
import { RenderBadge } from "../../lab/RenderBadge";
import { useRenderCount } from "../../lab/useRenderCount";
import { peopleCache } from "./cache";
import { useCached } from "./useCached";

const TEAMS = ["Platform", "Design", "Research"] as const;

export default function Demo() {
  const [team, setTeam] = useState<string>("Platform");
  const [latency, setLatency] = useState(800);
  const [twin, setTwin] = useState(true);

  const stats = useSyncExternalStore(
    peopleCache.subscribe,
    peopleCache.getStats,
    peopleCache.getStats,
  );

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice
          label="Team"
          value={team}
          onChange={setTeam}
          options={TEAMS.map((t) => ({ value: t, label: t }))}
        />
        <Knobs.Range
          label="Network"
          value={latency}
          onChange={setLatency}
          min={200}
          max={2000}
          step={100}
          unit="ms"
        />
        <Knobs.Toggle label="second panel" checked={twin} onChange={setTwin} />
        <Knobs.Action
          label="Invalidate"
          onClick={() => peopleCache.invalidate(team)}
        />
        <Knobs.Action label="Clear cache" onClick={() => peopleCache.clear()} />
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        <Panel name="Panel A" team={team} latency={latency} />
        {twin && <Panel name="Panel B" team={team} latency={latency} />}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Stat label="hits" value={stats.hits} />
        <Stat label="misses" value={stats.misses} />
        <Stat label="deduped" value={stats.deduped} />
        <Stat label="revalidated" value={stats.revalidations} />
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Two panels ask for the same key at the same moment and one request goes out — the
        cache stores the in-flight promise, not just the result, so the second caller joins
        the first instead of starting its own. That is all request deduplication is.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Switch teams and come straight back: the data appears instantly from cache. Wait a
        few seconds first and it still appears instantly, with a refresh running behind it.
        Stale-while-revalidate means never blanking a screen to show something you already
        have. Invalidate marks the entry stale without discarding it, so the next read is
        instant and correct shortly after.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Reading and fetching are deliberately separate here — a pure{" "}
        <code className="text-fg">getEntry</code> during render, and an{" "}
        <code className="text-fg">ensure</code> in an effect. Fetching from inside a{" "}
        <code className="text-fg">getSnapshot</code> makes reading the store notify the
        store, and the app renders in a loop until it freezes.
      </p>
    </div>
  );
}

function Panel({
  name,
  team,
  latency,
}: {
  name: string;
  team: string;
  latency: number;
}) {
  const entry = useCached<Person[]>(team, () =>
    fakeRequest(() => PEOPLE.filter((person) => person.team === team), {
      latency,
    }),
  );
  const renders = useRenderCount();

  const people = entry?.data;

  return (
    <div className="space-y-2 rounded-md border border-line p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">{name}</span>
        <RenderBadge count={renders} />
      </div>

      {people === undefined ? (
        <p className="font-mono text-[11px] text-muted">loading…</p>
      ) : (
        <ul className="space-y-0.5">
          {people.map((person) => (
            <li key={person.id} className="text-[13px] text-fg">
              {person.name}
            </li>
          ))}
          {people.length === 0 && (
            <li className="text-[13px] text-muted">nobody</li>
          )}
        </ul>
      )}

      <p className="font-mono text-[10px] text-muted">
        {entry?.inFlight ? "revalidating…" : "settled"}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-line px-2 py-1.5 text-center">
      <p className="font-mono text-[15px] tabular-nums text-fg">{value}</p>
      <p className="u-label text-[9px] text-muted">{label}</p>
    </div>
  );
}
