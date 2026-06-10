/**
 * Design tokens — TypeScript surface (`@lily-ui/react/tokens`).
 *
 * These mirror the SCSS token maps in `@lily-ui/css` so that JS/TS consumers
 * (and AI tools) can reference tokens type-safely without hard-coding values.
 * The *values* live in CSS custom properties at runtime; this module exposes:
 *
 * - {@link cssVar} — build a `var(--lily-*)` reference string.
 * - Named scale keys, so editors can autocomplete valid token names.
 *
 * @packageDocumentation
 */

/** Prefix shared with the CSS layer (`@lily-ui/css` `abstracts/_config.scss`). */
export const TOKEN_PREFIX = 'lily' as const;

/**
 * Build a CSS custom-property reference for a token.
 *
 * @example
 * ```ts
 * cssVar('color-primary'); // "var(--lily-color-primary)"
 * cssVar('space-4', '0');  // "var(--lily-space-4, 0)"
 * ```
 */
export function cssVar(name: string, fallback?: string): string {
  const ref = `--${TOKEN_PREFIX}-${name}`;
  return fallback === undefined ? `var(${ref})` : `var(${ref}, ${fallback})`;
}

/** Spacing scale keys (4px grid). */
export const spacing = [
  '0', 'px', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24',
] as const;
export type SpacingToken = (typeof spacing)[number];

/** Border-radius scale keys. */
export const radius = ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'pill', 'circle'] as const;
export type RadiusToken = (typeof radius)[number];

/** Font-size scale keys. */
export const fontSize = [
  'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl',
] as const;
export type FontSizeToken = (typeof fontSize)[number];

/** Font-weight keys. */
export const fontWeight = ['regular', 'medium', 'bold', 'extrabold'] as const;
export type FontWeightToken = (typeof fontWeight)[number];

/** Elevation (shadow) keys. */
export const shadow = ['none', 'sm', 'md', 'lg', 'xl'] as const;
export type ShadowToken = (typeof shadow)[number];

/** Component size keys (panel/overlay widths, menu min-widths, …). */
export const size = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type SizeToken = (typeof size)[number];

/** Named breakpoints (mobile-first min-widths, px). */
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  '2xl': 1400,
} as const;
export type BreakpointToken = keyof typeof breakpoints;

/** Semantic color token names (theme-aware). */
export const semanticColors = [
  'color-bg-canvas', 'color-bg-surface', 'color-bg-subtle', 'color-bg-muted', 'color-bg-inverse',
  'color-fg-default', 'color-fg-muted', 'color-fg-subtle', 'color-fg-on-emphasis', 'color-fg-inverse',
  'color-border-default', 'color-border-strong', 'color-border-focus',
  'color-primary', 'color-primary-hover', 'color-primary-active', 'color-primary-subtle', 'color-on-primary',
  'color-accent', 'color-accent-hover', 'color-accent-active', 'color-accent-subtle', 'color-on-accent',
  'color-primary-gradient', 'color-accent-gradient',
  'color-danger', 'color-danger-hover', 'color-danger-subtle', 'color-on-danger',
  'color-warning', 'color-warning-hover', 'color-warning-subtle', 'color-on-warning',
  'color-success', 'color-success-hover', 'color-success-subtle', 'color-on-success',
  'color-info', 'color-info-hover', 'color-info-subtle', 'color-on-info',
  'color-focus-ring',
] as const;
export type SemanticColorToken = (typeof semanticColors)[number];
