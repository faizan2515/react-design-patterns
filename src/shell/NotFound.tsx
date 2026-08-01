import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="u-label text-[10px] text-muted">404</p>
      <h1 className="u-display mt-4 text-[26px] text-fg">
        No pattern here
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        That URL does not match anything in the catalog. It may not be built yet.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md border border-line px-3 py-1.5 font-mono text-[12px] text-fg transition-colors hover:border-accent-line"
      >
        Browse all patterns
      </Link>
    </div>
  );
}
