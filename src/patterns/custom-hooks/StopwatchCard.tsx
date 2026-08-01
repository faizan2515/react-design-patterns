import { useEffect } from "react";
import type { EventLogControl } from "../../lab/useEventLog";
import { useStopwatch } from "./useStopwatch";

/**
 * Two of these render side by side, both calling `useStopwatch()`.
 *
 * They do not share a clock. Calling the same hook twice runs the same code twice against
 * two separate pieces of state — hooks share logic, never state. This is the single most
 * common misconception about them, and the demo exists to settle it.
 */
export function StopwatchCard({
  name,
  log,
}: {
  name: string;
  log: EventLogControl;
}) {
  const { elapsed, running, start, stop, reset } = useStopwatch();

  useEffect(() => {
    log.add(`${name} mounted`, "accent");
    return () => log.add(`${name} unmounted — interval cleared`, "warn");
  }, [name, log]);

  return (
    <div className="flex-1 space-y-3 rounded-md border border-line p-3">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[11px] text-muted">{name}</span>
        <span className="font-mono text-[20px] tabular-nums text-fg">
          {(elapsed / 1000).toFixed(1)}s
        </span>
      </div>

      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={running ? stop : start}
          className="rounded border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent-line hover:text-fg"
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent-line hover:text-fg"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
