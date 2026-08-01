import { useCallback, useReducer } from "react";

export interface ToggleState {
  on: boolean;
  changes: number;
}

export type ToggleAction = { type: "toggled" } | { type: "reset" };

export const INITIAL: ToggleState = { on: false, changes: 0 };

/**
 * The component's own rules, exported so consumers can call it from their override rather
 * than reimplementing it. This is what makes the pattern practical: an override usually
 * wants to change one transition and defer on the rest.
 */
export function toggleReducer(
  state: ToggleState,
  action: ToggleAction,
): ToggleState {
  switch (action.type) {
    case "toggled":
      return { on: !state.on, changes: state.changes + 1 };
    case "reset":
      return INITIAL;
  }
}

/**
 * The state reducer pattern: the hook keeps its default behaviour, but the caller may
 * supply a reducer that gets the last word on every transition.
 *
 * Control props (#6) let a caller own the *value*. This lets a caller own the *rules* —
 * inversion of control at the level of state transitions, without the component needing
 * to anticipate each policy as a prop (`maxToggles`, `disableOff`, `lockAfter`…).
 */
export function useToggle(
  reducer: (state: ToggleState, action: ToggleAction) => ToggleState = toggleReducer,
) {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  const toggle = useCallback(() => dispatch({ type: "toggled" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  return { ...state, toggle, reset };
}
