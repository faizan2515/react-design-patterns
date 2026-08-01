import { createContext, useContext } from "react";

export interface Theme {
  accent: string;
}

export interface Session {
  user: string;
}

export interface Prefs {
  density: string;
}

/*
  One context carrying everything, versus three carrying one concern each.

  Context has no selectors: every consumer re-renders whenever the value changes, whether
  or not the part it reads changed. So the granularity of your contexts *is* the
  granularity of your re-renders — splitting by concern is the only tuning available.
*/
export const EverythingContext = createContext<
  (Theme & Session & Prefs) | null
>(null);

export const ThemeContext = createContext<Theme | null>(null);
export const SessionContext = createContext<Session | null>(null);
export const PrefsContext = createContext<Prefs | null>(null);

function required<T>(value: T | null, name: string): T {
  if (value === null) throw new Error(`${name} is missing a provider.`);
  return value;
}

export function useTheme(): Theme {
  const everything = useContext(EverythingContext);
  const split = useContext(ThemeContext);
  return required(everything ?? split, "Theme");
}

export function useSession(): Session {
  const everything = useContext(EverythingContext);
  const split = useContext(SessionContext);
  return required(everything ?? split, "Session");
}

export function usePrefs(): Prefs {
  const everything = useContext(EverythingContext);
  const split = useContext(PrefsContext);
  return required(everything ?? split, "Prefs");
}
