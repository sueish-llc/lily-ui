import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-close-button>` — a standard dismiss control (×).
 *
 * Renders a native `<button>` with an accessible label and a decorative glyph.
 * Listen for `click` on the host.
 *
 * Attributes: `label`, `type`.
 */
export class LilyCloseButton extends LilyElement {
  static get observedAttributes(): string[] {
    return ['label', 'type'];
  }

  protected build(): BuildResult {
    const root = h('button', {
      class: 'lily-close',
      attrs: {
        type: this.attr('type', 'button')!,
        'aria-label': this.attr('label', 'Close')!,
      },
    });
    root.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, html: '&times;' }));
    return { root };
  }
}
