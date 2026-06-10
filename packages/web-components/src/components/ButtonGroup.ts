import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-button-group>` — segments multiple `<lily-button>`s into a single control.
 *
 * Renders `role="group"`; provide a `label` attribute so the group's purpose is
 * announced to assistive technology.
 *
 * Attributes: `orientation` (`horizontal` | `vertical`), `label`.
 *
 * @example
 * ```html
 * <lily-button-group label="Text alignment">
 *   <lily-button>Left</lily-button>
 *   <lily-button>Center</lily-button>
 *   <lily-button>Right</lily-button>
 * </lily-button-group>
 * ```
 */
export class LilyButtonGroup extends LilyElement {
  static get observedAttributes(): string[] {
    return ['orientation', 'label'];
  }

  protected build(): BuildResult {
    const orientation = this.attr('orientation', 'horizontal');
    const label = this.attr('label');

    const root = h('div', {
      class: [
        'lily-btn-group',
        orientation === 'vertical' && 'lily-btn-group--vertical',
      ],
      attrs: {
        role: 'group',
        'aria-label': label ?? null,
      },
    });

    return { root };
  }
}
