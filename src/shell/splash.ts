/** Keeps the splash up long enough for the brackets to finish opening. */
const MIN_VISIBLE_MS = 1250;
const FADE_MS = 400;

declare global {
  interface Window {
    __rdpSplashStart?: number;
  }
}

/**
 * Dismisses the splash once React has mounted *and* the animation has had time to play.
 *
 * Two failure modes to avoid, and they pull in opposite directions: hiding as soon as the
 * app is ready makes a fast load flash a half-finished animation, while hiding on a fixed
 * timer makes a slow load sit on a finished one. Waiting for whichever is later handles
 * both, and on a genuinely slow load costs nothing at all.
 */
export function dismissSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;

  const elapsed = performance.now() - (window.__rdpSplashStart ?? 0);
  const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

  setTimeout(() => {
    splash.classList.add("is-done");
    // Removed rather than left invisible, so it cannot trap focus or catch pointer events.
    setTimeout(() => splash.remove(), FADE_MS);
  }, remaining);
}
