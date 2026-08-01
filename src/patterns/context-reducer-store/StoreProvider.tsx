import { useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import {
  CombinedContext,
  DispatchContext,
  StateContext,
} from "./storeContext";
import { INITIAL, todoReducer } from "./todoStore";

/**
 * A reducer behind a context is the smallest thing that deserves the word "store": any
 * component can read the state or dispatch to it, with no prop drilling and no library.
 *
 * The `split` prop exists only so the demo can show both designs. In real code you would
 * pick one — and it should be the split one, because it costs nothing and stops
 * dispatch-only components from re-rendering on every state change.
 */
export function StoreProvider({
  split,
  children,
}: {
  split: boolean;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(todoReducer, INITIAL);

  // `dispatch` from useReducer is guaranteed stable, so this object only changes when
  // state does — which is exactly the problem with combining them.
  const combined = useMemo(() => ({ state, dispatch }), [state]);

  if (split) {
    return (
      <StateContext value={state}>
        <DispatchContext value={dispatch}>{children}</DispatchContext>
      </StateContext>
    );
  }

  return <CombinedContext value={combined}>{children}</CombinedContext>;
}
