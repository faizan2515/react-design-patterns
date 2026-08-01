import { useReducer, useState } from "react";
import { EventLog } from "../../lab/EventLog";
import { Knobs } from "../../lab/Knobs";
import { useEventLog } from "../../lab/useEventLog";
import {
  CATALOGUE,
  EMPTY_CART,
  cartReducer,
  cartTotal,
  describe,
} from "./cartReducer";
import type { CartAction, CartState } from "./cartReducer";

export default function Demo() {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART);
  const [history, setHistory] = useState<CartAction[]>([]);
  const [replayed, setReplayed] = useState<CartState | null>(null);
  const [entries, log] = useEventLog();

  /* One place that dispatches, so recording the action log costs nothing extra. */
  function send(action: CartAction) {
    dispatch(action);
    setHistory((past) => [...past, action]);
    setReplayed(null);
    log.add(describe(action), "accent");
  }

  /*
    The reducer is a pure function, so folding the recorded actions over the initial state
    must reproduce the current state exactly. This is not a trick — it is what makes undo,
    time-travel debugging and optimistic replay possible at all.
  */
  function replay() {
    setReplayed(history.reduce(cartReducer, EMPTY_CART));
    log.add(`replayed ${history.length} actions from an empty cart`, "warn");
  }

  const matches = replayed !== null && cartTotal(replayed) === cartTotal(state);

  return (
    <div className="space-y-4">
      <Knobs>
        {CATALOGUE.map((product) => (
          <Knobs.Action
            key={product.id}
            label={`Add ${product.name.split(" ")[0].toLowerCase()}`}
            onClick={() => send({ type: "added", productId: product.id })}
          />
        ))}
        <Knobs.Action
          label="10% off"
          onClick={() => send({ type: "couponApplied", percent: 10 })}
        />
        <Knobs.Action label="Clear" onClick={() => send({ type: "cleared" })} />
      </Knobs>

      <div className="rounded-md border border-line p-3">
        {state.lines.length === 0 ? (
          <p className="text-[13px] text-muted">Cart is empty.</p>
        ) : (
          <ul className="divide-y divide-line">
            {state.lines.map((line) => (
              <li key={line.id} className="flex items-center gap-3 py-2">
                <span className="flex-1 text-[13px] text-fg">{line.name}</span>
                <div className="flex items-center gap-1">
                  <Step
                    label="−"
                    onClick={() =>
                      send({
                        type: "quantityChanged",
                        productId: line.id,
                        delta: -1,
                      })
                    }
                  />
                  <span className="w-6 text-center font-mono text-[12px] tabular-nums text-fg">
                    {line.qty}
                  </span>
                  <Step
                    label="+"
                    onClick={() =>
                      send({
                        type: "quantityChanged",
                        productId: line.id,
                        delta: 1,
                      })
                    }
                  />
                </div>
                <span className="w-16 text-right font-mono text-[12px] tabular-nums text-muted">
                  £{line.price * line.qty}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="font-mono text-[11px] text-muted">
            {state.discount > 0 && `${state.discount}% off · `}total
          </span>
          <span className="font-mono text-[15px] tabular-nums text-fg">
            £{cartTotal(state)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={replay}
          disabled={history.length === 0}
          className="rounded border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:border-accent-line hover:text-fg disabled:opacity-40"
        >
          Replay {history.length} actions from empty
        </button>

        {replayed !== null && (
          <span
            className={`font-mono text-[11px] ${matches ? "text-accent" : "text-fg"}`}
          >
            {matches
              ? `£${cartTotal(replayed)} — identical`
              : `£${cartTotal(replayed)} — differs`}
          </span>
        )}
      </div>

      <EventLog entries={entries} onClear={log.clear} title="Dispatched actions" />

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Every button sends an action describing what happened, and one pure function decides
        what that means. Add a few things, then replay: folding the same actions over an
        empty cart reproduces the same total, because the reducer has nowhere to hide state.
        That property is what undo, time-travel debugging and optimistic updates are built on.
      </p>
    </div>
  );
}

function Step({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="size-5 rounded border border-line font-mono text-[11px] text-muted transition-colors hover:border-accent-line hover:text-fg"
    >
      {label}
    </button>
  );
}
