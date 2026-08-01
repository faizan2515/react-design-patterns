import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const KEY = "rdp-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

const listeners = new Set<() => void>();

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    // Private mode or storage disabled — fall back to the OS preference.
    return null;
  }
}

/** null means "no explicit choice", which is what lets the OS preference win. */
let override: Theme | null = readStored();

/**
 * Subscribes to both sources of truth: our own writes, and the OS preference changing
 * underneath us. The second matters — with no override stored, someone switching their
 * system to dark at sunset should see this site follow without a reload.
 */
function subscribe(listener: () => void) {
  listeners.add(listener);

  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", listener);

  return () => {
    listeners.delete(listener);
    media.removeEventListener("change", listener);
  };
}

function getSnapshot(): Theme {
  if (override) return override;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/**
 * Returns the *effective* theme, not the stored preference — the toggle needs to show
 * what is currently on screen, which before any explicit choice is whatever the OS said.
 *
 * Setting a theme writes a `data-theme` attribute, which narrows `color-scheme` on the
 * root and flips every `light-dark()` token at once. There is no second palette to update
 * and no class to thread through the tree.
 */
export function useTheme(): [Theme, (next: Theme) => void] {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => "light" as Theme,
  );

  const setTheme = useCallback((next: Theme) => {
    override = next;
    document.documentElement.dataset.theme = next;

    try {
      localStorage.setItem(KEY, next);
    } catch {
      // Not persisting is survivable; the session still switches.
    }

    for (const listener of listeners) listener();
  }, []);

  return [theme, setTheme];
}
