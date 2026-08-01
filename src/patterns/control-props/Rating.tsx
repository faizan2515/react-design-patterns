import { useState } from "react";

interface RatingProps {
  /** Provide this to control the component. Omit it to let Rating own its state. */
  value?: number;
  defaultValue?: number;
  onChange?: (next: number) => void;
  max?: number;
}

/**
 * One component, two modes.
 *
 * `value === undefined` means the caller is not controlling it, so Rating keeps its own
 * state — the easy path for consumers who just want a working widget. Pass `value` and
 * the caller becomes the source of truth, free to clamp, reject or transform the change.
 *
 * Two rules make this work, and both are easy to get wrong:
 *
 *   1. Decide controlled-ness from `value !== undefined`, not from truthiness. A
 *      controlled Rating at 0 is still controlled.
 *   2. Call `onChange` in *both* modes. Uncontrolled callers still want to know.
 */
export function Rating({
  value,
  defaultValue = 0,
  onChange,
  max = 5,
}: RatingProps) {
  const [internal, setInternal] = useState(defaultValue);

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  function handleSelect(next: number) {
    // The internal state is only the source of truth when nobody else is.
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Rating">
      {Array.from({ length: max }, (_, index) => index + 1).map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} of ${max}`}
          aria-pressed={star <= current}
          onClick={() => handleSelect(star)}
          className={`text-[18px] leading-none transition-colors ${
            star <= current ? "text-accent" : "text-line hover:text-muted"
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 font-mono text-[11px] tabular-nums text-muted">
        {current}/{max}
      </span>
    </div>
  );
}
