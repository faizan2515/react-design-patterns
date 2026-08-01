import { RenderBadge } from "../../lab/RenderBadge";
import { useRenderCount } from "../../lab/useRenderCount";
import type { Role } from "./hocs";
import { useAccess } from "./useAccess";

export interface ProfileProps {
  name: string;
  role: Role;
}

/**
 * The component being enhanced. It is ordinary — which is the appeal of the pattern, and
 * also why nothing here hints at the two wrappers around it.
 */
export function Profile({ name, role }: ProfileProps) {
  const renders = useRenderCount();

  return (
    <div className="rounded border border-line p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] text-fg">{name}</span>
        <RenderBadge label="Profile" count={renders} />
      </div>
      <p className="mt-1 font-mono text-[11px] text-muted">signed in as {role}</p>
    </div>
  );
}

/** The hook equivalent of the two wrappers above — no wrapper, gate visible in place. */
export function GuardedProfile({ name, role }: ProfileProps) {
  const allowed = useAccess(role, "editor");
  const renders = useRenderCount();

  if (!allowed) {
    return (
      <p className="rounded border border-accent-line bg-accent-soft px-2.5 py-2 text-[13px] text-fg">
        Needs editor access — you are {role}.
      </p>
    );
  }

  return (
    <div className="rounded border border-line p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] text-fg">{name}</span>
        <RenderBadge label="GuardedProfile" count={renders} />
      </div>
      <p className="mt-1 font-mono text-[11px] text-muted">signed in as {role}</p>
    </div>
  );
}
