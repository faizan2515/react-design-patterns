import { useOptimistic, useState, useTransition } from "react";
import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import { fakeRequest } from "../../lab/fakeApi";

export default function Demo() {
  const [likes, setLikes] = useState(12);
  const [shouldFail, setShouldFail] = useState(false);
  const [latency, setLatency] = useState(900);
  const [entries, log] = useEventLog();
  const [pending, startTransition] = useTransition();

  /*
    `useOptimistic` returns the confirmed value plus a way to layer a guess on top of it.
    The guess survives only as long as the transition that produced it — when the action
    settles, React discards it and falls back to the real state.

    That is the part worth understanding: there is no rollback code here. Failure is not
    handled by undoing the optimistic value, it is handled by never committing it.
  */
  const [shownLikes, addOptimisticLike] = useOptimistic(
    likes,
    (current: number, delta: number) => current + delta,
  );

  function like() {
    startTransition(async () => {
      addOptimisticLike(1);
      log.add("optimistic +1 shown immediately", "accent");

      try {
        const confirmed = await fakeRequest(likes + 1, {
          latency,
          fail: shouldFail,
        });
        setLikes(confirmed);
        log.add(`server confirmed ${confirmed}`);
      } catch {
        log.add("server rejected — optimistic value discarded", "warn");
      }
    });
  }

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label="server rejects the like"
          checked={shouldFail}
          onChange={setShouldFail}
        />
        <Knobs.Range
          label="Network"
          value={latency}
          onChange={setLatency}
          min={200}
          max={2500}
          step={100}
          unit="ms"
        />
      </Knobs>

      <div className="flex items-center gap-4 rounded-md border border-line p-4">
        <button
          type="button"
          onClick={like}
          className="rounded border border-line px-3 py-1.5 font-mono text-[12px] text-fg transition-colors hover:border-accent-line"
        >
          ♥ Like
        </button>

        <span className="font-mono text-[22px] tabular-nums text-fg">
          {shownLikes}
        </span>

        <span className="font-mono text-[11px] text-muted">
          {pending ? "in flight…" : "settled"}
        </span>

        <span className="font-mono text-[11px] text-muted">
          confirmed: <span className="text-fg tabular-nums">{likes}</span>
        </span>
      </div>

      <EventLog entries={entries} onClear={log.clear} title="Request lifecycle" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Turn the network up and click. The count moves at once while the request is still
        in flight, and the confirmed value catches up when the server answers. Now make the
        server reject: the count snaps back on its own.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        There is no rollback code in this file, and that is the design. The optimistic
        value only exists for the duration of the transition that produced it — a failure
        is not undone, it is simply never committed. Rolling back by hand is where
        hand-rolled optimistic updates usually go wrong, because the compensating update
        has to be correct for every interleaving of concurrent requests.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Note the action must run inside a transition. Outside one there is no pending scope
        for the optimistic value to belong to, so it is discarded immediately and you see
        nothing.
      </p>
    </div>
  );
}
