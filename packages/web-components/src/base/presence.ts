import { shouldSkipMotion } from '../utils/motion';

/**
 * Presence helpers — keep a portaled/overlay element in the DOM while its exit
 * animation plays, the Web Components mirror of the React `usePresence` hook.
 *
 * Elements set `data-state="open" | "closed"` so CSS can drive enter/exit; the
 * runtime defers removal until the animation ends (or a fallback). Honors the
 * motion tier: when motion is effectively off, exits complete synchronously.
 */

/** Mark an element as entering: start closed, then flip to open next frame. */
export function enter(el: HTMLElement): void {
  el.setAttribute('data-state', 'closed');
  requestAnimationFrame(() => el.setAttribute('data-state', 'open'));
}

/**
 * Mark an element as exiting (`data-state="closed"`) and invoke `onDone` once
 * its animation/transition ends — or immediately when motion is off.
 */
export function exit(el: HTMLElement, onDone: () => void, fallbackMs = 320): void {
  el.setAttribute('data-state', 'closed');

  if (typeof window === 'undefined' || shouldSkipMotion()) {
    onDone();
    return;
  }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    cleanup();
    onDone();
  };
  const onEnd = (e: Event) => {
    if (e.target === el) finish();
  };
  const timer = window.setTimeout(finish, fallbackMs);
  const cleanup = () => {
    el.removeEventListener('animationend', onEnd);
    el.removeEventListener('transitionend', onEnd);
    window.clearTimeout(timer);
  };
  el.addEventListener('animationend', onEnd);
  el.addEventListener('transitionend', onEnd);
}
