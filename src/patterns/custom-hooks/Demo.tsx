import { useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import { StopwatchCard } from "./StopwatchCard";

export default function Demo() {
  const [second, setSecond] = useState(true);
  const [entries, log] = useEventLog();

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label="second stopwatch mounted"
          checked={second}
          onChange={setSecond}
        />
      </Knobs>

      <div className="flex flex-col gap-3 sm:flex-row">
        <StopwatchCard name="Stopwatch A" log={log} />
        {second && <StopwatchCard name="Stopwatch B" log={log} />}
      </div>

      <EventLog entries={entries} onClear={log.clear} title="Lifecycle" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Start both, and notice they keep separate time despite running identical code —
        hooks share logic, not state. Unmount the second one while it is running: the
        interval is cleared by the hook's own cleanup, because the component using it was
        never told there was an interval to clear.
      </p>
    </div>
  );
}
