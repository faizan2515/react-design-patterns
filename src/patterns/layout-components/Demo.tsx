import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { Grid, Row, Stack } from "./layout";

const LAYOUTS = [
  { value: "stack", label: "Stack" },
  { value: "row", label: "Row" },
  { value: "grid", label: "Grid" },
] as const;

type Layout = (typeof LAYOUTS)[number]["value"];

export default function Demo() {
  const [layout, setLayout] = useState<Layout>("stack");
  const [gap, setGap] = useState(2);
  const [margins, setMargins] = useState(false);

  const cards = ["Overview", "Activity", "Settings", "Billing"].map((label) => (
    <Card key={label} label={label} margin={margins} />
  ));

  const gapValue = gap as 0 | 1 | 2 | 3 | 4;

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice
          label="Layout"
          value={layout}
          onChange={setLayout}
          options={LAYOUTS}
        />
        <Knobs.Range label="Gap" value={gap} onChange={setGap} min={0} max={4} />
        <Knobs.Toggle
          label="children carry their own margins"
          checked={margins}
          onChange={setMargins}
        />
      </Knobs>

      <div className="rounded-md border border-line p-3">
        {layout === "stack" && <Stack gap={gapValue}>{cards}</Stack>}
        {layout === "row" && <Row gap={gapValue}>{cards}</Row>}
        {layout === "grid" && <Grid gap={gapValue}>{cards}</Grid>}
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        The same four cards, rearranged by swapping the container. None of them knows
        which layout it is in, so none had to change — the parent owns the arrangement and
        the spacing.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Turn on the margins knob to see the alternative: now each card carries a
        bottom margin of its own. Set the gap to zero and the spacing is still there, in
        the wrong axis for Row and doubled up in Grid — because a margin is an opinion
        about neighbours the component cannot see.
      </p>
    </div>
  );
}

function Card({ label, margin }: { label: string; margin: boolean }) {
  return (
    <div
      className={`rounded border border-line bg-surface-2 px-3 py-2 text-[13px] text-fg ${
        margin ? "mb-4" : ""
      }`}
    >
      {label}
    </div>
  );
}
