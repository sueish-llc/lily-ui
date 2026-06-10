// =============================================================================
// ThemeOverride helpers
// -----------------------------------------------------------------------------
// Turns per-scheme maps of semantic color-token overrides into a scoped
// stylesheet, and checks user-picked text/background pairs against the WCAG
// 2.1 AAA contrast floor (7:1) so a personalized theme can't silently undo
// the library's accessibility guarantees.
//
// Kept dependency-free and identical across the React, Vue, and Web Components
// packages (like `cx`).
// =============================================================================

/** Semantic color tokens that can be overridden (the `--lily-color-*` set). */
export type ColorTokenName =
  | 'bg-canvas'
  | 'bg-surface'
  | 'bg-subtle'
  | 'bg-muted'
  | 'bg-inverse'
  | 'fg-default'
  | 'fg-muted'
  | 'fg-subtle'
  | 'fg-on-emphasis'
  | 'fg-inverse'
  | 'border-default'
  | 'border-strong'
  | 'border-focus'
  | 'primary'
  | 'primary-hover'
  | 'primary-active'
  | 'primary-subtle'
  | 'on-primary'
  | 'accent'
  | 'accent-hover'
  | 'accent-active'
  | 'accent-subtle'
  | 'on-accent'
  | 'primary-gradient'
  | 'accent-gradient'
  | 'danger'
  | 'danger-hover'
  | 'danger-subtle'
  | 'on-danger'
  | 'warning'
  | 'warning-hover'
  | 'warning-subtle'
  | 'on-warning'
  | 'success'
  | 'success-hover'
  | 'success-subtle'
  | 'on-success'
  | 'info'
  | 'info-hover'
  | 'info-subtle'
  | 'on-info'
  | 'primary-text'
  | 'accent-text'
  | 'danger-text'
  | 'warning-text'
  | 'success-text'
  | 'info-text'
  | 'focus-ring';

/**
 * A partial map of semantic color tokens to CSS color values. Keys are token
 * names without the `--lily-color-` prefix (e.g. `'primary'`); any other
 * `--lily-color-*` token name is accepted as a plain string.
 */
export type ThemeColorOverrides = Partial<Record<ColorTokenName, string>> & {
  [token: string]: string | undefined;
};

/** The three override buckets a ThemeOverride accepts, plus the global flag. */
export interface ThemeOverrideInput {
  /** Applied in both color schemes. */
  colors?: ThemeColorOverrides;
  /** Applied only while the light scheme is active. */
  light?: ThemeColorOverrides;
  /** Applied only while the dark scheme is active. */
  dark?: ThemeColorOverrides;
  /**
   * Apply at `:root` (whole app) instead of a wrapper's subtree. Not exposed
   * on ThemeOverride — app-wide overrides are a ThemeProvider concern, so only
   * ThemeProvider passes this.
   */
  global?: boolean;
}

/** The scoping attribute the ThemeOverride component sets on its wrapper. */
export const THEME_OVERRIDE_ATTR = 'data-lily-theme-override';

/** WCAG 2.1 AAA (1.4.6) minimum contrast for body text. */
export const AAA_TEXT_CONTRAST = 7;

const TOKEN_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
// Characters that could terminate the generated declaration, rule, or
// <style> element early — user-picked values must never break out of scope.
const UNSAFE_VALUE = /[;{}<>\\]/;

function isDev(): boolean {
  // Avoid a hard dependency on Node typings: read `process` off globalThis.
  const env = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env;
  return env !== undefined && env.NODE_ENV !== 'production';
}

function declarationsFor(overrides: ThemeColorOverrides | undefined, source: string): string {
  if (!overrides) return '';
  const out: string[] = [];
  for (const [token, value] of Object.entries(overrides)) {
    if (typeof value !== 'string' || value.trim() === '') continue;
    if (!TOKEN_NAME.test(token) || UNSAFE_VALUE.test(value)) {
      if (isDev()) {
        console.warn(`[lily-ui] ${source}: ignored invalid color override "${token}".`);
      }
      continue;
    }
    out.push(`--lily-color-${token}: ${value.trim()};`);
  }
  return out.join(' ');
}

