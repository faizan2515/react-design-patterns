import { useEffect, useRef, useState } from "react";
import { Knobs } from "../../lab/Knobs";

export default function Demo() {
  const [running, setRunning] = useState(false);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle label="timers running" checked={running} onChange={setRunning} />
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        {running ? (
          <>
            <Stale />
            <Fixed />
          </>
        ) : (
          <p className="font-mono text-[11px] text-muted">
            Start the timers to compare them.
          </p>
        )}
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Both tick once a second. The left one stops at 1 and stays there forever.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Its effect ran once with an empty dependency array, so the interval closed over the{" "}
        <code className="text-fg">count</code> from that first render — permanently zero.
        Every tick computes <code className="text-fg">0 + 1</code> and sets 1 again. The
        variable is not stale in some abstract sense; the closure genuinely captured a
        value that will never change.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The fix is not to add <code className="text-fg">count</code> to the dependencies —
        that tears down and rebuilds the interval every second. It is to stop reading the
        value at all: the updater form receives the current state as an argument, so the
        closure never needs to have captured it.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Same rule, applied more widely: when an effect only needs to <em>write</em> based
        on the latest value, use the updater. When it genuinely needs to <em>read</em>{" "}
        something that changes, keep it in a ref and read <code className="text-fg">.current</code>{" "}
        at call time.
      </p>
    </div>
  );
}

/** ✗ The interval captured `count` from the first render and never saw another. */
function Stale() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(timer);
    // Empty deps, so this closure keeps the first render's `count` forever. The
    // suppression below is the point of this page: the linter catches this bug, and
    // silencing it — exactly like this — is how it reaches production.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Card title="✗ reads count from the closure" count={count} broken />;
}

/** ✓ The updater is handed the current value, so nothing needs capturing. */
function Fixed() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((current) => current + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <Card title="✓ updater form" count={count} />;
}

/** For comparison: a ref, when an effect must read a changing value rather than write one. */
function Card({
  title,
  count,
  broken,
}: {
  title: string;
  count: number;
  broken?: boolean;
}) {
  const seen = useRef(0);
  seen.current = Math.max(seen.current, count);

  return (
    <div
      className={`space-y-1 rounded-md border p-3 ${
        broken ? "border-accent-line" : "border-line"
      }`}
    >
      <p className="font-mono text-[11px] text-muted">{title}</p>
      <p
        className={`font-mono text-[28px] tabular-nums ${
          broken ? "text-accent" : "text-fg"
        }`}
      >
        {count}
      </p>
      <p className="font-mono text-[10px] text-muted">highest seen: {seen.current}</p>
    </div>
  );
}
