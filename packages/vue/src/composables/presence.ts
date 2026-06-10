import { ref, watch, onBeforeUnmount, type ComponentPublicInstance, type Ref } from 'vue';
import { shouldSkipMotion } from './motion';

export type PresenceState = 'open' | 'closed';

/** A Vue template function-ref target (an element or a component instance). */
export type RefTarget = Element | ComponentPublicInstance | null;

export interface UsePresenceResult {
  /** Render the node while true — stays true through the exit animation. */
  isPresent: Ref<boolean>;
  /** Bind as `:data-state`; drives the CSS enter/exit. */
  state: Ref<PresenceState>;
  /** A function ref — bind with `:ref="node"` on the animated element. */
  node: (el: RefTarget) => void;
}

/**
 * Keep a node mounted while its exit animation plays — the Vue mirror of the
 * React `usePresence` hook (no `<Transition>`, to keep markup/class parity).
 *
 * Pass a `Ref<boolean>` (your open/visible state). On exit the element stays
 * mounted until its `animationend`/`transitionend` (or a fallback timeout).
 * Honors the motion tier: when motion is effectively off, it unmounts at once.
 */
export function usePresence(present: Ref<boolean>, fallbackMs = 320): UsePresenceResult {
  const isPresent = ref(present.value);
  const state = ref<PresenceState>(present.value ? 'open' : 'closed');
  const el = ref<HTMLElement | null>(null);
  let cleanup: (() => void) | null = null;

  const node = (next: RefTarget) => {
    el.value = next instanceof HTMLElement ? next : null;
  };

  watch(
    present,
    (value) => {
      cleanup?.();
      cleanup = null;

      if (value) {
        isPresent.value = true;
        requestAnimationFrame(() => (state.value = 'open'));
        return;
      }

      state.value = 'closed';
      if (typeof window === 'undefined' || shouldSkipMotion() || !el.value) {
        isPresent.value = false;
        return;
      }

      const target = el.value;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        isPresent.value = false;
      };
      const onEnd = (e: Event) => {
        if (e.target === target) finish();
      };
      target.addEventListener('transitionend', onEnd);
      target.addEventListener('animationend', onEnd);
      const timer = window.setTimeout(finish, fallbackMs);
      cleanup = () => {
        target.removeEventListener('transitionend', onEnd);
        target.removeEventListener('animationend', onEnd);
        window.clearTimeout(timer);
      };
    },
    { immediate: true },
  );

  onBeforeUnmount(() => cleanup?.());

  return { isPresent, state, node };
}