/**
 * Build the scoped stylesheet for one ThemeOverride instance. Mirrors the
 * scheme logic of `@lily-ui/css` (`:root[data-theme]`, falling back to
 * `prefers-color-scheme` when no explicit theme is set), so scheme-specific
 * overrides follow the active theme purely in CSS — no JS observation.
 *
 * With `global` (used by ThemeProvider), the rules target `:root` itself (per
 * scheme, so they win over the base stylesheet's scheme rules in the cascade);
 * they then reach everything, including `body` backgrounds and overlays
 * portaled to `body`.
 */
export function buildThemeOverrideCss(
  scopeId: string,
  input: ThemeOverrideInput,
  source = 'ThemeOverride',
): string {
  const rules: string[] = [];
  if (input.global) {
    // Merge the scheme-independent overrides into both schemes: emitting only
    // scheme-strength rules keeps them above `:root[data-theme]` in the base
    // stylesheet, which a plain `:root` rule would lose to on specificity.
    const light = declarationsFor({ ...input.colors, ...input.light }, source);
    if (light) {
      rules.push(`:root[data-theme='light'] { ${light} }`);
      rules.push(
        `@media (prefers-color-scheme: light) { :root:not([data-theme]) { ${light} } }`,
      );
    }
    const dark = declarationsFor({ ...input.colors, ...input.dark }, source);
    if (dark) {
      rules.push(`:root[data-theme='dark'] { ${dark} }`);
      rules.push(`@media (prefers-color-scheme: dark) { :root:not([data-theme]) { ${dark} } }`);
    }
    return rules.join('\n');
  }
  const scope = `[${THEME_OVERRIDE_ATTR}='${scopeId.replace(/['"\\]/g, '')}']`;
  const base = declarationsFor(input.colors, source);
  if (base) rules.push(`${scope} { ${base} }`);
  const light = declarationsFor(input.light, source);
  if (light) {
    rules.push(`:root[data-theme='light'] ${scope} { ${light} }`);
    rules.push(
      `@media (prefers-color-scheme: light) { :root:not([data-theme]) ${scope} { ${light} } }`,
    );
  }
  const dark = declarationsFor(input.dark, source);
  if (dark) {
    rules.push(`:root[data-theme='dark'] ${scope} { ${dark} }`);
    rules.push(
      `@media (prefers-color-scheme: dark) { :root:not([data-theme]) ${scope} { ${dark} } }`,
    );
  }
  return rules.join('\n');
}

// --- AAA contrast checking ---------------------------------------------------

const STATUS_ROLES = ['primary', 'accent', 'danger', 'warning', 'success', 'info'] as const;

// Text/background token pairs whose contrast the checker verifies when both
// members are overridden in the same scheme.
const CONTRAST_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ['fg-default', 'bg-canvas'],
  ['fg-default', 'bg-surface'],
  ['fg-muted', 'bg-canvas'],
  ['fg-muted', 'bg-surface'],
  ...STATUS_ROLES.map((role) => [`on-${role}`, role] as const),
  ...STATUS_ROLES.flatMap((role) => [
    [`${role}-text`, 'bg-canvas'] as const,
    [`${role}-text`, 'bg-surface'] as const,
  ]),
];

