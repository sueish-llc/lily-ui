import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-row>` — flex container for `<lily-col>`s in the 12-column grid.
 *
 * Attributes: `gutter`, `gutter-x`, `gutter-y`, `as`.
 *
 * @example
 * ```html
 * <lily-row gutter="4">
 *   <lily-col span="6">left</lily-col>
 *   <lily-col span="6">right</lily-col>
 * </lily-row>
 * ```
 */
export class LilyRow extends LilyElement {
  static get observedAttributes(): string[] {
    return ['gutter', 'gutter-x', 'gutter-y', 'as'];
  }

  protected build(): BuildResult {
    const gutter = this.attr('gutter');
    const gutterX = this.attr('gutter-x');
    const gutterY = this.attr('gutter-y');

    const root = h(this.attr('as', 'div') as 'div', {
      class: [
        'lily-row',
        gutter && `lily-g-${gutter}`,
        gutterX && `lily-gx-${gutterX}`,
        gutterY && `lily-gy-${gutterY}`,
      ],
    });
    return { root };
  }
}
