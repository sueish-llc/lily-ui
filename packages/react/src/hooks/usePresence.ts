import { useCallback, useEffect, useRef, useState } from 'react';
import { shouldSkipMotion } from '../motion/level';

export type PresenceState = 'open' | 'closed';

export interface UsePresenceOptions {
  /**
   * Fallback unmount delay (ms) used only if no `animationend`/`transitionend`
   * fires (interrupted transitions, `display:contents`, etc.). Default 320ms
   * (the slowest UI transition token).
   */
  fallbackMs?: number;
}

export interface UsePresenceResult {
  /** Render the node while true — stays true through the exit animation. */
  isPresent: boolean;
  /** Spread as `data-state`; drives the CSS enter/exit. */
  state: PresenceState;
  /** Attach to the animated node so its animation end can be observed. */
  ref: (node: HTMLElement | null) => void;
}

/**
 * Keep a node mounted while its exit animation plays.
 *
 * Pass `present` (your open/visible boolean). On enter, the node mounts and a
 * frame later `state` flips to `'open'` so the CSS enter runs from its start
 * values. On exit, `state` flips to `'closed'` and the node stays mounted until
 * the animation ends (or a fallback timeout), then `isPresent` becomes false.
 *
 * Motion-tier aware: when motion is effectively off (OS reduced-motion or the
 * `data-motion="none"` tier) the exit is skipped and the node unmounts at once.
 * SSR-safe.
 *
 * @example
 * const { isPresent, state, ref } = usePresence(open);
 * return isPresent ? <div ref={ref} data-state={state} className="lily-animate …" /> : null;
 */
export function usePresence(
  present: boolean,
  options: UsePresenceOptions = {},
): UsePresenceResult {
  const { fallbackMs = 320 } = options;
  const nodeRef = useRef<HTMLElement | null>(null);
  const [isPresent, setIsPresent] = useState(present);
  // Start 'closed' so the first paint sits at the enter start values.
  const [state, setState] = useState<PresenceState>(present ? 'open' : 'closed');

  useEffect(() => {
    if (present) {
      setIsPresent(true);
      const raf = requestAnimationFrame(() => setState('open'));
      return () => cancelAnimationFrame(raf);
    }

    // Exit.
    setState('closed');

    if (typeof window === 'undefined' || shouldSkipMotion()) {
      setIsPresent(false);
      return;
    }
    const node = nodeRef.current;
    if (!node) {
      setIsPresent(false);
      return;
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setIsPresent(false);
    };
    // Ignore bubbled animations from descendants.
    const onEnd = (e: Event) => {
      if (e.target === node) finish();
    };
    node.addEventListener('transitionend', onEnd);
    node.addEventListener('animationend', onEnd);
    const timer = window.setTimeout(finish, fallbackMs);

    return () => {
      node.removeEventListener('transitionend', onEnd);
      node.removeEventListener('animationend', onEnd);
      window.clearTimeout(timer);
    };
  }, [present, fallbackMs]);

  const ref = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  return { isPresent, state, ref };
}
