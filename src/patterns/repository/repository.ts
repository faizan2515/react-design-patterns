import { PEOPLE } from "../../lab/data";
import { fakeRequest } from "../../lab/fakeApi";

/**
 * The view model — the shape the UI wants, not the shape any backend happens to send.
 *
 * Defining this first is the whole discipline. Once components depend on `TeamMember`
 * rather than on a JSON payload, a backend rename is a change in one adapter instead of a
 * find-and-replace through the component tree.
 */
export interface TeamMember {
  id: string;
  fullName: string;
  title: string;
  group: string;
}

/** The port: what the application needs, with no hint of how it is satisfied. */
export interface PeopleRepository {
  readonly name: string;
  list(): Promise<TeamMember[]>;
  rename(id: string, fullName: string): Promise<TeamMember>;
}

/*
  Adapter one: a "REST" backend that speaks snake_case and splits names into parts —
  a perfectly ordinary API that happens to disagree with our view model everywhere.
*/
interface RestPerson {
  person_id: number;
  first_name: string;
  last_name: string;
  job_title: string;
  team_name: string;
}

function fromRest(row: RestPerson): TeamMember {
  return {
    id: String(row.person_id),
    fullName: `${row.first_name} ${row.last_name}`,
    title: row.job_title,
    group: row.team_name,
  };
}

export function createRestRepository(latency = 700): PeopleRepository {
  let rows: RestPerson[] = PEOPLE.map((person) => {
    const [first, ...rest] = person.name.split(" ");
    return {
      person_id: person.id,
      first_name: first,
      last_name: rest.join(" "),
      job_title: person.role,
      team_name: person.team,
    };
  });

  return {
    name: "REST backend",
    async list() {
      return fakeRequest(() => rows.map(fromRest), { latency });
    },
    async rename(id, fullName) {
      const [first, ...rest] = fullName.split(" ");
      rows = rows.map((row) =>
        String(row.person_id) === id
          ? { ...row, first_name: first, last_name: rest.join(" ") }
          : row,
      );
      const updated = rows.find((row) => String(row.person_id) === id)!;
      return fakeRequest(() => fromRest(updated), { latency });
    },
  };
}

/*
  Adapter two: an in-memory fake. Same port, no network, instant.

  This is the payoff people underrate. Tests, Storybook, offline mode and demos all become
  a one-line substitution rather than a mocking framework reaching into module internals.
*/
export function createFakeRepository(): PeopleRepository {
  let members: TeamMember[] = PEOPLE.map((person) => ({
    id: String(person.id),
    fullName: person.name,
    title: person.role,
    group: person.team,
  }));

  return {
    name: "In-memory fake",
    async list() {
      return members;
    },
    async rename(id, fullName) {
      members = members.map((member) =>
        member.id === id ? { ...member, fullName } : member,
      );
      return members.find((member) => member.id === id)!;
    },
  };
}
