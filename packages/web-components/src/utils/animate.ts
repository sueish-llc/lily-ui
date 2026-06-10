import type { AnimationName } from './animations';

const BASE = 'lily-animate';

/**
 * Imperatively play a catalog animation on `el` — the Web Components mirror of
 * the React `useAnimate` hook. Re-applying the same name re-triggers it;
 * `will-change` is set only while running, then cleared. Resolves when it ends.
 *
 * @example
 * animate(field, 'shake-x');
 */
export function animate(el: HTMLElement, name: AnimationName): Promise<void> {
  const cls = `${BASE}--${name}`;

  el.classList.remove(BASE, cls);
  void el.offsetWidth; // force reflow so the same animation can replay
  el.style.willChange = 'transform, opacity';
  el.classList.add(BASE, cls);

  return new Promise<void>((resolve) => {
    const cleanup = () => {
      el.removeEventListener('animationend', onEnd);
      el.removeEventListener('animationcancel', onEnd);
      el.style.willChange = '';
      el.classList.remove(cls);
      resolve();
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target === el) cleanup();
    };
    el.addEventListener('animationend', onEnd);
    el.addEventListener('animationcancel', onEnd);
  });
}
