import { ref, type ComponentPublicInstance, type Ref } from 'vue';
import type { AnimationName } from './animations';

const BASE = 'lily-animate';

/** A Vue template function-ref target (an element or a component instance). */
export type RefTarget = Element | ComponentPublicInstance | null;

export interface UseAnimateResult {
  /** Bind with `:ref="node"` on the element to animate. */
  node: (el: RefTarget) => void;
  /** Play an animation now (re-triggerable); resolves when it ends. */
  play: (name: AnimationName) => Promise<void>;
}

/**
 * Imperatively play a catalog animation on demand — the Vue mirror of the React
 * `useAnimate` hook. Re-applying the same name re-triggers it; `will-change` is
 * set only while running, then cleared.
 */
export function useAnimate(): UseAnimateResult {
  const el: Ref<HTMLElement | null> = ref(null);

  const node = (next: RefTarget) => {
    el.value = next instanceof HTMLElement ? next : null;
  };

  const play = (name: AnimationName): Promise<void> => {
    const target = el.value;
    if (!target) return Promise.resolve();
    const cls = `${BASE}--${name}`;

    target.classList.remove(BASE, cls);
    void target.offsetWidth; // force reflow so the same animation can replay
    target.style.willChange = 'transform, opacity';
    target.classList.add(BASE, cls);

    return new Promise<void>((resolve) => {
      const cleanup = () => {
        target.removeEventListener('animationend', onEnd);
        target.removeEventListener('animationcancel', onEnd);
        target.style.willChange = '';
        target.classList.remove(cls);
        resolve();
      };
      const onEnd = (e: AnimationEvent) => {
        if (e.target === target) cleanup();
      };
      target.addEventListener('animationend', onEnd);
      target.addEventListener('animationcancel', onEnd);
    });
  };

  return { node, play };
}
