import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-scroll-area>` — a scroll container with a slim, themed scrollbar.
 *
 * Attributes: `axis` (`both` | `x` | `y`), `max-height` (px or CSS length).
 */
export class LilyScrollArea extends LilyElement {
  static get observedAttributes(): string[] {
    return ['axis', 'max-height'];
  }

  protected build(): BuildResult {
    const axis = this.attr('axis', 'y');
    const root = h('div', { class: ['lily-scroll-area', axis !== 'both' && `lily-scroll-area--${axis}`] });
    const mh = this.attr('max-height');
    if (mh) root.style.maxHeight = /^\d+$/.test(mh) ? `${mh}px` : mh;
    return { root };
  }
}
