/**
 * The animation catalog — the typed mirror of the `.lily-animate--*` utilities
 * emitted by `@lily-ui/css`. Must stay in sync with the React source of truth
 * and `packages/css/src/styles/utilities/_animations.scss`.
 */

/** Attention-seekers — looping-friendly emphasis (use sparingly; AAA 2.2.2). */
export const ATTENTION_ANIMATIONS = [
  'bounce',
  'flash',
  'pulse',
  'rubber-band',
  'shake-x',
  'shake-y',
  'head-shake',
  'swing',
  'tada',
  'wobble',
  'jello',
  'heart-beat',
] as const;

/** Entrances — for elements appearing/mounting. */
export const ENTRANCE_ANIMATIONS = [
  'fade-in',
  'fade-in-up',
  'fade-in-down',
  'fade-in-left',
  'fade-in-right',
  'fade-in-up-big',
  'fade-in-down-big',
  'fade-in-left-big',
  'fade-in-right-big',
  'zoom-in',
  'zoom-in-up',
  'zoom-in-down',
  'zoom-in-left',
  'zoom-in-right',
  'slide-in-up',
  'slide-in-down',
  'slide-in-left',
  'slide-in-right',
  'bounce-in',
  'bounce-in-up',
  'bounce-in-down',
  'bounce-in-left',
  'bounce-in-right',
  'flip-in-x',
  'flip-in-y',
  'back-in-up',
  'back-in-down',
  'back-in-left',
  'back-in-right',
  'roll-in',
  'light-speed-in-left',
  'light-speed-in-right',
  'jack-in-the-box',
] as const;

/** Exits — for elements leaving/unmounting. */
export const EXIT_ANIMATIONS = [
  'fade-out',
  'fade-out-up',
  'fade-out-down',
  'fade-out-left',
  'fade-out-right',
  'fade-out-up-big',
  'fade-out-down-big',
  'fade-out-left-big',
  'fade-out-right-big',
  'zoom-out',
  'zoom-out-up',
  'zoom-out-down',
  'zoom-out-left',
  'zoom-out-right',
  'slide-out-up',
  'slide-out-down',
  'slide-out-left',
  'slide-out-right',
  'bounce-out',
  'bounce-out-up',
  'bounce-out-down',
  'bounce-out-left',
  'bounce-out-right',
  'flip-out-x',
  'flip-out-y',
  'back-out-up',
  'back-out-down',
  'back-out-left',
  'back-out-right',
  'roll-out',
  'light-speed-out-left',
  'light-speed-out-right',
  'hinge',
] as const;

/** Every animation name in the catalog. */
export const ANIMATION_NAMES = [
  ...ATTENTION_ANIMATIONS,
  ...ENTRANCE_ANIMATIONS,
  ...EXIT_ANIMATIONS,
] as const;

export type AttentionAnimation = (typeof ATTENTION_ANIMATIONS)[number];
export type EntranceAnimation = (typeof ENTRANCE_ANIMATIONS)[number];
export type ExitAnimation = (typeof EXIT_ANIMATIONS)[number];
/** A valid `.lily-animate--<name>` animation. */
export type AnimationName = (typeof ANIMATION_NAMES)[number];

/** Build the class list for an animation, e.g. `lily-animate lily-animate--fade-in`. */
export function animationClass(name: AnimationName): string {
  return `lily-animate lily-animate--${name}`;
}
