import type { ReactNode } from "react";

export type Status = "idle" | "loading" | "error" | "ready";

/**
 * Multi-way conditionals.
 *
 * Nested ternaries technically work and are miserable to read once there are more than
 * two branches. A lookup keyed by the state is flat, exhaustive-checkable by TypeScript,
 * and adding a fifth status touches one line instead of restructuring an expression.
 *
 * Functions rather than elements, so only the branch that renders does any work.
 */
const VIEWS: Record<Status, () => ReactNode> = {
  idle: () => <Line>Waiting to start</Line>,
  loading: () => <Line>Loading…</Line>,
  error: () => <Line tone="accent">Something went wrong</Line>,
  ready: () => <Line tone="fg">42 results</Line>,
};

export function StatusSwitch({ status }: { status: Status }) {
  return <>{VIEWS[status]()}</>;
}

/**
 * The same thing written as nested ternaries, for comparison. Three branches is already
 * where this stops being readable, and it only gets worse.
 */
export function StatusTernary({ status }: { status: Status }) {
  return (
    <>
      {status === "idle" ? (
        <Line>Waiting to start</Line>
      ) : status === "loading" ? (
        <Line>Loading…</Line>
      ) : status === "error" ? (
        <Line tone="accent">Something went wrong</Line>
      ) : (
        <Line tone="fg">42 results</Line>
      )}
    </>
  );
}

function Line({
  tone = "muted",
  children,
}: {
  tone?: "muted" | "fg" | "accent";
  children: ReactNode;
}) {
  const color =
    tone === "accent" ? "text-accent" : tone === "fg" ? "text-fg" : "text-muted";
  return <p className={`text-[13px] ${color}`}>{children}</p>;
}
