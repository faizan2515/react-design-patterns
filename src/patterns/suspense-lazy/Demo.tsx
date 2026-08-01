import { lazy, Suspense, useMemo, useState } from "react";
import { delay } from "../../lab/fakeApi";
import { Knobs } from "../../lab/Knobs";

const BOUNDARIES = [
  { value: "shared", label: "One boundary" },
  { value: "separate", label: "One each" },
] as const;

type Boundaries = "shared" | "separate";

export default function Demo() {
  const [mounted, setMounted] = useState(false);
  const [boundaries, setBoundaries] = useState<Boundaries>("shared");
  const [latency, setLatency] = useState(700);
  const [reload, setReload] = useState(0);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle label="mounted" checked={mounted} onChange={setMounted} />
        <Knobs.Choice
          label="Boundaries"
          value={boundaries}
          onChange={setBoundaries}
          options={BOUNDARIES}
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
        <Knobs.Action label="Reload" onClick={() => setReload((n) => n + 1)} />
      </Knobs>

      {mounted ? (
        /*
          The key is how Reload works. Remounting gives LazyPair a fresh useMemo, and so
          fresh lazy() components whose artificial delay runs again — the same key-as-reset
          idea as pattern #13, used to make a one-time loading state observable repeatedly.
        */
        <LazyPair
          key={reload}
          latency={latency}
          boundaries={boundaries}
        />
      ) : (
        <p className="rounded border border-dashed border-line px-3 py-6 text-center font-mono text-[11px] text-muted">
          Nothing mounted — no chunk requested yet
        </p>
      )}

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        The chart is deliberately slower than the panel. With one boundary they appear
        together, at the pace of the slowest — the boundary is the unit of waiting. Give
        them a boundary each and the panel arrives as soon as it is ready. Suspense does
        not decide what loads; it decides what waits together.
      </p>
    </div>
  );
}

function LazyPair({
  latency,
  boundaries,
}: {
  latency: number;
  boundaries: Boundaries;
}) {
  const { Panel, Chart } = useMemo(
    () => ({
      Panel: lazy(async () => {
        await delay(latency);
        return import("./HeavyPanel");
      }),
      Chart: lazy(async () => {
        await delay(latency * 1.8);
        return import("./HeavyChart");
      }),
    }),
    [latency],
  );

  if (boundaries === "shared") {
    return (
      <Suspense fallback={<Skeleton label="one boundary — both are waiting" />}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Panel />
          <Chart />
        </div>
      </Suspense>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Suspense fallback={<Skeleton label="panel loading" />}>
        <Panel />
      </Suspense>
      <Suspense fallback={<Skeleton label="chart loading" />}>
        <Chart />
      </Suspense>
    </div>
  );
}

function Skeleton({ label }: { label: string }) {
  return (
    <div className="rounded border border-dashed border-line px-3 py-6 text-center">
      <p className="font-mono text-[11px] text-muted">{label}</p>
    </div>
  );
}
