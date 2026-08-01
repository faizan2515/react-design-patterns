import type { Role } from "./hocs";

const RANK: Record<Role, number> = { viewer: 0, editor: 1, admin: 2 };

/**
 * The same rule as `withAccess`, expressed as a hook.
 *
 * The gate becomes visible inside the component that is gated, the props stay its own,
 * and no wrapper appears in the tree. This is why hooks displaced HOCs for nearly
 * everything except genuine wrapping.
 */
export function useAccess(role: Role, required: Role): boolean {
  return RANK[role] >= RANK[required];
}
