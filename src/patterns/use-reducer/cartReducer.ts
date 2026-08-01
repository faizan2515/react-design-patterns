export interface Product {
  id: number;
  name: string;
  price: number;
}

export const CATALOGUE: Product[] = [
  { id: 1, name: "Mechanical keyboard", price: 129 },
  { id: 2, name: "Monitor arm", price: 84 },
  { id: 3, name: "Desk mat", price: 32 },
];

export interface CartLine extends Product {
  qty: number;
}

export interface CartState {
  lines: CartLine[];
  discount: number;
}

/**
 * Actions describe intent — what happened — not how state should change. `"quantityChanged"`
 * survives a redesign of how quantities are stored; `"setLines"` does not.
 *
 * A discriminated union means TypeScript checks the payload against the type, and the
 * switch below can be made exhaustive: add a case here and the compiler finds the reducer.
 */
export type CartAction =
  | { type: "added"; productId: number }
  | { type: "removed"; productId: number }
  | { type: "quantityChanged"; productId: number; delta: number }
  | { type: "couponApplied"; percent: number }
  | { type: "cleared" };

export const EMPTY_CART: CartState = { lines: [], discount: 0 };

/**
 * A reducer is a pure function of (state, action) → state.
 *
 * Because it is pure and lives outside the component, it can be tested with no React at
 * all, and any sequence of actions replayed from the same starting state always produces
 * the same result. The demo uses that property directly.
 */
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "added": {
      const product = CATALOGUE.find((item) => item.id === action.productId);
      if (!product) return state;

      const existing = state.lines.find((line) => line.id === product.id);

      return {
        ...state,
        lines: existing
          ? state.lines.map((line) =>
              line.id === product.id ? { ...line, qty: line.qty + 1 } : line,
            )
          : [...state.lines, { ...product, qty: 1 }],
      };
    }

    case "removed":
      return {
        ...state,
        lines: state.lines.filter((line) => line.id !== action.productId),
      };

    case "quantityChanged":
      return {
        ...state,
        lines: state.lines.flatMap((line) => {
          if (line.id !== action.productId) return [line];
          const qty = line.qty + action.delta;
          // Dropping to zero removes the line — a rule that lives here, once, rather
          // than at every call site that can decrement.
          return qty <= 0 ? [] : [{ ...line, qty }];
        }),
      };

    case "couponApplied":
      return { ...state, discount: action.percent };

    case "cleared":
      return EMPTY_CART;
  }
}

export function cartTotal(state: CartState): number {
  const subtotal = state.lines.reduce(
    (sum, line) => sum + line.price * line.qty,
    0,
  );
  return Math.round(subtotal * (1 - state.discount / 100));
}

export function describe(action: CartAction): string {
  switch (action.type) {
    case "added":
      return `added #${action.productId}`;
    case "removed":
      return `removed #${action.productId}`;
    case "quantityChanged":
      return `quantityChanged #${action.productId} ${action.delta > 0 ? "+" : ""}${action.delta}`;
    case "couponApplied":
      return `couponApplied ${action.percent}%`;
    case "cleared":
      return "cleared";
  }
}
