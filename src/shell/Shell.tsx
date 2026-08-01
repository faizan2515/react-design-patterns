import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { TopControls } from "./TopControls";

export function Shell() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();

  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  // Send scroll back to the top of the document on navigation.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  /*
    Drawer behaviour that is easy to leave out and immediately noticeable when missing:
    Escape closes it, the page behind stops scrolling, focus moves into the panel on open,
    and returns to the button that opened it on close.
  */
  useEffect(() => {
    if (!navOpen) return;

    const previousOverflow = document.body.style.overflow;
    // Captured now rather than read at cleanup, when the ref may point somewhere else.
    const opener = trigger.current;

    document.body.style.overflow = "hidden";
    panel.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setNavOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [navOpen]);

  return (
    <div className="min-h-svh bg-bg font-sans text-fg lg:grid lg:grid-cols-[268px_1fr]">
      {/*
        Above the drawer, not below it. At z-20 the backdrop covered the whole viewport
        including this bar, so the wordmark and the controls stopped responding the moment
        the menu opened. Fixed height, because the drawer positions itself against it.
      */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-line bg-bg px-4 lg:hidden">
        {/* A link, like its counterpart in the sidebar — the wordmark goes home. */}
        <Link
          to="/"
          onClick={() => setNavOpen(false)}
          className="u-display text-[13px] text-fg"
        >
          {"<react "}
          <span className="text-accent">patterns</span>
          {" />"}
        </Link>

        <div className="flex items-center gap-2">
          <TopControls />
          <button
            ref={trigger}
            type="button"
            onClick={() => setNavOpen((open) => !open)}
            aria-expanded={navOpen}
            aria-controls="pattern-drawer"
            aria-label={navOpen ? "Close pattern list" : "Open pattern list"}
            className="grid size-8 place-items-center rounded-md border border-line bg-surface text-muted transition-colors hover:border-accent-line hover:text-fg"
          >
            {navOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {navOpen && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-40 lg:hidden">
          {/* Outside press closes. Sibling of the panel, so a click inside never reaches it. */}
          <button
            type="button"
            aria-label="Close pattern list"
            onClick={() => setNavOpen(false)}
            className="rdp-fade-in absolute inset-0 h-full w-full cursor-default bg-black/50"
          />

          <div
            id="pattern-drawer"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Patterns"
            tabIndex={-1}
            className="rdp-slide-in absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-line bg-surface shadow-2xl outline-none"
          >
            <Sidebar showBrand={false} onNavigate={() => setNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop only — the mobile header already carries these. */}
      <TopControls className="fixed right-4 top-3 z-30 hidden lg:flex" />

      <aside className="sticky top-0 hidden h-svh border-r border-line bg-surface lg:block">
        <Sidebar />
      </aside>

      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
