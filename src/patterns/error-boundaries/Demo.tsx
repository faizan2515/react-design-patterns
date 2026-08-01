import { useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import { Bomb } from "./Bomb";
import type { ThrowWhen } from "./Bomb";
import { ErrorBoundary } from "./ErrorBoundary";

const WHEN = [
  { value: "never", label: "never" },
  { value: "render", label: "during render" },
  { value: "effect", label: "in an effect" },
] as const;

export default function Demo() {
  const [when, setWhen] = useState<ThrowWhen>("never");
  const [entries, log] = useEventLog();

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice
          label="Widget throws"
          value={when === "handler" ? "never" : when}
          onChange={setWhen}
          options={WHEN}
        />
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="font-mono text-[11px] text-muted">Inside a boundary</p>
          {/*
            Keying the boundary on `when` gives each run a fresh boundary, so switching
            back to "never" clears a previous failure instead of leaving the fallback up.
          */}
          <ErrorBoundary
            key={when}
            onError={(message) => log.add(message, "accent")}
            fallback={(error, retry) => (
              <div className="space-y-2 rounded border border-accent-line bg-accent-soft p-3">
                <p className="text-[13px] text-fg">This widget crashed.</p>
                <p className="font-mono text-[10px] text-muted">{error.message}</p>
                <button
                  type="button"
                  onClick={() => {
                    setWhen("never");
                    retry();
                  }}
                  className="rounded border border-accent-line px-2.5 py-1 font-mono text-[11px] text-fg"
                >
                  Fix and retry
                </button>
              </div>
            )}
          >
            <Bomb when={when} log={log} />
          </ErrorBoundary>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-[11px] text-muted">The rest of the page</p>
          <div className="rounded border border-line p-3">
            <p className="text-[13px] text-fg">Still here, still interactive.</p>
            <p className="mt-2 font-mono text-[10px] text-muted">
              A boundary contains the damage to its own subtree. Without one, an error
              during render unmounts the entire tree and leaves a blank page.
            </p>
          </div>
        </div>
      </div>

      <EventLog entries={entries} onClear={log.clear} title="Boundary" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Render and effect errors are caught, and the fallback offers a way back. The button
        inside the widget throws from a click handler instead — React is not on the stack
        by then, so the boundary never sees it and the error goes to the console. In
        development your dev-server overlay will appear, which is itself the proof it was
        never caught. Handlers need their own <code className="text-fg">try/catch</code>.
      </p>
    </div>
  );
}
