import { useCallback, useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { fakeRequest } from "../../lab/fakeApi";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import { usePolling } from "./usePolling";

export default function Demo() {
  const [enabled, setEnabled] = useState(false);
  const [pauseWhenHidden, setPause] = useState(true);
  const [failing, setFailing] = useState(false);
  const [interval, setIntervalMs] = useState(2000);
  const [entries, log] = useEventLog();

  const fetcher = useCallback(
    () =>
      fakeRequest(() => Math.round(40 + Math.random() * 60), {
        latency: 300,
        fail: failing,
      }),
    [failing],
  );

  const { data, failures } = usePolling(fetcher, {
    interval,
    enabled,
    pauseWhenHidden,
    onEvent: log.add,
  });

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle label="polling" checked={enabled} onChange={setEnabled} />
        <Knobs.Toggle
          label="pause when tab hidden"
          checked={pauseWhenHidden}
          onChange={setPause}
        />
        <Knobs.Toggle
          label="server is failing"
          checked={failing}
          onChange={setFailing}
        />
        <Knobs.Range
          label="Every"
          value={interval}
          onChange={setIntervalMs}
          min={500}
          max={5000}
          step={500}
          unit="ms"
        />
      </Knobs>

      <div className="flex items-center gap-6 rounded-md border border-line p-4">
        <div>
          <p className="u-label text-[9.5px] text-muted">requests / sec</p>
          <p className="font-mono text-[26px] tabular-nums text-fg">
            {data ?? "—"}
          </p>
        </div>
        <div>
          <p className="u-label text-[9.5px] text-muted">consecutive failures</p>
          <p
            className={`font-mono text-[26px] tabular-nums ${
              failures > 0 ? "text-accent" : "text-fg"
            }`}
          >
            {failures}
          </p>
        </div>
      </div>

      <EventLog entries={entries} onClear={log.clear} title="Poll trace" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Start polling, then switch to another browser tab for a few seconds and come back.
        The trace shows ticks being skipped while hidden and an immediate poll on return —
        an app left open all day otherwise sends thousands of requests nobody will ever
        see, multiplied by every user.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Now turn on “server is failing” and watch the retry delay double each time. Without
        backoff, every client hammers a struggling server at full rate at exactly the moment
        it can least afford it.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The next poll is scheduled after the previous one finishes, never on a fixed{" "}
        <code className="text-fg">setInterval</code>. That is the third bug in the naive
        version: when a response takes longer than the interval, requests overlap and pile
        up faster than they complete.
      </p>
    </div>
  );
}
