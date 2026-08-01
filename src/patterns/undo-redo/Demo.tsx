import { useEffect } from "react";
import { Knobs } from "../../lab/Knobs";
import { useHistory } from "./useHistory";

interface Dot {
  id: number;
  x: number;
  y: number;
}

const COLOURS = ["bg-accent", "bg-accent-soft"];

export default function Demo() {
  const history = useHistory<Dot[]>([]);
  const { present: dots, commit, undo, redo, canUndo, canRedo, depth } = history;

  /* Editor keyboard shortcuts, because undo without Ctrl+Z is not really undo. */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "z") {
        return;
      }
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Action label="Undo · Ctrl+Z" onClick={undo} />
        <Knobs.Action label="Redo · Ctrl+Shift+Z" onClick={redo} />
        <Knobs.Action label="Clear history" onClick={history.clear} />
        <Knobs.Readout label="past">{depth.past}</Knobs.Readout>
        <Knobs.Readout label="future">{depth.future}</Knobs.Readout>
      </Knobs>

      <div
        onClick={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          commit([
            ...dots,
            {
              id: Date.now(),
              x: event.clientX - box.left,
              y: event.clientY - box.top,
            },
          ]);
        }}
        className="relative h-52 cursor-crosshair overflow-hidden rounded-md border border-line bg-surface-2"
      >
        {dots.length === 0 && (
          <p className="grid h-full place-items-center font-mono text-[11px] text-muted">
            Click to place dots
          </p>
        )}

        {dots.map((dot, index) => (
          <span
            key={dot.id}
            style={{ left: dot.x, top: dot.y }}
            className={`absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${
              COLOURS[index % COLOURS.length]
            }`}
          />
        ))}
      </div>

      <div className="flex gap-3 font-mono text-[11px] text-muted">
        <span>{canUndo ? "can undo" : "nothing to undo"}</span>
        <span>·</span>
        <span>{canRedo ? "can redo" : "nothing to redo"}</span>
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Place a few dots, undo twice, then place another. The redo stack empties — you
        branched the timeline, and the branch you did not take is gone. Every editor
        behaves this way, and it falls out of the reducer rather than being a rule someone
        added.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Each entry here is a full snapshot of the dots, which is the Memento pattern:
        undoing moves a value between stacks and there is nothing to reverse. The Command
        alternative stores operations with their inverses — far more compact for a large
        document, and far more work, because every action needs an undo written and kept
        correct. Snapshots win whenever the state is small enough to copy.
      </p>
    </div>
  );
}
