import { useState } from "react";
import { Knobs } from "../../lab/Knobs";
import { withAccess, withRenderLog } from "./hocs";
import type { Role } from "./hocs";
import { GuardedProfile, Profile } from "./Profile";

/*
  Composed once at module scope, never inside a component. Building an HOC during render
  produces a brand new component type every time, which React treats as a different
  component and remounts — losing all its state on every keystroke elsewhere in the tree.
*/
const Enhanced = withAccess(withRenderLog(Profile), "editor");

const ROLES = [
  { value: "viewer", label: "viewer" },
  { value: "editor", label: "editor" },
  { value: "admin", label: "admin" },
] as const;

export default function Demo() {
  const [role, setRole] = useState<Role>("viewer");

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Choice label="Role" value={role} onChange={setRole} options={ROLES} />
      </Knobs>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="font-mono text-[11px] text-muted">Wrapped in two HOCs</p>
          <Enhanced name="Ada Lovelace" role={role} />
          <p className="font-mono text-[10px] text-muted">
            displayName: {Enhanced.displayName}
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-mono text-[11px] text-muted">Same behaviour, as a hook</p>
          <GuardedProfile name="Ada Lovelace" role={role} />
          <p className="font-mono text-[10px] text-muted">
            displayName: GuardedProfile
          </p>
        </div>
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Both columns behave identically. The left one is three components deep to get
        there, and its name — <code className="text-fg">{Enhanced.displayName}</code> — is
        the wrapper nesting made visible; stack a fourth HOC and it grows again. Nothing in{" "}
        <code className="text-fg">Profile</code> tells you that <code className="text-fg">role</code>{" "}
        is inspected on the way in.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        HOCs are not obsolete, but their common uses moved to hooks. What is left is
        genuine wrapping — error boundaries, providers, instrumentation — where something
        really does need to sit around a component rather than inside it.
      </p>
    </div>
  );
}
