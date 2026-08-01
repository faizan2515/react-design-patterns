import { useEffect, useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import { bus } from "./emitter";

export default function Demo() {
  const [subscribers, setSubscribers] = useState(2);
  const [entries, log] = useEventLog();

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Range
          label="Subscribers"
          value={subscribers}
          onChange={setSubscribers}
          min={0}
          max={4}
        />
        <Knobs.Action
          label="emit notice"
          onClick={() => {
            const reached = bus.emit("notice", `ping at ${Date.now() % 10000}`);
            log.add(`emitted → reached ${reached} subscriber(s)`, "accent");
          }}
        />
      </Knobs>

      <div className="grid gap-2 sm:grid-cols-2">
        {Array.from({ length: subscribers }, (_, index) => (
          <Subscriber key={index} name={`Subscriber ${index + 1}`} />
        ))}
        {subscribers === 0 && (
          <p className="font-mono text-[11px] text-muted">
            Nobody is listening — emitting is a no-op, and the emitter neither knows nor
            cares.
          </p>
        )}
      </div>

      <EventLog entries={entries} onClear={log.clear} title="Bus" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Add and remove subscribers and keep emitting. The emitter has no idea who is
        listening, and the listeners have no idea about each other — that decoupling is the
        whole pattern, and it is what React's own <code className="text-fg">subscribe</code>{" "}
        APIs are built on.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Each subscription returns its own unsubscribe, which the effect returns as cleanup.
        Forget that and every remount adds another handler to a set that is never emptied —
        the classic listener leak, where an event fires once and runs eleven times.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The cost is invisible wiring. With props you can read the tree and see who receives
        what; with a bus you search for the event name and hope you found every subscriber.
        Prefer props and context until the coupling genuinely hurts — and when you do wire
        an emitter into React, use{" "}
        <code className="text-fg">useSyncExternalStore</code> rather than an effect that
        calls <code className="text-fg">setState</code>.
      </p>
    </div>
  );
}

function Subscriber({ name }: { name: string }) {
  const [received, setReceived] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // The emitter hands back an unsubscribe, so cleanup is a one-liner.
    return bus.on("notice", (message) => {
      setReceived(message);
      setCount((n) => n + 1);
    });
  }, []);

  return (
    <div className="space-y-1 rounded-md border border-line p-3">
      <p className="font-mono text-[11px] text-muted">{name}</p>
      <p className="font-mono text-[12px] text-fg">{received ?? "—"}</p>
      <p className="font-mono text-[10px] text-muted">{count} received</p>
    </div>
  );
}
