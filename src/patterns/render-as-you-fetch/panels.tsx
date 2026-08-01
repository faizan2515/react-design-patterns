import { use } from "react";
import type { Person } from "../../lab/data";
import { fetchProfile, fetchTeammates } from "./resources";

/**
 * Waterfall: the second request cannot start until the first has finished, because the
 * component that starts it does not render until its parent stops suspending.
 *
 * This is the default shape of fetch-in-effect code too, and it is the most common
 * performance bug in data loading — two independent requests taking as long as their sum
 * for no reason other than where they were written.
 */
export function Waterfall({ latency }: { latency: number }) {
  const profile = use(fetchProfile(latency));

  return (
    <div className="space-y-2">
      <ProfileCard person={profile} />
      {/* Only reached after the profile resolves — so the teammates request starts late. */}
      <TeammatesAfter latency={latency} />
    </div>
  );
}

function TeammatesAfter({ latency }: { latency: number }) {
  const teammates = use(fetchTeammates(latency));
  return <TeammateList people={teammates} />;
}

/**
 * Parallel: both promises are started before anything suspends, then read.
 *
 * The requests are already in flight by the time `use()` is called, so the total wait is
 * the slower of the two rather than the sum. Kicking off the work before rendering the
 * thing that needs it is what "render as you fetch" actually means.
 */
export function Parallel({ latency }: { latency: number }) {
  const profilePromise = fetchProfile(latency);
  const teammatesPromise = fetchTeammates(latency);

  const profile = use(profilePromise);
  const teammates = use(teammatesPromise);

  return (
    <div className="space-y-2">
      <ProfileCard person={profile} />
      <TeammateList people={teammates} />
    </div>
  );
}

function ProfileCard({ person }: { person: Person }) {
  return (
    <div className="rounded border border-line p-2.5">
      <p className="text-[13px] text-fg">{person.name}</p>
      <p className="font-mono text-[10px] text-muted">{person.role}</p>
    </div>
  );
}

function TeammateList({ people }: { people: Person[] }) {
  return (
    <ul className="rounded border border-line p-2.5">
      {people.map((person) => (
        <li key={person.id} className="text-[12px] text-muted">
          {person.name}
        </li>
      ))}
    </ul>
  );
}
