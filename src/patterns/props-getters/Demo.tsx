import { useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import { useDisclosure } from "./useDisclosure";

export default function Demo() {
  const [veto, setVeto] = useState(false);
  const [entries, log] = useEventLog();
  const { open, getButtonProps, getPanelProps } = useDisclosure();

  /* The caller's own props go through the getter, which merges rather than replaces. */
  const buttonProps = getButtonProps({
    onClick: (event) => {
      log.add("caller's onClick ran first", "accent");
      if (veto) {
        event.preventDefault();
        log.add("caller called preventDefault — toggle skipped", "warn");
      }
    },
    className: `rounded border px-3 py-1.5 font-mono text-[12px] transition-colors ${
      open ? "border-accent-line text-fg" : "border-line text-muted hover:text-fg"
    }`,
  });

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label="caller vetoes the toggle"
          checked={veto}
          onChange={setVeto}
        />
      </Knobs>

      <div className="space-y-3">
        <button {...buttonProps}>{open ? "Hide details" : "Show details"}</button>

        <div
          {...getPanelProps({
            className: "rounded border border-line p-3 text-[13px] text-muted",
          })}
        >
          The panel got its id, role and labelling from the getter. The button got the
          matching <code className="text-fg">aria-controls</code> and{" "}
          <code className="text-fg">aria-expanded</code> without anyone remembering to
          write them.
        </div>
      </div>

      <div className="rounded-md border border-line bg-surface-2 p-3">
        <p className="u-label text-[9.5px] text-muted">Props produced for the button</p>
        <pre className="mt-2 overflow-x-auto font-mono text-[11px] text-fg">
          {JSON.stringify(
            {
              id: buttonProps.id,
              type: buttonProps.type,
              "aria-expanded": buttonProps["aria-expanded"],
              "aria-controls": buttonProps["aria-controls"],
              onClick: "[composed]",
            },
            null,
            2,
          )}
        </pre>
      </div>

      <EventLog entries={entries} onClear={log.clear} title="Click order" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Click the button. Your handler runs first, then the component's — unless you call{" "}
        <code className="text-fg">preventDefault()</code>, which cancels the built-in
        behaviour without cancelling anything else. Turn the veto on and the panel stops
        responding while your handler keeps firing.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Returning loose values instead would push all of this onto every caller: the
        toggle, the ids, the ARIA pairing, and remembering to call both handlers. A getter
        makes the correct wiring the default and still leaves it overridable.
      </p>
    </div>
  );
}
