import { Suspense, useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { Parallel, Waterfall } from "./panels";
import { reload } from "./resources";

export default function Demo() {
  const [latency, setLatency] = useState(700);
  const [run, setRun] = useState(0);

  function rerun() {
    reload();
    setRun((n) => n + 1);
  }

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Range
          label="Each request"
          value={latency}
          onChange={setLatency}
          min={200}
          max={1500}
          step={100}
          unit="ms"
        />
        <Knobs.Action label="Run both again" onClick={rerun} />
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        <Column title="Waterfall" note="second request waits for the first">
          <Suspense key={`w${run}`} fallback={<Loading />}>
            <Waterfall latency={latency} />
          </Suspense>
        </Column>

        <Column title="Parallel" note="both start before either is read">
          <Suspense key={`p${run}`} fallback={<Loading />}>
            <Parallel latency={latency} />
          </Suspense>
        </Column>
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Both columns request the same two things at the same speed. The left one takes
        roughly twice as long, because its second request cannot start until the first has
        resolved — the component that fires it does not render while its parent is
        suspended. Raise the latency until the gap is obvious.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        This is the waterfall that fetching in an effect also produces, and it is the most
        common data-loading performance bug: two independent requests taking as long as
        their sum for no reason other than where they were written.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Note the promises are cached. <code className="text-fg">use()</code> suspends until
        a promise settles and retries the render afterwards, so a promise created during
        render would be replaced by a new one on every attempt and never resolve. Caching
        is not an optimisation here — without it the component suspends forever.
      </p>
    </div>
  );
}

function Column({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[11px] text-muted">
        {title} <span className="opacity-60">· {note}</span>
      </p>
      {children}
    </div>
  );
}

function Loading() {
  return (
    <p className="rounded border border-dashed border-line px-3 py-6 text-center font-mono text-[11px] text-muted">
      loading…
    </p>
  );
}
