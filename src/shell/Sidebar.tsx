import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { CATEGORIES } from "../registry/categories";
import { PATTERNS } from "../registry/patterns";
import { TierMeter } from "./TierMeter";

export function Sidebar({
  onNavigate,
  showBrand = true,
}: {
  onNavigate?: () => void;
  showBrand?: boolean;
}) {
  const [query, setQuery] = useState("");
  const { pathname } = useLocation();
  const activeItem = useRef<HTMLAnchorElement>(null);

  /*
    Bring the current pattern into view. With 57 items the active one is usually well
    outside the visible strip after a deep link or a reload, which leaves the sidebar
    looking like nothing is selected.

    `block: "nearest"` is doing the important work: it scrolls only when the item is
    actually out of view, and only by the minimum needed, so ordinary clicks on visible
    items do not jerk the list around.
  */
  useEffect(() => {
    activeItem.current?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = needle
      ? PATTERNS.filter(
          (p) =>
            p.meta.title.toLowerCase().includes(needle) ||
            p.meta.blurb.toLowerCase().includes(needle),
        )
      : PATTERNS;

    return CATEGORIES.map((category) => ({
      category,
      patterns: matches.filter((p) => p.meta.category === category.id),
    })).filter((group) => group.patterns.length > 0);
  }, [query]);

  return (
    <div className="flex h-full flex-col">
      {showBrand && (
        <div className="border-b border-line px-5 py-5">
          <NavLink
            to="/"
            onClick={onNavigate}
            className="u-display block text-[14px] text-fg"
          >
            {"<react "}
            <span className="text-accent">patterns</span>
            {" />"}
          </NavLink>
          <p className="mt-1.5 font-mono text-[11px] text-muted">
            {PATTERNS.length} runnable{" "}
            {PATTERNS.length === 1 ? "example" : "examples"}
          </p>
        </div>
      )}

      <div className="border-b border-line px-5 py-3">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter patterns"
          aria-label="Filter patterns"
          className="w-full rounded-md border border-line bg-surface-2 px-2.5 py-1.5 font-mono text-[12px] text-fg placeholder:text-muted focus:border-accent-line focus:outline-none"
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {groups.map(({ category, patterns }) => (
          <div key={category.id} className="mb-5">
            <h2 className="u-label px-2 pb-2 text-[9.5px] text-muted">
              {category.label}
            </h2>
            <ul>
              {patterns.map((pattern) => (
                <li key={pattern.slug}>
                  <NavLink
                    to={`/${pattern.meta.category}/${pattern.slug}`}
                    onClick={onNavigate}
                    ref={
                      pathname.endsWith(`/${pattern.slug}`)
                        ? activeItem
                        : undefined
                    }
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-md px-2 py-1.5 font-mono text-[12px] transition-colors ${
                        isActive
                          ? "bg-accent-soft text-fg"
                          : "text-muted hover:bg-surface-2 hover:text-fg"
                      }`
                    }
                  >
                    <TierMeter tier={pattern.meta.tier} />
                    <span className="truncate">{pattern.meta.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {groups.length === 0 && (
          <p className="px-2 font-mono text-[12px] text-muted">
            Nothing matches “{query}”.
          </p>
        )}
      </nav>
    </div>
  );
}
