import { lazy, Suspense, useMemo, useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { delay } from "../../lab/fakeApi";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import type { EventLogControl } from "../../lab/useEventLog";

export default function Demo() {
  const [preload, setPreload] = useState(true);
  const [round, setRound] = useState(0);
  const [entries, log] = useEventLog();

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label="preload on hover / focus"
          checked={preload}
          onChange={setPreload}
        />
        <Knobs.Action
          label="Reset"
          onClick={() => {
            setRound((n) => n + 1);
            log.clear();
          }}
        />
      </Knobs>

      {/* Remounting is what resets the loader, so no cache-buster has to ride along
          in a dependency array pretending to be a real dependency. */}
      <Loader key={round} preload={preload} log={log} />

      <EventLog entries={entries} onClear={log.clear} title="Chunk timeline" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        With preloading on, hover the button for a moment before clicking: the chunk is
        already on its way and the editor appears with little or no waiting. Turn it off,
        press Reset, and click straight away — now you watch the fallback for the full
        delay. The trace timestamps show how much head start the hover bought.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The insight is that intent precedes action. A hover, a focus, a touch-start, or a
        link scrolling into view all announce “this is probably next” a few hundred
        milliseconds before the click, which is enough time to have the code ready.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Preload on intent, not on mount — loading everything eagerly gives back exactly the
        bytes the code split was meant to save.
      </p>
    </div>
  );
}

function Loader({
  preload,
  log,
}: {
  preload: boolean;
  log: EventLogControl;
}) {
  const [open, setOpen] = useState(false);
  const [headStart, setHeadStart] = useState(0);

  /*
    One loader, referenced twice — by the hover trigger and by `lazy`.

    The cached promise is what makes this work. Both callers get the *same* promise, so
    hovering starts the download and rendering joins it instead of starting a second one.
    Without the cache, `load()` would begin again at render and the head start would be
    thrown away.

    `requestedAt` is recorded so the demo can report the real head start rather than
    assert one — with preloading off it is zero, because the click is what started it.
  */
  const { load, Lazy, requestedAt } = useMemo(() => {
    let pending: Promise<typeof import("./HeavyEditor")> | undefined;
    let startedAt: number | null = null;

    const load = () => {
      if (!pending) {
        startedAt = performance.now();
        log.add("chunk requested", "accent");
        pending = delay(900).then(() => import("./HeavyEditor"));
      }
      return pending;
    };

    return { load, Lazy: lazy(load), requestedAt: () => startedAt };
  }, [log]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onMouseEnter={preload ? () => void load() : undefined}
          onFocus={preload ? () => void load() : undefined}
          onClick={() => {
            // Measured before the click starts anything, so an un-preloaded chunk
            // honestly reports a head start of zero.
            const startedAt = requestedAt();
            setHeadStart(
              startedAt === null
                ? 0
                : Math.round(performance.now() - startedAt),
            );
            log.add("user opened the editor", "warn");
            setOpen(true);
          }}
          className="rounded border border-line px-3 py-1.5 font-mono text-[12px] text-fg transition-colors hover:border-accent-line"
        >
          Open editor
        </button>

        <span className="font-mono text-[11px] text-muted">
          {preload ? "hover for a second, then click" : "click straight away"}
        </span>
      </div>

      {open && (
        <Suspense
          fallback={
            <p className="rounded border border-dashed border-line px-3 py-6 text-center font-mono text-[11px] text-muted">
              waiting for the chunk…
            </p>
          }
        >
          <Lazy headStart={headStart} />
        </Suspense>
      )}
    </div>
  );
}
