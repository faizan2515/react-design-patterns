import { useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import type { EventLogControl } from "../../lab/useEventLog";

/**
 * Decorator, applied to a function rather than a component.
 *
 * `withRetry` and `withTiming` each take a function and return one with the same
 * signature, so they compose in any order and the caller cannot tell the difference. That
 * signature-preserving property is what separates a decorator from a wrapper that changes
 * the interface.
 *
 * Order is not cosmetic: timing outside retry measures every attempt together, timing
 * inside measures each attempt separately.
 */
type Task = () => Promise<string>;

function withTiming(task: Task, log: EventLogControl): Task {
  return async () => {
    const started = performance.now();
    try {
      return await task();
    } finally {
      log.add(`timing: ${Math.round(performance.now() - started)}ms`);
    }
  };
}

function withRetry(task: Task, log: EventLogControl, attempts = 3): Task {
  return async () => {
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return await task();
      } catch (error) {
        log.add(`retry: attempt ${attempt} failed`, "warn");
        if (attempt === attempts) throw error;
      }
    }
    throw new Error("unreachable");
  };
}

export default function Demo() {
  const [timing, setTiming] = useState(true);
  const [retry, setRetry] = useState(true);
  const [failures, setFailures] = useState(2);
  const [entries, log] = useEventLog();
  const [result, setResult] = useState<string>("—");

  async function run() {
    let remaining = failures;

    const base: Task = async () => {
      if (remaining > 0) {
        remaining -= 1;
        throw new Error("flaky");
      }
      return "succeeded";
    };

    // Composition order is visible here and changes the meaning.
    let task = base;
    if (retry) task = withRetry(task, log);
    if (timing) task = withTiming(task, log);

    try {
      setResult(await task());
      log.add("task resolved", "accent");
    } catch {
      setResult("failed");
      log.add("task gave up", "warn");
    }
  }

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle label="withTiming" checked={timing} onChange={setTiming} />
        <Knobs.Toggle label="withRetry" checked={retry} onChange={setRetry} />
        <Knobs.Range
          label="Failures first"
          value={failures}
          onChange={setFailures}
          min={0}
          max={4}
        />
        <Knobs.Action label="Run task" onClick={() => void run()} />
        <Knobs.Readout label="result">{result}</Knobs.Readout>
      </Knobs>

      <EventLog entries={entries} onClear={log.clear} title="Decorators" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Set two failures and run with retry on — it recovers on the third attempt. Turn
        retry off and the same task fails immediately. Neither decorator changed the task's
        signature, which is what lets them stack in any combination.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The order is meaningful. Timing wrapped around retry measures the whole recovery;
        wrapped inside, it measures each attempt. Stacking decorators without deciding the
        order is how surprising behaviour gets in.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Applied to a component instead of a function, this same pattern is a higher-order
        component — which has its own page, including why hooks displaced it for most uses.
      </p>
    </div>
  );
}
