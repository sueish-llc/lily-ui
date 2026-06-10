import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-affix>` — stick its content to the top (or bottom) of the viewport
 * once scrolled into position, using CSS `position: sticky`.
 *
 * Attributes: `offset` (px), `position` (`top` | `bottom`).
 */
export class LilyAffix extends LilyElement {
  static get observedAttributes(): string[] {
    return ['offset', 'position'];
  }

  protected build(): BuildResult {
    const root = h('div', {
      class: ['lily-affix', this.attr('position') === 'bottom' && 'lily-affix--bottom'],
    });
    root.style.setProperty('--lily-affix-offset', `${this.numAttr('offset', 0)}px`);
    return { root };
  }
}
