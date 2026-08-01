import { INITIAL, toggleReducer } from "./useToggle";
import type { ToggleAction, ToggleState } from "./useToggle";

export type PolicyId = "default" | "maxFour" | "noTurningOff";

/**
 * Policies a consumer can impose without the toggle knowing they exist.
 *
 * Each one handles the single case it cares about and delegates everything else back to
 * the component's own reducer. That delegation is the whole discipline — an override that
 * reimplements the default rules will drift from them at the next release.
 */
export const POLICIES: Record<
  PolicyId,
  (state: ToggleState, action: ToggleAction) => ToggleState
> = {
  default: toggleReducer,

  maxFour: (state, action) => {
    if (action.type === "toggled" && state.changes >= 4) return state;
    return toggleReducer(state, action);
  },

  noTurningOff: (state, action) => {
    if (action.type === "toggled" && state.on) return state;
    return toggleReducer(state, action);
  },
};

export const POLICY_LABELS: Record<PolicyId, string> = {
  default: "Component's own rules",
  maxFour: "At most four changes",
  noTurningOff: "Cannot be switched off",
};

export { INITIAL };
