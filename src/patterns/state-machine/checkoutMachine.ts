export type CheckoutState =
  | "cart"
  | "address"
  | "payment"
  | "submitting"
  | "confirmed"
  | "failed";

export type CheckoutEvent =
  | "NEXT"
  | "BACK"
  | "SUBMIT"
  | "RESOLVE"
  | "REJECT"
  | "RETRY"
  | "RESTART";

/**
 * The machine: for each state, the events it accepts and where each one leads.
 *
 * Everything not listed is impossible by construction. You cannot go BACK from
 * `submitting`, cannot SUBMIT twice, cannot reach `confirmed` without passing through
 * payment — not because a guard checks for it, but because the transition does not exist.
 *
 * Compare with the usual `isLoading`/`isError`/`isConfirmed` booleans: three booleans
 * describe eight combinations, most of them nonsense, and every render has to defend
 * against states like "loading and confirmed at once".
 */
export const MACHINE: Record<
  CheckoutState,
  Partial<Record<CheckoutEvent, CheckoutState>>
> = {
  cart: { NEXT: "address" },
  address: { NEXT: "payment", BACK: "cart" },
  payment: { SUBMIT: "submitting", BACK: "address" },
  submitting: { RESOLVE: "confirmed", REJECT: "failed" },
  confirmed: { RESTART: "cart" },
  failed: { RETRY: "payment", RESTART: "cart" },
};

export function transition(
  state: CheckoutState,
  event: CheckoutEvent,
): CheckoutState {
  // An unhandled event is ignored rather than throwing — the same way a real UI should
  // simply not respond to a button that should not be there.
  return MACHINE[state][event] ?? state;
}

export function allowed(state: CheckoutState): CheckoutEvent[] {
  return Object.keys(MACHINE[state]) as CheckoutEvent[];
}

export const LABELS: Record<CheckoutState, string> = {
  cart: "Reviewing cart",
  address: "Entering address",
  payment: "Entering payment",
  submitting: "Submitting…",
  confirmed: "Order confirmed",
  failed: "Payment failed",
};
