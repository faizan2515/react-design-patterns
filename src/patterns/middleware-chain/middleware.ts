export interface Action {
  type: string;
  amount?: number;
}

export interface Context {
  balance: number;
}

export type Next = (action: Action) => Action | null;
export type Middleware = (
  action: Action,
  context: Context,
  next: Next,
) => Action | null;

/**
 * Chain of responsibility: each handler decides whether to deal with an action, pass it
 * on, or stop it dead.
 *
 * The shape is the same one Redux middleware, Express and every HTTP framework use. Each
 * link receives the action and a `next`, and holding that reference is what gives it the
 * power to short-circuit — a link that never calls `next` has vetoed the action, and
 * nothing downstream ever learns it existed.
 */
export function chain(middlewares: Middleware[]) {
  return (action: Action, context: Context): Action | null => {
    function run(index: number): Next {
      return (current: Action) => {
        const middleware = middlewares[index];
        if (!middleware) return current;
        return middleware(current, context, run(index + 1));
      };
    }

    return run(0)(action);
  };
}

export function makeMiddlewares(log: (message: string, tone?: "default" | "accent" | "warn") => void) {
  const logger: Middleware = (action, _context, next) => {
    log(`logger saw ${action.type}`, "accent");
    return next(action);
  };

  const validator: Middleware = (action, _context, next) => {
    if ((action.amount ?? 0) <= 0) {
      log("validator rejected: amount must be positive", "warn");
      return null; // never calls next — the chain stops here
    }
    return next(action);
  };

  const funds: Middleware = (action, context, next) => {
    if ((action.amount ?? 0) > context.balance) {
      log("funds check rejected: insufficient balance", "warn");
      return null;
    }
    return next(action);
  };

  const rounder: Middleware = (action, _context, next) => {
    const rounded = { ...action, amount: Math.round(action.amount ?? 0) };
    if (rounded.amount !== action.amount) log("rounder adjusted the amount");
    return next(rounded);
  };

  return { logger, validator, funds, rounder };
}
