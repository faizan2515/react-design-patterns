/**
 * A stand-in for something genuinely worth splitting out — an editor, a chart, a map.
 *
 * It reports the head start it was given rather than assuming one, so the message is
 * accurate whether the chunk was preloaded on hover or only requested at the click.
 */
export default function HeavyEditor({ headStart }: { headStart: number }) {
  const preloaded = headStart > 50;

  return (
    <div className="space-y-2 rounded border border-line p-3">
      <p className="font-mono text-[11px] text-muted">Editor chunk</p>

      <div className="rounded bg-surface-2 p-3 font-mono text-[12px] text-fg">
        {preloaded ? (
          <>
            Already loading for {headStart}ms before you clicked — most of the wait
            happened while your pointer was still moving.
          </>
        ) : (
          <>
            Requested only when you clicked, so the full delay happened with you
            watching it.
          </>
        )}
      </div>

      <p className="font-mono text-[10px] text-muted">
        head start: {headStart}ms of a 900ms load
      </p>
    </div>
  );
}
