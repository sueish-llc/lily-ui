/**
 * Motion tier ("performance / quality" axis), independent of the a11y axis
 * (`prefers-reduced-motion`). Reflected on `<html data-motion>` so the
 * `@lily-ui/css` layer degrades instantly; presence/animate helpers read the
 * same signals. Web Components have no provider component — apply the tier with
 * {@link applyMotionLevel} / {@link autoMotion}, mirroring the React/Vue
 * `MotionProvider`.
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

/** Resolve `'auto'` to a concrete tier from OS + device capability signals. */
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
 * Whether JS-driven exit animations should be skipped entirely. True when motion
 * is effectively off — OS reduced-motion, or the `data-motion="none"` tier.
 */
export function shouldSkipMotion(): boolean {
  if (prefersReducedMotion()) return true;
  if (typeof document === 'undefined') return false;
  return document.documentElement.getAttribute(MOTION_ATTR) === 'none';
}

/** Apply a tier to `<html data-motion>` (resolving `'auto'`). Returns the tier. */
export function applyMotionLevel(preference: MotionPreference): MotionLevel {
  const level = resolveMotionLevel(preference);
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute(MOTION_ATTR, level);
  }
  return level;
}

/**
 * Resolve the tier from device/OS signals, apply it, and keep it updated as the
 * reduced-motion preference changes. Returns a disposer.
 */
export function autoMotion(): () => void {
  applyMotionLevel('auto');
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onChange = () => applyMotionLevel('auto');
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

/**
 * Inline script body that applies the stored motion tier *before* hydration,
 * preventing a flash of full-motion. Inject into a `<script>` in the <head>.
 */
export function motionScript(storageKey = 'lily-motion'): string {
  // Escape `<` so a key containing `</script>` cannot terminate the inline
  // <script> tag early (classic script-injection vector).
  const key = JSON.stringify(storageKey).replace(/</g, '\\u003c');
  return `(function(){try{var p=localStorage.getItem(${key})||'auto';var l=p;if(p==='auto'){l=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches?'none':'full';}document.documentElement.setAttribute('data-motion',l);}catch(e){}})();`;
}
