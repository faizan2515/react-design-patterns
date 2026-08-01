import { createContext, useContext } from "react";

export interface TabsContextValue {
  active: string;
  select: (id: string) => void;
}

/**
 * Null rather than a default value on purpose: there is no sensible "no tabs" state, so a
 * missing provider should be an error rather than something that half works.
 */
export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabs(): TabsContextValue {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(
      "Tabs.List, Tabs.Tab and Tabs.Panel must be rendered inside <Tabs>.",
    );
  }

  return context;
}
