import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-stack>` — one-dimensional flex layout with a consistent gap.
 *
 * Attributes: `direction` (`vertical` | `horizontal`), `gap` (spacing token), `as`.
 *
 * @example
 * ```html
 * <lily-stack gap="4">…</lily-stack>
 * <lily-stack direction="horizontal" gap="2">…</lily-stack>
 * ```
 */
export class LilyStack extends LilyElement {
  static get observedAttributes(): string[] {
    return ['direction', 'gap', 'as'];
  }

  protected build(): BuildResult {
    const base = this.attr('direction', 'vertical') === 'horizontal' ? 'lily-hstack' : 'lily-vstack';
    const root = h(this.attr('as', 'div') as 'div', {
      class: [base, `lily-gap-${this.attr('gap', '3')}`],
    });
    return { root };
  }
}
