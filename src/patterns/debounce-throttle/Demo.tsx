import { useEffect, useRef, useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { useDebounced, useThrottled } from "./timing";

export default function Demo() {
  const [query, setQuery] = useState("");
  const [delay, setDelay] = useState(400);

  const debounced = useDebounced(query, delay);
  const throttled = useThrottled(query, delay);

  const raw = useRequestCount(query);
  const deb = useRequestCount(debounced);
  const thr = useRequestCount(throttled);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Range
          label="Delay"
          value={delay}
          onChange={setDelay}
          min={100}
          max={1200}
          step={100}
          unit="ms"
        />
        <Knobs.Action
          label="Reset counts"
          onClick={() => {
            raw.reset();
            deb.reset();
            thr.reset();
          }}
        />
      </Knobs>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Type a sentence at normal speed…"
        aria-label="Search"
        className="w-full rounded border border-line bg-surface-2 px-3 py-2 font-mono text-[13px] text-fg placeholder:text-muted focus:border-accent-line focus:outline-none"
      />

      <div className="grid gap-2 sm:grid-cols-3">
        <Card title="every keystroke" value={query} count={raw.count} warn />
        <Card title={`debounced ${delay}ms`} value={debounced} count={deb.count} />
        <Card title={`throttled ${delay}ms`} value={throttled} count={thr.count} />
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Type a sentence and compare the counts. The first column is what a naive
        search-as-you-type sends: one request per keystroke, most of them already obsolete
        when they arrive.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Debounce waits for you to stop and then fires once — right for search, where only
        the final value matters. Throttle fires steadily while you keep going — right for
        scroll position, resize, cursor tracking, or anything you want sampled rather than
        finalised. Debounce may never fire while input continues; throttle always does.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Both are written here as effects over a value rather than wrapped callbacks, so the
        cleanup cancels the pending timer on every change and on unmount. Hand-rolled
        versions usually leak exactly that timer.
      </p>
    </div>
  );
}

/** Counts how many distinct values this input settled on — a stand-in for requests sent. */
function useRequestCount(value: string) {
  const [count, setCount] = useState(0);
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current !== value) {
      previous.current = value;
      setCount((n) => n + 1);
    }
  }, [value]);

  return { count, reset: () => setCount(0) };
}

function Card({
  title,
  value,
  count,
  warn,
}: {
  title: string;
  value: string;
  count: number;
  warn?: boolean;
}) {
  return (
    <div
      className={`space-y-1 rounded-md border p-3 ${
        warn ? "border-accent-line" : "border-line"
      }`}
    >
      <p className="font-mono text-[10px] text-muted">{title}</p>
      <p className="truncate font-mono text-[12px] text-fg">
        {value || <span className="text-muted">—</span>}
      </p>
      <p
        className={`font-mono text-[20px] tabular-nums ${
          warn ? "text-accent" : "text-fg"
        }`}
      >
        {count}
      </p>
    </div>
  );
}
