import { useState } from "react";
import { manyPeople } from "../../lab/data";
import { Knobs } from "../../lab/Knobs";
import { useVirtual } from "./useVirtual";

const ROW = 32;
const ALL = manyPeople(10_000);

export default function Demo() {
  const [virtual, setVirtual] = useState(true);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle label="virtualized" checked={virtual} onChange={setVirtual} />
        <Knobs.Readout label="rows">{ALL.length.toLocaleString()}</Knobs.Readout>
      </Knobs>

      {virtual ? <VirtualList /> : <PlainList />}

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Ten thousand rows either way. Virtualized, only the ones in view exist in the DOM —
        scroll and watch the rendered count stay flat while the row numbers climb. Turn it
        off and all ten thousand are created at once; the toggle itself takes a noticeable
        moment, and scrolling gets heavier.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The trick is a spacer of the full height so the scrollbar is honest, with the
        visible slice translated into position. Fixed row heights keep the maths to
        arithmetic. Variable heights are where this gets hard and where a library earns its
        weight — it has to measure rows as they appear and correct the scroll offset
        without the content jumping under the user.
      </p>
    </div>
  );
}

function VirtualList() {
  const [ref, window] = useVirtual(ALL.length, ROW);
  const rows = ALL.slice(window.start, window.end);

  return (
    <>
      <div
        ref={ref}
        className="h-64 overflow-y-auto rounded-md border border-line"
      >
        {/* Full-height spacer: the scrollbar reflects all 10,000 rows. */}
        <div style={{ height: window.totalHeight, position: "relative" }}>
          <div style={{ transform: `translateY(${window.offset}px)` }}>
            {rows.map((person) => (
              <Row key={person.id} index={person.id} name={person.name} />
            ))}
          </div>
        </div>
      </div>

      <p className="font-mono text-[11px] text-muted">
        rendered rows: <span className="text-fg">{rows.length}</span> · showing{" "}
        {window.start.toLocaleString()}–{window.end.toLocaleString()}
      </p>
    </>
  );
}

function PlainList() {
  return (
    <>
      <div className="h-64 overflow-y-auto rounded-md border border-line">
        {ALL.map((person) => (
          <Row key={person.id} index={person.id} name={person.name} />
        ))}
      </div>

      <p className="font-mono text-[11px] text-accent">
        rendered rows: {ALL.length.toLocaleString()} — all of them
      </p>
    </>
  );
}

function Row({ index, name }: { index: number; name: string }) {
  return (
    <div
      style={{ height: ROW }}
      className="flex items-center gap-3 border-b border-line px-3"
    >
      <span className="w-12 font-mono text-[10px] text-muted">{index}</span>
      <span className="text-[13px] text-fg">{name}</span>
    </div>
  );
}
