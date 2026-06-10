import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';
export type IconTone = 'default' | 'primary' | 'accent' | 'muted' | 'danger' | 'success' | 'warning' | 'info';

/**
 * `<lily-icon>` — a sizing/color wrapper around an inline SVG or glyph.
 * Decorative by default; set `label` to make it meaningful (`role="img"`).
 *
 * Attributes: `size`, `tone`, `label`.
 *
 * @example
 * ```html
 * <lily-icon size="lg" tone="primary" label="検索"><svg ...></svg></lily-icon>
 * ```
 */
export class LilyIcon extends LilyElement {
  static get observedAttributes(): string[] {
    return ['size', 'tone', 'label'];
  }

  protected build(): BuildResult {
    const size = this.attr('size', 'md');
    const tone = this.attr('tone', 'default');
    const label = this.attr('label');
    const root = h('span', {
      class: ['lily-icon', size !== 'md' && `lily-icon--${size}`],
      attrs: {
        'data-tone': tone !== 'default' ? tone : null,
        role: label ? 'img' : null,
        'aria-label': label ?? null,
        'aria-hidden': label ? null : 'true',
      },
    });
    return { root };
  }
}
