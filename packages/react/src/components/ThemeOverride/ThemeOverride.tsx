import { forwardRef, useEffect, useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import {
  buildThemeOverrideCss,
  warnContrastIssues,
  THEME_OVERRIDE_ATTR,
  type ThemeColorOverrides,
} from '../../utils/themeOverride';

export interface ThemeOverrideProps extends HTMLAttributes<HTMLDivElement> {
  /** Token overrides applied in both color schemes. */
  colors?: ThemeColorOverrides;
  /** Token overrides applied only while the light scheme is active. */
  light?: ThemeColorOverrides;
  /** Token overrides applied only while the dark scheme is active. */
  dark?: ThemeColorOverrides;
  children?: ReactNode;
}

/**
 * ThemeOverride — re-colors a subtree with personal color preferences by
 * overriding the semantic `--lily-color-*` tokens, while the accessible
 * defaults keep applying everywhere else.
 *
 * Overrides are partial: only the tokens you name change, per scheme if you
 * want (`light` / `dark` apply only while that scheme is active, following the
 * same `data-theme` + `prefers-color-scheme` logic as the base stylesheet —
 * no JS observation involved). The wrapper is `display: contents`, so layout
 * is unaffected, and instances nest (the closest one wins). The overrides
 * never reach outside this subtree — to re-color the whole app, pass the same
 * `colors` / `light` / `dark` to `ThemeProvider` instead.
 *
 * In development, text/background pairs overridden together (e.g.
 * `on-primary` and `primary`) are checked against the WCAG 2.1 AAA contrast
 * floor (7:1) and failures are logged. To validate an end user's picks at
 * runtime — say, in a theme settings screen — use {@link findContrastIssues}.
 *
 * @example
 * ```tsx
 * <ThemeOverride
 *   colors={{ primary: '#115e59', 'primary-hover': '#134e4a', 'on-primary': '#ffffff' }}
 *   dark={{ 'bg-canvas': '#101418' }}
 * >
 *   <Button status="primary">保存する</Button>
 * </ThemeOverride>
 * ```
 */
export const ThemeOverride = forwardRef<HTMLDivElement, ThemeOverrideProps>(function ThemeOverride(
  { colors, light, dark, className, children, ...rest },
  ref,
) {
  const id = useId();
  const css = buildThemeOverrideCss(id, { colors, light, dark });

  // Dev-only AAA guard, keyed on the generated CSS so it re-runs only when
  // the effective overrides change, not on every render.
  useEffect(() => {
    warnContrastIssues({ colors, light, dark }, 'ThemeOverride');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [css]);

  const scopeAttr = { [THEME_OVERRIDE_ATTR]: id };

  return (
    <div ref={ref} className={cx('lily-theme-override', className)} {...scopeAttr} {...rest}>
      {css ? <style>{css}</style> : null}
      {children}
    </div>
  );
});
