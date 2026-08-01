import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/**
 * A portal renders into a different DOM node while staying in the same React tree.
 *
 * That split is the whole point and the most misunderstood part: the markup escapes its
 * parent's `overflow`, `z-index` and stacking context, but context still flows in and
 * events still bubble to the React parent — not the DOM one. A click inside this modal
 * fires the handler of whatever React component rendered it.
 */
export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // Move focus in, and remember where it came from so it can go back.
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Example dialog"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm space-y-3 rounded-lg border border-line bg-surface p-4 shadow-xl outline-none"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
