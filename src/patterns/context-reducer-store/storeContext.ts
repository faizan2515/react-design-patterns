import { createContext, useContext } from "react";
import type { ActionDispatch } from "react";
import type { TodoAction, TodoState } from "./todoStore";

export type TodoDispatch = ActionDispatch<[action: TodoAction]>;

/*
  Three contexts so the demo can run both designs side by side.

  Split: state and dispatch travel separately. Dispatch is referentially stable for the
  life of the provider, so a component that only dispatches subscribes to something that
  never changes — and never re-renders when state does.

  Combined: one context carrying `{ state, dispatch }`. That object is new whenever state
  changes, so *every* consumer re-renders, including the ones that only ever dispatch.
*/
export const StateContext = createContext<TodoState | null>(null);
export const DispatchContext = createContext<TodoDispatch | null>(null);
export const CombinedContext = createContext<{
  state: TodoState;
  dispatch: TodoDispatch;
} | null>(null);

export function useTodoState(): TodoState {
  const combined = useContext(CombinedContext);
  const split = useContext(StateContext);

  const state = combined ? combined.state : split;
  if (!state) throw new Error("useTodoState must be used inside <StoreProvider>.");

  return state;
}

export function useTodoDispatch(): TodoDispatch {
  const combined = useContext(CombinedContext);
  const split = useContext(DispatchContext);

  const dispatch = combined ? combined.dispatch : split;
  if (!dispatch) {
    throw new Error("useTodoDispatch must be used inside <StoreProvider>.");
  }

  return dispatch;
}
