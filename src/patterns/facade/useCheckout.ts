import { useCallback, useMemo, useState } from "react";
import { fakeRequest } from "../../lab/fakeApi";
import type { EventLogControl } from "../../lab/useEventLog";

export interface Line {
  id: number;
  name: string;
  price: number;
  qty: number;
}

/**
 * Facade: one small interface in front of several collaborating parts.
 *
 * Behind this hook there are four separate concerns — a cart, a pricing calculation, a
 * discount lookup and a payment call — each with its own state and failure mode. A screen
 * that wired them together itself would carry all four, plus the rules about their order.
 *
 * The facade does not hide them because they are secret. It hides them because a caller
 * only needs `lines`, `total` and `checkout()`, and everything else is detail it would
 * otherwise have to keep correct.
 */
export function useCheckout(log: EventLogControl) {
  const [lines, setLines] = useState<Line[]>([
    { id: 1, name: "Keyboard", price: 129, qty: 1 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState<"idle" | "pricing" | "paying" | "done" | "failed">(
    "idle",
  );

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const total = Math.round(subtotal * (1 - discount / 100));

  const add = useCallback((line: Omit<Line, "qty">) => {
    setLines((current) => {
      const existing = current.find((l) => l.id === line.id);
      return existing
        ? current.map((l) => (l.id === line.id ? { ...l, qty: l.qty + 1 } : l))
        : [...current, { ...line, qty: 1 }];
    });
  }, []);

  /* Three subsystems, one call, one ordered sequence the caller never sees. */
  const checkout = useCallback(async () => {
    try {
      setStatus("pricing");
      log.add("looking up discounts", "accent");
      const found = await fakeRequest(10, { latency: 500 });
      setDiscount(found);

      setStatus("paying");
      log.add(`taking payment with ${found}% off`, "accent");
      await fakeRequest(true, { latency: 700 });

      setStatus("done");
      log.add("payment confirmed");
    } catch {
      setStatus("failed");
      log.add("checkout failed", "warn");
    }
  }, [log]);

  const reset = useCallback(() => {
    setDiscount(0);
    setStatus("idle");
  }, []);

  return useMemo(
    () => ({ lines, subtotal, discount, total, status, add, checkout, reset }),
    [lines, subtotal, discount, total, status, add, checkout, reset],
  );
}
