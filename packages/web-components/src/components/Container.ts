import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-container>` — centers page content and constrains its max width.
 *
 * Attributes: `width` (`sm`…`2xl` or `fluid`), `as`.
 *
 * @example
 * ```html
 * <lily-container>…</lily-container>
 * <lily-container width="lg">…</lily-container>
 * ```
 */
export class LilyContainer extends LilyElement {
  static get observedAttributes(): string[] {
    return ['width', 'as'];
  }

  protected build(): BuildResult {
    const width = this.attr('width');
    const root = h(this.attr('as', 'div') as 'div', {
      class: ['lily-container', width && `lily-container--${width}`],
    });
    return { root };
  }
}
