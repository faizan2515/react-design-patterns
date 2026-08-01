import type { ComponentType } from "react";
import { RenderBadge } from "../../lab/RenderBadge";
import { useRenderCount } from "../../lab/useRenderCount";

export type Role = "viewer" | "editor" | "admin";

const RANK: Record<Role, number> = { viewer: 0, editor: 1, admin: 2 };

/** Structural, so it accepts any component regardless of its prop type. */
function nameOf(component: { displayName?: string; name?: string }): string {
  return component.displayName || component.name || "Component";
}

/**
 * A higher-order component is a function from component to component. That is the whole
 * definition — there is no React API involved.
 *
 * Two obligations come with writing one, and both are easy to forget: forward every prop
 * you did not consume, and set a `displayName`, or the React DevTools tree fills up with
 * anonymous wrappers.
 */
export function withRenderLog<P extends object>(Wrapped: ComponentType<P>) {
  function WithRenderLog(props: P) {
    const renders = useRenderCount();

    return (
      <div className="rounded border border-dashed border-line p-2">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] text-muted">withRenderLog</span>
          <RenderBadge count={renders} />
        </div>
        <Wrapped {...props} />
      </div>
    );
  }

  WithRenderLog.displayName = `withRenderLog(${nameOf(Wrapped)})`;
  return WithRenderLog;
}

/**
 * This one *consumes* a prop rather than forwarding it — `role` is used to decide access
 * and then passed along anyway, which is a choice the caller cannot see from the outside.
 *
 * That invisibility is the real cost of HOCs. Looking at the wrapped component's source
 * tells you nothing about which props are injected, consumed or renamed on the way in.
 */
export function withAccess<P extends object>(
  Wrapped: ComponentType<P>,
  required: Role,
) {
  function WithAccess(props: P & { role: Role }) {
    if (RANK[props.role] < RANK[required]) {
      return (
        <p className="rounded border border-accent-line bg-accent-soft px-2.5 py-2 text-[13px] text-fg">
          Needs {required} access — you are {props.role}.
        </p>
      );
    }

    return <Wrapped {...props} />;
  }

  WithAccess.displayName = `withAccess(${nameOf(Wrapped)})`;
  return WithAccess;
}
