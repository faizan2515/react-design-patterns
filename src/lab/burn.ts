/**
 * Burns CPU synchronously for roughly `ms` milliseconds.
 *
 * A busy loop rather than a timer, because the point is to block the render itself —
 * that is what turns an unnecessary re-render from something you take on faith into
 * something you can feel.
 */
export function burn(ms: number): void {
  const until = performance.now() + ms;
  while (performance.now() < until) {
    /* deliberately blocking */
  }
}
