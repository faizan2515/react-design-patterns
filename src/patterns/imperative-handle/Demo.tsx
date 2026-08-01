import { useRef } from "react";
import { Knobs } from "../../lab/Knobs";
import { FancyInput } from "./FancyInput";
import type { FancyInputHandle } from "./FancyInput";

export default function Demo() {
  const fancy = useRef<FancyInputHandle>(null);
  const plain = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <Knobs>
        <Knobs.Action label="focus()" onClick={() => fancy.current?.focus()} />
        <Knobs.Action label="clear()" onClick={() => fancy.current?.clear()} />
        <Knobs.Action label="shake()" onClick={() => fancy.current?.shake()} />
      </Knobs>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded-md border border-line p-3">
          <FancyInput ref={fancy} label="Custom handle" />
          <p className="text-[12px] leading-relaxed text-muted">
            The parent can call three named methods and nothing else. The DOM node stays
            private.
          </p>
        </div>

        <div className="space-y-2 rounded-md border border-line p-3">
          <label className="block space-y-1">
            <span className="font-mono text-[11px] text-muted">Plain DOM ref</span>
            <input
              ref={plain}
              placeholder="type something…"
              className="w-full rounded border border-line bg-surface-2 px-2.5 py-1.5 font-mono text-[12px] text-fg placeholder:text-muted focus:border-accent-line focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => plain.current?.focus()}
            className="rounded border border-line px-2.5 py-1 font-mono text-[11px] text-muted hover:border-accent-line hover:text-fg"
          >
            focus the node directly
          </button>
        </div>
      </div>

      <p className="border-t border-line pt-4 text-[13px] leading-relaxed text-muted">
        Both work. The difference is what the parent is allowed to do: on the right it
        holds the actual input and can change anything about it, so the child can never
        safely change its internals. On the left it holds three methods, and the input
        could become a contenteditable tomorrow without breaking a caller.
      </p>

      <p className="text-[13px] leading-relaxed text-muted">
        Note there is no <code className="text-fg">forwardRef</code> anywhere. In React 19{" "}
        <code className="text-fg">ref</code> is an ordinary prop, so a function component
        declares it like any other. Reach for imperative handles sparingly — focus,
        scroll, select, play, measure. If you are exposing a method to set a value, that
        value wants to be state.
      </p>
    </div>
  );
}
