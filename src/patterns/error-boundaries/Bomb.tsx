import { useEffect } from "react";
import type { EventLogControl } from "../../lab/useEventLog";

export type ThrowWhen = "never" | "render" | "effect" | "handler";

/**
 * A component that fails on demand, in each of the places a component can fail.
 *
 * Boundaries catch errors thrown while React is rendering or committing — the render body
 * and effects. They do not catch errors from event handlers, timeouts, or promise
 * rejections, because by the time those run React is no longer on the stack and has no
 * render to replace.
 */
export function Bomb({
  when,
  log,
}: {
  when: ThrowWhen;
  log: EventLogControl;
}) {
  // Declared before the throw below, so the hook order stays stable.
  useEffect(() => {
    if (when === "effect") {
      log.add("throwing from an effect", "accent");
      throw new Error("Thrown from an effect");
    }
  }, [when, log]);

  if (when === "render") {
    throw new Error("Thrown during render");
  }

  return (
    <div className="space-y-2 rounded border border-line p-3">
      <p className="text-[13px] text-fg">Widget is fine.</p>
      <button
        type="button"
        onClick={() => {
          log.add("throwing from a click handler", "warn");
          throw new Error("Thrown from an event handler");
        }}
        className="rounded border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent-line hover:text-fg"
      >
        Throw from this click
      </button>
      <p className="font-mono text-[10px] text-muted">
        the boundary will not catch that one
      </p>
    </div>
  );
}
