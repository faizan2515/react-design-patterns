import type { ReactNode } from "react";
import { RenderBadge } from "../../lab/RenderBadge";

/** Shared chrome so the two trees differ only in how the value reaches the leaf. */
export function Frame({
  title,
  renders,
  note,
  children,
}: {
  title: string;
  renders: number;
  note?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded border border-line px-2.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">
          {title}
          {note && <span className="ml-2 opacity-60">{note}</span>}
        </span>
        <RenderBadge count={renders} />
      </div>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
