/**
 * A fake network, so demos need no backend and can reproduce slow, flaky and failing
 * requests on demand.
 *
 * These are primitives, not a data-fetching hook. Several patterns later in the catalog
 * exist precisely to teach fetching — races, waterfalls, caching, dedup — and shipping a
 * polished `useQuery` here would hand them the answer before the lesson.
 */

export class FakeNetworkError extends Error {
  constructor(message = "Request failed with status 503") {
    super(message);
    this.name = "FakeNetworkError";
  }
}

export function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }

    const timer = setTimeout(resolve, ms);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

export interface FakeRequestOptions {
  /** Round-trip time in milliseconds. */
  latency?: number;
  /** Reject instead of resolving. */
  fail?: boolean;
  message?: string;
  /** Cancels the in-flight request, as a real fetch would. */
  signal?: AbortSignal;
}

/**
 * Resolves `value` after a delay, or rejects if `fail` is set.
 *
 * Pass a factory rather than a value when the result should be computed at request time
 * — that keeps each call independent instead of sharing one mutable object.
 */
export async function fakeRequest<T>(
  value: T | (() => T),
  options: FakeRequestOptions = {},
): Promise<T> {
  const { latency = 600, fail = false, message, signal } = options;

  await delay(latency, signal);

  if (fail) throw new FakeNetworkError(message);

  return typeof value === "function" ? (value as () => T)() : value;
}
