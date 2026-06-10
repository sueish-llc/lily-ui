/**
 * Motion tier ("performance / quality" axis), independent of the a11y axis
 * (`prefers-reduced-motion`). The tier is reflected on `<html data-motion>` so
 * the `@lily-ui/css` layer degrades instantly; JS helpers (presence, animate)
 * read the same signals so visuals and behavior stay in lock-step.
 */

export const MOTION_ATTR = 'data-motion';

/** The concrete tiers the CSS layer understands. */
export type MotionLevel = 'full' | 'minimal' | 'none';
/** The tier plus `'auto'`, which resolves from device/OS signals. */
export type MotionPreference = MotionLevel | 'auto';

/** Whether the OS requests reduced motion (the accessibility axis). */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Resolve `'auto'` to a concrete tier from OS + device capability signals:
 * - reduced-motion → `none`
 * - Save-Data, low memory/cores, or a small coarse-pointer (mobile) → `minimal`
 * - otherwise → `full`
 */
export function detectMotionLevel(): MotionLevel {
  if (typeof window === 'undefined') return 'full';
  if (prefersReducedMotion()) return 'none';

  const nav = window.navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (nav.connection?.saveData) return 'minimal';
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) return 'minimal';
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) return 'minimal';

  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const small = window.matchMedia?.('(max-width: 640px)').matches;
  if (coarse && small) return 'minimal';

  return 'full';
}

/** Resolve a preference (possibly `'auto'`) to the concrete tier to apply. */
export function resolveMotionLevel(preference: MotionPreference): MotionLevel {
  return preference === 'auto' ? detectMotionLevel() : preference;
}

/**
 * Whether JS-driven exit animations should be skipped entirely (unmount at
 * once). True when motion is effectively off — OS reduced-motion, or the
 * `data-motion="none"` tier is active. `minimal` still plays a short fade, so it
 * is *not* skipped.
 */
export function shouldSkipMotion(): boolean {
  if (prefersReducedMotion()) return true;
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute(MOTION_ATTR) === 'none';
}
