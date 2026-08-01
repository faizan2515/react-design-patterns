import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import { useCheckout } from "./useCheckout";

const CATALOGUE = [
  { id: 1, name: "Keyboard", price: 129 },
  { id: 2, name: "Monitor arm", price: 84 },
  { id: 3, name: "Desk mat", price: 32 },
];

export default function Demo() {
  const [entries, log] = useEventLog();
  const checkout = useCheckout(log);

  return (
    <div className="space-y-4">
      <Knobs>
        {CATALOGUE.map((item) => (
          <Knobs.Action
            key={item.id}
            label={`+ ${item.name}`}
            onClick={() => checkout.add(item)}
          />
        ))}
        <Knobs.Action label="Checkout" onClick={() => void checkout.checkout()} />
        <Knobs.Action label="Reset" onClick={checkout.reset} />
      </Knobs>

      <div className="space-y-2 rounded-md border border-line p-3">
        <ul className="divide-y divide-line">
          {checkout.lines.map((line) => (
            <li key={line.id} className="flex gap-3 py-1.5 text-[13px]">
              <span className="flex-1 text-fg">{line.name}</span>
              <span className="font-mono text-[11px] text-muted">×{line.qty}</span>
              <span className="font-mono text-[11px] tabular-nums text-muted">
                £{line.price * line.qty}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-line pt-2">
          <span className="font-mono text-[11px] text-muted">
            {checkout.status}
            {checkout.discount > 0 && ` · ${checkout.discount}% off`}
          </span>
          <span className="font-mono text-[16px] tabular-nums text-fg">
            £{checkout.total}
          </span>
        </div>
      </div>

      <EventLog entries={entries} onClear={log.clear} title="Behind the facade" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        The component calls <code className="text-fg">checkout()</code>. Behind it, three
        subsystems run in a required order — discount lookup, then payment, then
        confirmation — each with its own state and failure path. The trace shows the work;
        the component never had to know about it.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        A facade does not hide things because they are secret. It hides them because a
        caller only needs <code className="text-fg">lines</code>,{" "}
        <code className="text-fg">total</code> and{" "}
        <code className="text-fg">checkout()</code>, and everything else is detail it would
        otherwise be responsible for keeping correct.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Most well-named custom hooks are facades. The failure mode is the leaky one — a
        hook returning fourteen values, half of them internal, so callers reach past it and
        the boundary stops meaning anything. If the return type is hard to name, the facade
        is not finished.
      </p>
    </div>
  );
}
