export interface Member {
  id: number;
  name: string;
  role: "member" | "lead";
}

interface TeamRosterProps {
  members: Member[];
  onPromote: (id: number) => void;
}

/**
 * The presentational half. It has no idea where members came from — API, memory, a test
 * fixture — and it owns no state. Everything it needs arrives as props, and everything
 * it wants to happen leaves as a callback.
 *
 * That is the whole contract, and it is what makes this component trivial to test,
 * reuse, and render in isolation.
 */
export function TeamRoster({ members, onPromote }: TeamRosterProps) {
  if (members.length === 0) {
    return <p className="text-sm text-muted">Nobody on this team yet.</p>;
  }

  return (
    <ul className="divide-y divide-line rounded-md border border-line">
      {members.map((member) => (
        <li key={member.id} className="flex items-center gap-3 px-3 py-2">
          <span className="flex-1 text-sm text-fg">{member.name}</span>

          {member.role === "lead" ? (
            <span className="rounded bg-accent-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
              Lead
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onPromote(member.id)}
              className="rounded border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted hover:border-accent-line hover:text-fg"
            >
              Promote
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
