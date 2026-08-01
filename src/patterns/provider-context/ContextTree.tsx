import { useRenderCount } from "../../lab/useRenderCount";
import { Frame } from "./Frame";
import { PADDING, useSettings } from "./settingsContext";

const DEPTH = 3;

/**
 * The same tree, with the value delivered through context instead.
 *
 * Two things change. The intermediate levels no longer mention density at all — they take
 * no props and forward nothing. And because they do not read the context, updating it does
 * not re-render them: only the leaf that consumes the value does.
 *
 * That second part is the one people miss. Context is not a performance problem in itself;
 * it re-renders its consumers, which is precisely what it should do.
 */
export function ContextTree() {
  return <Level depth={1} />;
}

function Level({ depth }: { depth: number }) {
  const renders = useRenderCount();

  return (
    <Frame title={`Level ${depth}`} renders={renders} note="knows nothing">
      {depth < DEPTH ? <Level depth={depth + 1} /> : <Leaf />}
    </Frame>
  );
}

function Leaf() {
  const { density } = useSettings();
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