function srgbChannel(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

// Parse a fully opaque solid color (#rgb/#rgba/#rrggbb/#rrggbbaa, rgb()/rgba())
// into [r, g, b]. Anything else — keywords, var(), gradients, translucency —
// returns null and is treated as "not checkable".
function parseColor(value: string): [number, number, number] | null {
  const v = value.trim().toLowerCase();
  const hexMatch = v.match(/^#([0-9a-f]{3,8})$/);
  if (hexMatch) {
    const hex = hexMatch[1] ?? '';
    if (hex.length === 3 || hex.length === 4) {
      if (hex.length === 4 && hex.charAt(3) !== 'f') return null;
      return [0, 1, 2].map((i) => parseInt(hex.charAt(i) + hex.charAt(i), 16)) as [
        number,
        number,
        number,
      ];
    }
    if (hex.length === 6 || hex.length === 8) {
      if (hex.length === 8 && hex.slice(6) !== 'ff') return null;
      return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
    }
    return null;
  }
  const rgbMatch = v.match(
    /^rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/,
  );
  if (rgbMatch) {
    const alpha = rgbMatch[4];
    if (alpha !== undefined && parseFloat(alpha) < (alpha.endsWith('%') ? 100 : 1)) return null;
    const channels = [rgbMatch[1] ?? '', rgbMatch[2] ?? '', rgbMatch[3] ?? ''].map(Number);
    if (channels.some((c) => c > 255)) return null;
    return channels as [number, number, number];
  }
  return null;
}

function luminance([r, g, b]: [number, number, number]): number {
  return 0.2126 * srgbChannel(r) + 0.7152 * srgbChannel(g) + 0.0722 * srgbChannel(b);
}

/**
 * WCAG relative-luminance contrast ratio between two solid colors (1–21).
 * Returns `null` when either value can't be parsed as an opaque solid color;
 * callers should treat that as "not checkable", not as a pass.
 */
export function contrastRatio(a: string, b: string): number | null {
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (!ca || !cb) return null;
  const la = luminance(ca);
  const lb = luminance(cb);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** One text/background pair that falls below the AAA floor. */
export interface ContrastIssue {
  /** Which scheme the failing pair applies to. */
  scheme: 'light' | 'dark' | 'both';
  /** Foreground (text) token name and overridden value. */
  foreground: { token: string; value: string };
  /** Background token name and overridden value. */
  background: { token: string; value: string };
  /** Computed contrast ratio, rounded to two decimals. */
  ratio: number;
}

/**
 * Check the known text/background pairs among the given overrides against the
 * AAA floor (7:1). Only pairs where *both* tokens are overridden in the same
 * scheme — and both parse as opaque solid colors — are checked; pairing a
 * custom color with a library default is the integrator's responsibility.
 *
 * Useful at runtime too, e.g. to validate an end user's picks in a theme
 * settings screen before applying them.
 */
export function findContrastIssues(input: ThemeOverrideInput): ContrastIssue[] {
  const schemes: ReadonlyArray<readonly ['light' | 'dark', ThemeColorOverrides]> = [
    ['light', { ...input.colors, ...input.light }],
    ['dark', { ...input.colors, ...input.dark }],
  ];
  const issues: ContrastIssue[] = [];
  for (const [scheme, bucket] of schemes) {
    for (const [fg, bg] of CONTRAST_PAIRS) {
      const fgValue = bucket[fg];
      const bgValue = bucket[bg];
      if (typeof fgValue !== 'string' || typeof bgValue !== 'string') continue;
      const ratio = contrastRatio(fgValue, bgValue);
      if (ratio === null || ratio >= AAA_TEXT_CONTRAST) continue;
      const issue: ContrastIssue = {
        scheme,
        foreground: { token: fg, value: fgValue },
        background: { token: bg, value: bgValue },
        ratio: Math.round(ratio * 100) / 100,
      };
      // The same pair failing identically in both schemes collapses into one
      // 'both' entry.
      const twin = issues.find(
        (m) =>
          m.scheme !== issue.scheme &&
          m.foreground.token === issue.foreground.token &&
          m.foreground.value === issue.foreground.value &&
          m.background.token === issue.background.token &&
          m.background.value === issue.background.value,
      );
      if (twin) {
        twin.scheme = 'both';
      } else {
        issues.push(issue);
      }
    }
  }
  return issues;
}

/** Dev-only console warning used by the ThemeOverride components. */
export function warnContrastIssues(input: ThemeOverrideInput, source: string): void {
  if (!isDev()) return;
  for (const issue of findContrastIssues(input)) {
    const where = issue.scheme === 'both' ? 'both schemes' : `the ${issue.scheme} scheme`;
    console.warn(
      `[lily-ui] ${source}: "${issue.foreground.token}" (${issue.foreground.value}) on ` +
        `"${issue.background.token}" (${issue.background.value}) is ${issue.ratio}:1 in ${where} — ` +
        `below the WCAG AAA floor of ${AAA_TEXT_CONTRAST}:1.`,
    );
  }
}
