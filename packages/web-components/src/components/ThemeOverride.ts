import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';
import {
  buildThemeOverrideCss,
  warnContrastIssues,
  THEME_OVERRIDE_ATTR,
  type ThemeColorOverrides,
  type ThemeOverrideInput,
} from '../utils/themeOverride';

/**
 * `<lily-theme-override>` — re-colors its subtree with personal color
 * preferences by overriding the semantic `--lily-color-*` tokens, while the
 * accessible defaults keep applying everywhere else.
 *
 * Attributes carry JSON maps of token name (without the `--lily-color-`
 * prefix) to CSS color value — the string only exists at the attribute edge
 * and is parsed into typed maps internally:
 *
 * - `colors` — applied in both color schemes;
 * - `light` / `dark` — applied only while that scheme is active, following
 *   the same `data-theme` + `prefers-color-scheme` logic as the base
 *   stylesheet.
 *
 * The overrides never reach outside this subtree. For app-wide overrides,
 * set the `--lily-color-*` variables in your own stylesheet — the same
 * contract as theme switching via `<html data-theme>`:
 *
 * ```css
 * :root[data-theme='light'] { --lily-color-primary: #115e59; }
 * :root[data-theme='dark'] { --lily-color-primary: #5eead4; }
 * ```
 *
 * Overrides are partial: only the tokens you name change. The wrapper is
 * `display: contents`, so layout is unaffected, and instances nest (the
 * closest one wins). In development, text/background pairs overridden
 * together are checked against the WCAG 2.1 AAA contrast floor (7:1).
 *
 * @example
 * ```html
 * <lily-theme-override
 *   colors='{"primary": "#115e59", "on-primary": "#ffffff"}'
 *   dark='{"bg-canvas": "#101418"}'
 * >
 *   <lily-button status="primary">保存する</lily-button>
 * </lily-theme-override>
 * ```
 */
export class LilyThemeOverride extends LilyElement {
  static get observedAttributes(): string[] {
    return ['colors', 'light', 'dark'];
  }

  // Stable across re-renders so the scope attribute and stylesheet agree.
  private _scopeId: string | undefined;

  private parseOverrides(name: string): ThemeColorOverrides | undefined {
    const raw = this.attr(name);
    if (!raw) return undefined;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as ThemeColorOverrides;
      }
    } catch {
      // fall through to the warning below
    }
    console.warn(`[lily-ui] <lily-theme-override>: the "${name}" attribute must be a JSON object.`);
    return undefined;
  }

  protected build(): BuildResult {
    const input: ThemeOverrideInput = {
      colors: this.parseOverrides('colors'),
      light: this.parseOverrides('light'),
      dark: this.parseOverrides('dark'),
    };
    this._scopeId ??= uid('lily-theme-override');
    const css = buildThemeOverrideCss(this._scopeId, input, 'lily-theme-override');
    warnContrastIssues(input, 'lily-theme-override');

    const root = h('div', {
      class: 'lily-theme-override',
      attrs: { [THEME_OVERRIDE_ATTR]: this._scopeId },
    });
    if (css) root.appendChild(h('style', { text: css }));
    return { root };
  }
}
