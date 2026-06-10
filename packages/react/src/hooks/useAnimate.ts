import { useCallback, useRef } from 'react';
import type { AnimationName } from '../motion/animations';

export interface UseAnimateResult<T extends HTMLElement> {
  /** Attach to the element you want to animate. */
  ref: (node: T | null) => void;
  /** Play an animation now (re-triggerable); resolves when it ends. */
  play: (name: AnimationName) => Promise<void>;
}

const BASE = 'lily-animate';

/**
 * Imperatively play a catalog animation on demand — ideal for attention-seekers
 * fired by an event (e.g. shake an invalid field). Re-applying the same name
 * re-triggers it. `will-change` is set only while running, then cleared.
 *
 * @example
 * const { ref, play } = useAnimate<HTMLDivElement>();
 * <div ref={ref} />;
 * // later: play('shake-x');
 */
export function useAnimate<T extends HTMLElement = HTMLElement>(): UseAnimateResult<T> {
  const nodeRef = useRef<T | null>(null);

  const ref = useCallback((node: T | null) => {
    nodeRef.current = node;
  }, []);

  const play = useCallback((name: AnimationName) => {
    const node = nodeRef.current;
    if (!node) return Promise.resolve();
    const cls = `${BASE}--${name}`;

    // Clear any previous run so the same animation can replay.
    node.classList.remove(BASE, cls);
    void node.offsetWidth; // force reflow so the removal takes effect
    node.style.willChange = 'transform, opacity';
    node.classList.add(BASE, cls);

    return new Promise<void>((resolve) => {
      const cleanup = () => {
        node.removeEventListener('animationend', onEnd);
        node.removeEventListener('animationcancel', onEnd);
        node.style.willChange = '';
        node.classList.remove(cls);
        resolve();
      };
      const onEnd = (e: AnimationEvent) => {
        if (e.target === node) cleanup();
      };
      node.addEventListener('animationend', onEnd);
      node.addEventListener('animationcancel', onEnd);
    });
  }, []);

  return { ref, play };
}
