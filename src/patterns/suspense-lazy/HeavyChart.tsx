const BARS = [42, 78, 31, 64, 55, 89];

/** A second lazy chunk, deliberately slower to load than the panel. */
export default function HeavyChart() {
  return (
    <div className="rounded border border-line p-3">
      <p className="font-mono text-[11px] text-muted">Activity chart</p>
      <div className="mt-3 flex h-20 items-end gap-1.5">
        {BARS.map((value, index) => (
          <div
            key={index}
            style={{ height: `${value}%` }}
            className="flex-1 rounded-t bg-accent-soft"
          >
            <span className="sr-only">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
