import { useCallback, useState } from "react";

export interface Toggle {
  on: boolean;
  toggle: () => void;
}

/**
 * A hook factory: a function that builds a hook, closing over configuration.
 *
 * The factory runs once at module scope, so the hook it returns is a stable identity with
 * its settings baked in. That is the distinction worth holding on to — a factory
 * *produces* a hook or component, it is not a hook itself, so the rules of hooks apply to
 * the thing it returns and not to the call that made it.
 */
export function createToggle(defaultOn: boolean, label: string) {
  function useToggle(): Toggle & { label: string } {
    const [on, setOn] = useState(defaultOn);
    const toggle = useCallback(() => setOn((current) => !current), []);
    return { on, toggle, label };
  }

  return useToggle;
}

/*
  Built once, at module scope. Calling a factory during render would produce a new hook
  identity every time — harmless for a hook, but fatal for a component factory, where React
  sees a different component type and remounts the whole subtree.
*/
export const useDarkMode = createToggle(true, "Dark mode");
export const useBetaFeatures = createToggle(false, "Beta features");
export const useNotifications = createToggle(true, "Notifications");
