import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { PropSlotCard, SlotCard } from "./Card";

export default function Demo() {
  const [footer, setFooter] = useState(true);
  const [swapped, setSwapped] = useState(false);

  const title = <span className="text-[13px] text-fg">Deployment</span>;
  const action = (
    <button
      type="button"
      className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-muted"
    >
      Roll back
    </button>
  );

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Toggle label="footer" checked={footer} onChange={setFooter} />
        <Knobs.Toggle
          label="swap header and footer"
          checked={swapped}
          onChange={setSwapped}
        />
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="font-mono text-[11px] text-muted">Props as slots</p>
          <PropSlotCard
            header={swapped ? action : title}
            footer={footer ? (swapped ? title : action) : undefined}
          >
            Regions are named in the type signature, so omitting the footer is a
            documented option rather than an accident.
          </PropSlotCard>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-[11px] text-muted">Children as slots</p>
          <SlotCard>
            <SlotCard.Header>{swapped ? action : title}</SlotCard.Header>
            <SlotCard.Body>
              Regions are components, so the card takes any number of them in any order —
              and the compiler cannot tell you a header is missing.
            </SlotCard.Body>
            {footer && (
              <SlotCard.Footer>{swapped ? title : action}</SlotCard.Footer>
            )}
          </SlotCard>
        </div>
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Both render the same card. The difference is where the contract lives: on the left
        it is in the type, checkable and finite; on the right it is in the markup, flexible
        and unchecked. Prefer props while the regions are few and required — reach for
        children when callers need to vary how many there are or where they go.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Neither version inspects <code className="text-fg">children</code> at runtime.
        Filtering children by type to find the header looks clever and breaks the moment
        someone wraps one in a fragment or a conditional.
      </p>
    </div>
  );
}
