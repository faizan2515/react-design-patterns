import { useEffect, useState } from "react";
import { PEOPLE } from "../../lab/data";
import { fakeRequest } from "../../lab/fakeApi";
import { TeamRoster } from "./TeamRoster";
import type { Member } from "./TeamRoster";

/** Stands in for a real endpoint so the demo needs no network. */
function fetchMembers(shouldFail: boolean): Promise<Member[]> {
  const members: Member[] = PEOPLE.slice(0, 3).map((person, index) => ({
    id: person.id,
    name: person.name,
    role: index === 0 ? "lead" : "member",
  }));

  return fakeRequest(members, { latency: 700, fail: shouldFail });
}

type Status = "loading" | "ready" | "error";

/**
 * The container half. It owns fetching, loading and error states, and the promote
 * mutation — but renders no roster markup of its own. When it has data, it hands off
 * to <TeamRoster />.
 */
export function ApiRoster({ shouldFail }: { shouldFail: boolean }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetchMembers(shouldFail)
      .then((data) => {
        if (cancelled) return;
        setMembers(data);
        setStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("error");
      });

    // Guards against a resolved response from a stale request overwriting a newer one.
    return () => {
      cancelled = true;
    };
  }, [shouldFail]);

  function promote(id: number) {
    setMembers((current) =>
      current.map((member) =>
        member.id === id ? { ...member, role: "lead" } : member,
      ),
    );
  }

  if (status === "loading") {
    return <p className="text-sm text-muted">Loading team…</p>;
  }

  if (status === "error") {
    return (
      <p className="text-sm text-fg">
        Could not load the team. Untick “make the request fail” to retry.
      </p>
    );
  }

  return <TeamRoster members={members} onPromote={promote} />;
}
