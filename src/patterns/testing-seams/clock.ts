import { createContext, useContext } from "react";

/**
 * A seam: the thing a test needs to control, expressed as an interface and injected.
 *
 * `Date.now()` called directly inside a component is untestable — the assertion depends on
 * when it ran, so it passes locally and fails at midnight or in another timezone. Taking
 * the clock as a dependency means a test supplies a frozen one and the behaviour becomes
 * deterministic.
 *
 * The default is the real implementation, so production code needs no provider and nobody
 * pays a tax for testability they are not using.
 */
export interface Clock {
  now: () => Date;
}

export const systemClock: Clock = { now: () => new Date() };

export function fixedClock(iso: string): Clock {
  return { now: () => new Date(iso) };
}

export const ClockContext = createContext<Clock>(systemClock);

export function useClock(): Clock {
  return useContext(ClockContext);
}

/** The logic under test — a pure function of the two things it actually depends on. */
export function greetingFor(now: Date, name: string): string {
  const hour = now.getHours();
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 18) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}
