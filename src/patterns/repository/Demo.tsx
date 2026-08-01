import { useEffect, useMemo, useState } from "react";
import { Knobs } from "../../lab/Knobs";
import {
  createFakeRepository,
  createRestRepository,
} from "./repository";
import type { TeamMember } from "./repository";

const BACKENDS = [
  { value: "rest", label: "REST backend" },
  { value: "fake", label: "In-memory fake" },
] as const;

export default function Demo() {
  const [backend, setBackend] = useState<"rest" | "fake">("rest");

  /* The only line in the app that knows which implementation is in use. */
  const repo = useMemo(
    () => (backend === "rest" ? createRestRepository() : createFakeRepository()),
    [backend],
  );

  const [members, setMembers] = useState<TeamMember[] | null>(null);

  useEffect(() => {
    let live = true;
    setMembers(null);
    void repo.list().then((rows) => {
      if (live) setMembers(rows);
    });
    return () => {
      live = false;
    };
  }, [repo]);

  async function promote(member: TeamMember) {
    const updated = await repo.rename(member.id, `${member.fullName} ✦`);
    setMembers(
      (current) =>
        current?.map((row) => (row.id === updated.id ? updated : row)) ?? null,
    );
  }

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice
          label="Backend"
          value={backend}
          onChange={setBackend}
          options={BACKENDS}
        />
        <Knobs.Readout label="active">{repo.name}</Knobs.Readout>
      </Knobs>

      <div className="rounded-md border border-line p-3">
        {members === null ? (
          <p className="font-mono text-[11px] text-muted">loading…</p>
        ) : (
          <ul className="divide-y divide-line">
            {members.slice(0, 5).map((member) => (
              <li key={member.id} className="flex items-center gap-3 py-2">
                <span className="flex-1 text-[13px] text-fg">
                  {member.fullName}
                </span>
                <span className="font-mono text-[10px] text-muted">
                  {member.title}
                </span>
                <button
                  type="button"
                  onClick={() => void promote(member)}
                  className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-muted transition-colors hover:border-accent-line hover:text-fg"
                >
                  mark
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Switch backends. The list re-loads from a completely different implementation —
        one that speaks <code className="text-fg">snake_case</code> and splits names into
        first and last, and one that is a plain array — and not a single line of the UI
        changes, because the UI depends on <code className="text-fg">TeamMember</code>
        rather than on either payload.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The view model comes first, and the adapter's job is to produce it. That inverts
        the usual direction, where a component ends up shaped by whatever JSON arrived, and
        a backend rename becomes a find-and-replace through the tree.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        The underrated payoff is the second adapter. Tests, Storybook, offline mode and
        demos become a one-line substitution instead of a mocking framework reaching into
        module internals — and a fake you can actually read beats a pile of{" "}
        <code className="text-fg">jest.mock</code> calls.
      </p>
    </div>
  );
}
