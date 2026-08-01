import { useImperativeHandle, useRef, useState } from "react";
import type { Ref } from "react";

export interface FancyInputHandle {
  focus: () => void;
  clear: () => void;
  shake: () => void;
}

/**
 * In React 19, `ref` is an ordinary prop.
 *
 * `forwardRef` still works and is not going away yet, but it is no longer needed: a
 * function component can simply declare `ref` alongside its other props. That removes a
 * wrapper, a generic, and a long-standing source of confusion about argument order.
 */
export function FancyInput({
  ref,
  label,
}: {
  ref?: Ref<FancyInputHandle>;
  label: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [shaking, setShaking] = useState(false);

  /*
    Expose a deliberate API rather than the DOM node.

    Handing out the raw input would let a parent do anything to it — change its value,
    read its styles, remove it. Naming three methods keeps the surface small and lets the
    internals change without breaking callers, which is the entire argument for this hook.
  */
  useImperativeHandle(
    ref,
    () => ({
      focus: () => input.current?.focus(),
      clear: () => {
        if (input.current) input.current.value = "";
      },
      shake: () => {
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
      },
    }),
    [],
  );

  return (
    <label className="block space-y-1">
      <span className="font-mono text-[11px] text-muted">{label}</span>
      <input
        ref={input}
        placeholder="type something…"
        className={`w-full rounded border bg-surface-2 px-2.5 py-1.5 font-mono text-[12px] text-fg placeholder:text-muted focus:outline-none ${
          shaking ? "border-accent" : "border-line focus:border-accent-line"
        }`}
        style={shaking ? { animation: "rdp-shake 400ms ease-in-out" } : undefined}
      />
    </label>
  );
}
