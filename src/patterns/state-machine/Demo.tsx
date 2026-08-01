import { useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { useEventLog } from "../../lab/useEventLog";
import { LABELS, MACHINE, allowed, transition } from "./checkoutMachine";
import type { CheckoutEvent, CheckoutState } from "./checkoutMachine";

const ALL_EVENTS: CheckoutEvent[] = [
  "NEXT",
  "BACK",
  "SUBMIT",
  "RESOLVE",
  "REJECT",
  "RETRY",
  "RESTART",
];

const STATES = Object.keys(MACHINE) as CheckoutState[];

export default function Demo() {
  const [state, setState] = useState<CheckoutState>("cart");
  const [entries, log] = useEventLog();

  const permitted = allowed(state);

  function send(event: CheckoutEvent) {
    const next = transition(state, event);
    if (next === state) {
      log.add(`${event} ignored — not valid in ${state}`, "warn");
      return;
    }
    log.add(`${state} --${event}--> ${next}`, "accent");
    setState(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {STATES.map((candidate) => (
          <span
            key={candidate}
            className={`rounded border px-2.5 py-1 font-mono text-[11px] ${
              candidate === state
                ? "border-accent-line bg-accent-soft text-fg"
                : "border-line text-muted"
            }`}
          >
            {candidate}
          </span>
        ))}
      </div>

      <div className="rounded-md border border-line p-4">
        <p className="font-mono text-[11px] text-muted">current</p>
        <p className="mt-1 text-[18px] text-fg">{LABELS[state]}</p>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-[11px] text-muted">
          Every event — disabled ones are impossible from here
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ALL_EVENTS.map((event) => {
            const ok = permitted.includes(event);
            return (
              <button
                key={event}
                type="button"
                onClick={() => send(event)}
                className={`rounded border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  ok
                    ? "border-line text-fg hover:border-accent-line"
                    : "border-line text-muted opacity-40"
                }`}
              >
                {event}
              </button>
            );
          })}
        </div>
      </div>

      <EventLog entries={entries} onClear={log.clear} title="Transitions" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        The dimmed buttons are not disabled by a rule someone remembered to write — they
        are dim because the machine has no transition for them from this state. Press one
        anyway and nothing happens, which is the point: illegal states are unreachable
        rather than merely guarded against.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Get to <code className="text-fg">submitting</code> and try{" "}
        <code className="text-fg">BACK</code> or a second{" "}
        <code className="text-fg">SUBMIT</code>. Both are ignored. With
        booleans this is the double-submit bug and the go-back-mid-request bug, each
        needing its own guard; here neither exists to fix.
      </p>
    </div>
  );
}
