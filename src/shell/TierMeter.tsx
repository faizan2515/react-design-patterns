import { TIER_LABEL } from "../registry/tiers";
import type { Tier } from "../registry/types";

/**
 * Tier drawn as a signal-strength meter: core patterns read loudest, advanced ones
 * quietest. The bars encode the tier value itself rather than decorating the row.
 */
export function TierMeter({ tier }: { tier: Tier }) {
  const filled = 4 - tier;

  return (
    <span
      className="inline-flex items-end gap-0.5"
      title={`${TIER_LABEL[tier]} pattern`}
      aria-label={`${TIER_LABEL[tier]} pattern`}
    >
      {[1, 2, 3].map((bar) => (
        <span
          key={bar}
          aria-hidden="true"
          className={`w-0.5 rounded-full ${
            bar <= filled ? "bg-accent" : "bg-line"
          }`}
          style={{ height: `${2 + bar * 2}px` }}
        />
      ))}
    </span>
  );
}
