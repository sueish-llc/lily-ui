import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';
import { listenDismiss } from '../base/interactions';

const CLASS = 'lily-hover-card';

/**
 * `<lily-hover-card>` — a floating card that reveals supplementary rich content
 * when the trigger is hovered or focused.
 *
 * Unlike `<lily-popover>` it is not a dialog: it opens on hover/focus with an
 * open/close delay and is purely informational. It opens by keyboard focus too,
 * and closes on blur or Escape. The trigger is the slotted child (it should be
 * focusable); the card text comes from the `content` attribute.
 *
 * Attributes: `content`, `placement` (top | bottom | left | right), `open-delay`,
 * `close-delay`, `open` (reflected).
 *
 * @example
 * ```html
 * <lily-hover-card content="Details…"><a href="#">@lily</a></lily-hover-card>
 * ```
 */
export class LilyHoverCard extends LilyElement {
  private _id = uid();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private dismissCleanup: (() => void) | null = null;

  static get observedAttributes(): string[] {
    return ['content', 'placement', 'open-delay', 'close-delay', 'open'];
  }

  private clear(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private setOpen(next: boolean): void {
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  private schedule(next: boolean, delay: number): void {
    this.clear();
    this.timer = setTimeout(() => this.setOpen(next), delay);
  }

  protected build(): BuildResult {
    const isOpen = this.boolAttr('open');
    const placement = this.attr('placement', 'bottom');
    const openDelay = this.numAttr('open-delay', 200);
    const closeDelay = this.numAttr('close-delay', 150);

    const root = h('span', {});
    root.style.position = 'relative';
    root.style.display = 'inline-flex';

    root.addEventListener('mouseenter', () => this.schedule(true, openDelay));
    root.addEventListener('mouseleave', () => this.schedule(false, closeDelay));
    root.addEventListener('focusin', () => {
      this.clear();
      this.setOpen(true);
    });
    root.addEventListener('focusout', () => {
      this.clear();
      this.setOpen(false);
    });

    const card = h('div', {
      class: [CLASS, `${CLASS}--${placement}`, 'lily-animate', 'lily-animate--zoom-in', 'lily-animate--snappy'],
      attrs: {
        role: 'tooltip',
        id: this._id,
        hidden: isOpen ? null : '',
      },
    });
    card.appendChild(h('div', { class: `${CLASS}__body`, text: this.attr('content') }));

    if (isOpen) root.setAttribute('aria-describedby', this._id);

    // Manage the dismiss listener (Escape / outside click) in step with open.
    this.dismissCleanup?.();
    this.dismissCleanup = null;
    if (isOpen) {
      this.dismissCleanup = listenDismiss(root, () => this.setOpen(false));
    }

    // The authored trigger is slotted into the wrapper, before the card.
    root.appendChild(card);
    return { root, slot: root };
  }

  disconnectedCallback(): void {
    this.clear();
    this.dismissCleanup?.();
    this.dismissCleanup = null;
  }
}
