import { createContext, useContext } from "react";

export type Density = "compact" | "cosy" | "roomy";

export const PADDING: Record<Density, string> = {
  compact: "py-1",
  cosy: "py-2.5",
  roomy: "py-5",
};

export interface Settings {
  density: Density;
  setDensity: (next: Density) => void;
}

export const SettingsContext = createContext<Settings | null>(null);

/**
 * Export the hook, not the context.
 *
 * Consumers get a guaranteed-non-null value and a real error message when the provider is
 * missing, and you keep the freedom to change how the value is produced — split it, move
 * it to a store, add a selector — without touching a single call site.
 */
export function useSettings(): Settings {
  const settings = useContext(SettingsContext);

  if (!settings) {
    throw new Error("useSettings must be called inside <SettingsProvider>.");
  }

  return settings;
}
