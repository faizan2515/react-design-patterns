import type { Person } from "../../lab/data";

/**
 * Strategy: a family of interchangeable algorithms behind one signature.
 *
 * In a class-based language this is an interface with several implementations. In
 * JavaScript a strategy is just a function, and the pattern reduces to "pass the function
 * in" — which is why it rarely gets named in React code even though it is everywhere.
 *
 * What it replaces is a growing conditional. Each new sort order in a `switch` means
 * editing the component that sorts; each new entry in this record means adding a function
 * and nothing else.
 */
export type SortStrategy = (a: Person, b: Person) => number;

export const SORTS: Record<string, SortStrategy> = {
  "by name": (a, b) => a.name.localeCompare(b.name),
  "by team": (a, b) => a.team.localeCompare(b.team) || a.name.localeCompare(b.name),
  "by role length": (a, b) => a.role.length - b.role.length,
  "reverse id": (a, b) => b.id - a.id,
};

export type FormatStrategy = (person: Person) => string;

export const FORMATS: Record<string, FormatStrategy> = {
  plain: (person) => person.name,
  "with role": (person) => `${person.name} — ${person.role}`,
  initials: (person) =>
    person.name
      .split(" ")
      .map((part) => part[0])
      .join("."),
  shouty: (person) => person.name.toUpperCase(),
};
