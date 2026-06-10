import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type DividerOrientation = 'horizontal' | 'vertical';

/**
 * `<lily-divider>` — a separator rule. Horizontal by default; can be vertical
 * (inside a flex row) or carry a centered label (its text content).
 *
 * Attributes: `orientation`, `strong`, `align`.
 *
 * @example
 * ```html
 * <lily-divider></lily-divider>
 * <lily-divider>または</lily-divider>
 * <lily-divider orientation="vertical"></lily-divider>
 * ```
 */
export class LilyDivider extends LilyElement {
  static get observedAttributes(): string[] {
    return ['orientation', 'strong', 'align'];
  }

  protected build(): BuildResult {
    const orientation = this.attr('orientation', 'horizontal');
    const align = this.attr('align', 'center');
    // The host still holds its authored children during build(), so we can
    // detect a label from its text content.
    const labeled = orientation !== 'vertical' && (this.textContent ?? '').trim() !== '';

    const root = h('div', {
      class: [
        'lily-divider',
        orientation === 'vertical' && 'lily-divider--vertical',
        this.boolAttr('strong') && 'lily-divider--strong',
        labeled && 'lily-divider--labeled',
        labeled && align !== 'center' && `lily-divider--${align}`,
      ],
      attrs: { role: 'separator', 'aria-orientation': orientation === 'vertical' ? 'vertical' : null },
    });

    if (labeled) {
      const inner = h('span');
      root.appendChild(inner);
      return { root, slot: inner };
    }
    return { root, slot: h('span') };
  }
}
