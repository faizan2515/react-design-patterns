import { useState } from "react";
import { TeamRoster } from "./TeamRoster";
import type { Member } from "./TeamRoster";

const SEED: Member[] = [
  { id: 1, name: "Ada Lovelace", role: "lead" },
  { id: 2, name: "Grace Hopper", role: "member" },
  { id: 3, name: "Alan Turing", role: "member" },
];

/**
 * A second container over the same view. No fetching, no loading state, no error path —
 * the kind of container you write for a test, a Storybook story, or an offline mode.
 *
 * <TeamRoster /> did not have to change by a single character to support it. That is
 * the payoff of the split.
 */
export function MemoryRoster() {
  const [members, setMembers] = useState(SEED);

  function promote(id: number) {
    setMembers((current) =>
      current.map((member) =>
        member.id === id ? { ...member, role: "lead" } : member,
      ),
    );
  }

  return <TeamRoster members={members} onPromote={promote} />;
}
