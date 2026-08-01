import { useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import { Modal } from "./Modal";
import { Tooltip } from "./Tooltip";

export default function Demo() {
  const [portaled, setPortaled] = useState(false);
  const [open, setOpen] = useState(false);
  const [entries, log] = useEventLog();

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle
          label="tooltip uses a portal"
          checked={portaled}
          onChange={setPortaled}
        />
        <Knobs.Action label="Open modal" onClick={() => setOpen(true)} />
      </Knobs>

      {/*
        A clipping container — exactly like a scroll area, a card with rounded corners, or
        a table cell. The anchor sits near the bottom edge so its tooltip has to overflow.
      */}
      <div
        onClick={() => log.add("React parent's onClick fired", "accent")}
        className="relative h-28 overflow-hidden rounded-md border border-line bg-surface-2 p-3"
      >
        <p className="font-mono text-[11px] text-muted">
          overflow: hidden — the tooltip is anchored to the badge below
        </p>

        <div className="absolute bottom-3 left-3">
          <Tooltip
            portaled={portaled}
            label="Anchored here — and clickable"
          >
            <span className="rounded border border-line bg-surface px-2 py-1 font-mono text-[11px] text-fg">
              anchor
            </span>
          </Tooltip>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <p className="text-[13px] text-fg">
          Rendered into <code>document.body</code>, so no ancestor's overflow or z-index
          can clip it.
        </p>
        <p className="text-[12px] text-muted">
          Escape closes it; focus moved here on open and returns to the trigger on close.
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded border border-line px-2.5 py-1 font-mono text-[11px] text-muted hover:border-accent-line hover:text-fg"
        >
          Close
        </button>
      </Modal>

      <EventLog entries={entries} onClear={log.clear} title="Event bubbling" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        With the portal off, the tooltip is cut off at the box's edge. Turn it on and the
        same tooltip appears in the same place, uncut — it is no longer a DOM descendant,
        so no ancestor can clip it.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Now click the portaled tooltip and watch the trace: the parent's{" "}
        <code className="text-fg">onClick</code> still fires. A portal moves the DOM node,
        not the React tree, so events bubble through React parents and context still
        reaches inside.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Note what the portal costs: leaving the DOM tree also leaves the containing block
        that used to position the tooltip, so its coordinates have to be measured and
        re-measured on scroll and resize. That bookkeeping is why real tooltip libraries
        ship a positioning engine rather than a call to{" "}
        <code className="text-fg">createPortal</code>.
      </p>
    </div>
  );
}
