/**
 * Shared sample data, so demos spend their source on the pattern rather than on
 * inventing another list of fruit. Names are drawn from computing history.
 */

export interface Person {
  id: number;
  name: string;
  role: string;
  team: "Platform" | "Design" | "Research";
}

export const PEOPLE: Person[] = [
  { id: 1, name: "Ada Lovelace", role: "Principal Engineer", team: "Platform" },
  { id: 2, name: "Grace Hopper", role: "Staff Engineer", team: "Platform" },
  { id: 3, name: "Alan Turing", role: "Research Lead", team: "Research" },
  { id: 4, name: "Katherine Johnson", role: "Systems Analyst", team: "Research" },
  { id: 5, name: "Margaret Hamilton", role: "Engineering Manager", team: "Platform" },
  { id: 6, name: "Barbara Liskov", role: "Distinguished Engineer", team: "Research" },
  { id: 7, name: "Radia Perlman", role: "Network Architect", team: "Platform" },
  { id: 8, name: "Susan Kare", role: "Design Lead", team: "Design" },
  { id: 9, name: "Frances Allen", role: "Compiler Engineer", team: "Platform" },
  { id: 10, name: "Jean Bartik", role: "Systems Engineer", team: "Research" },
];

/** Generates an arbitrarily long list for virtualization and filtering demos. */
export function manyPeople(count: number): Person[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = PEOPLE[index % PEOPLE.length];
    return {
      ...seed,
      id: index + 1,
      name: `${seed.name} ${Math.floor(index / PEOPLE.length) + 1}`,
    };
  });
}
