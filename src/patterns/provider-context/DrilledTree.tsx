import { useRenderCount } from "../../lab/useRenderCount";
import { Frame } from "./Frame";
import { PADDING } from "./settingsContext";
import type { Density } from "./settingsContext";

const DEPTH = 3;

/**
 * The value travels by hand. Every component between the owner and the consumer takes a
 * `density` prop it does not use, purely to pass it on.
 *
 * The cost is not only typing. Because each level receives a prop that changes, each
 * level re-renders when it changes — watch the counters climb all the way down.
 */
export function DrilledTree({ density }: { density: Density }) {
  return <Level depth={1} density={density} />;
}

function Level({ depth, density }: { depth: number; density: Density }) {
  const renders = useRenderCount();

  return (
    <Frame
      title={`Level ${depth}`}
      renders={renders}
      note="forwards density"
    >
      {depth < DEPTH ? (
        <Level depth={depth + 1} density={density} />
      ) : (
        <Leaf density={density} />
      )}
    </Frame>
  );
}

function Leaf({ density }: { density: Density }) {
  const renders = useRenderCount();

  return (
    <div className={`rounded bg-accent-soft px-2.5 ${PADDING[density]}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-fg">Leaf · {density}</span>
        <span className="font-mono text-[10px] tabular-nums text-muted">
          ×{renders}
        </span>
      </div>
    </div>
  );
}
