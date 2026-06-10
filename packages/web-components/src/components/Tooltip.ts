import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

const CLASS = 'lily-tooltip';

/**
 * `<lily-tooltip>` — a small label shown on hover/focus, associated via
 * `aria-describedby` (WAI-ARIA tooltip pattern).
 *
 * The trigger is the slotted child (it should be a focusable element for
 * keyboard accessibility); the tooltip text comes from the `content` attribute.
 *
 * Attributes: `content`.
 *
 * @example
 * ```html
 * <lily-tooltip content="Delete"><button aria-label="Delete">🗑</button></lily-tooltip>
 * ```
 */
export class LilyTooltip extends LilyElement {
  private _id = uid();
  private open = false;

  static get observedAttributes(): string[] {
    return ['content'];
  }

  private setOpen(next: boolean): void {
    if (this.open === next) return;
    this.open = next;
    this.rerender();
  }

  protected build(): BuildResult {
    const root = h('span', {});
    root.style.position = 'relative';
    root.style.display = 'inline-flex';

    if (this.open) root.setAttribute('aria-describedby', this._id);
    root.addEventListener('mouseenter', () => this.setOpen(true));
    root.addEventListener('mouseleave', () => this.setOpen(false));
    root.addEventListener('focusin', () => this.setOpen(true));
    root.addEventListener('focusout', () => this.setOpen(false));

    const tip = h('span', {
      class: [CLASS, 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy'],
      attrs: {
        role: 'tooltip',
        id: this._id,
        hidden: this.open ? null : '',
      },
      text: this.attr('content'),
    });

    // The authored trigger is slotted into the wrapper, before the tooltip.
    root.appendChild(tip);
    return { root, slot: root };
  }
}
