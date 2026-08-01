import { useState } from "react";
import { PEOPLE } from "../../lab/data";
import { Knobs } from "../../lab/Knobs";
import { FORMATS, SORTS } from "./strategies";

export default function Demo() {
  const [sort, setSort] = useState("by name");
  const [format, setFormat] = useState("plain");

  /* The component never branches on which sort or format is active — it just calls them. */
  const rows = [...PEOPLE].sort(SORTS[sort]).map(FORMATS[format]);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice
          label="Sort"
          value={sort}
          onChange={setSort}
          options={Object.keys(SORTS).map((k) => ({ value: k, label: k }))}
        />
        <Knobs.Choice
          label="Format"
          value={format}
          onChange={setFormat}
          options={Object.keys(FORMATS).map((k) => ({ value: k, label: k }))}
        />
      </Knobs>

      <ul className="divide-y divide-line rounded-md border border-line">
        {rows.map((row, index) => (
          <li key={index} className="px-3 py-1.5 font-mono text-[12px] text-fg">
            {row}
          </li>
        ))}
      </ul>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Sixteen combinations, and the component contains no conditional for any of them —
        it calls whichever functions it was handed. Adding a fifth sort means adding a
        function to the record; nothing that renders has to change.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        In a class language this pattern is an interface with several implementations. In
        JavaScript a strategy is just a function, so the pattern collapses into “pass the
        function in” — which is why React code is full of Strategy without ever calling it
        that. Every <code className="text-fg">comparator</code>,{" "}
        <code className="text-fg">renderItem</code> and{" "}
        <code className="text-fg">validate</code> prop is one.
      </p>
    </div>
  );
}
