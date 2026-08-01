import { useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import { Rating } from "./Rating";

const CAP = 3;

export default function Demo() {
  const [capped, setCapped] = useState(true);
  const [controlled, setControlled] = useState(2);
  const [entries, log] = useEventLog();

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label={`parent caps the rating at ${CAP}`}
          checked={capped}
          onChange={setCapped}
        />
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 rounded-md border border-line p-3">
          <p className="font-mono text-[11px] text-muted">Uncontrolled</p>
          <Rating
            defaultValue={2}
            onChange={(next) => log.add(`uncontrolled → ${next}`)}
          />
          <p className="text-[12px] leading-relaxed text-muted">
            Rating owns the value. The parent is told, but cannot intervene.
          </p>
        </div>

        <div className="space-y-2 rounded-md border border-line p-3">
          <p className="font-mono text-[11px] text-muted">Controlled</p>
          <Rating
            value={controlled}
            onChange={(next) => {
              const applied = capped ? Math.min(next, CAP) : next;
              log.add(
                applied === next
                  ? `controlled → ${applied}`
                  : `controlled → ${next} clamped to ${applied}`,
                applied === next ? "default" : "warn",
              );
              setControlled(applied);
            }}
          />
          <p className="text-[12px] leading-relaxed text-muted">
            The parent owns the value and decides what a click means.
          </p>
        </div>
      </div>

      <EventLog entries={entries} onClear={log.clear} title="onChange" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Click 5 stars on each. The uncontrolled one goes to 5 because nothing can stop it.
        The controlled one clamps to {CAP} — same component, same click, different owner.
        Turn the cap off and it accepts 5 again.
      </p>
    </div>
  );
}
