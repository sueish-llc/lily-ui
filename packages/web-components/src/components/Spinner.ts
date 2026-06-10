import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type SpinnerVariant = 'border' | 'grow';
export type SpinnerSize = 'sm' | 'md' | 'lg';

/**
 * `<lily-spinner>` — a loading indicator. Inherits color from `currentColor`.
 *
 * Exposes `role="status"` with a visually-hidden label so screen readers
 * announce the loading state.
 *
 * Attributes: `variant`, `size`, `label`.
 */
export class LilySpinner extends LilyElement {
  static get observedAttributes(): string[] {
    return ['variant', 'size', 'label'];
  }

  protected build(): BuildResult {
    const root = h('span', {
      class: [
        'lily-spinner',
        `lily-spinner--${this.attr('variant', 'border')}`,
        `lily-spinner--${this.attr('size', 'md')}`,
      ],
      attrs: { role: 'status' },
    });
    root.appendChild(h('span', { class: 'lily-visually-hidden', text: this.attr('label', 'Loading') }));
    return { root, slot: null };
  }
}
