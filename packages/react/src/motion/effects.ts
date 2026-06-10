/**
 * The effect catalog — the typed mirror of the `.lily-fx--*` decorative effects
 * emitted by `@lily-ui/css`. Where {@link AnimationName} covers one-shot
 * entrances/exits, these are the standing decorations (shimmering text, glowing
 * borders, drifting backgrounds, hover sheen). Keeping the names here lets
 * editors/agents complete only valid effects and lets helpers accept a checked
 * `EffectName` instead of a free string.
 *
 * Must stay in sync with `packages/css/src/styles/utilities/_effects.scss`.
 */

/** Text effects — applied to a text element (best on large/display text). */
export const TEXT_EFFECTS = ['gradient-text', 'shine-text', 'glitch'] as const;

/** Hover effects — transition-based, triggered on `:hover`. */
export const HOVER_EFFECTS = ['lift', 'grow', 'glare'] as const;

/** Ambient effects — continuous, opt-in decoration on an element. */
export const AMBIENT_EFFECTS = [
  'float',
  'glow',
  'shimmer',
  'star-border',
] as const;

/** Background effects — for a section/hero container. */
export const BACKGROUND_EFFECTS = ['aurora', 'gradient-bg'] as const;

/** Every effect name in the catalog. */
export const EFFECT_NAMES = [
  ...TEXT_EFFECTS,
  ...HOVER_EFFECTS,
  ...AMBIENT_EFFECTS,
  ...BACKGROUND_EFFECTS,
] as const;

/** Tempo modifiers — retune `--lily-fx-duration` for every loop at once. */
export const EFFECT_TEMPOS = ['lively', 'calm'] as const;

export type TextEffect = (typeof TEXT_EFFECTS)[number];
export type HoverEffect = (typeof HOVER_EFFECTS)[number];
export type AmbientEffect = (typeof AMBIENT_EFFECTS)[number];
export type BackgroundEffect = (typeof BACKGROUND_EFFECTS)[number];
/** A valid `.lily-fx--<name>` effect. */
export type EffectName = (typeof EFFECT_NAMES)[number];
export type EffectTempo = (typeof EFFECT_TEMPOS)[number];

/**
 * Build the class list for one or more effects, e.g.
 * `effectClass('lift', 'glow')` → `lily-fx lily-fx--lift lily-fx--glow`.
 * Effects compose, so several can share the single `lily-fx` base.
 */
export function effectClass(...names: EffectName[]): string {
  return ['lily-fx', ...names.map((n) => `lily-fx--${n}`)].join(' ');
}
