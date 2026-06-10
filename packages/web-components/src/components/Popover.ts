import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';
import { listenDismiss } from '../base/interactions';

const CLASS = 'lily-popover';

/**
 * `<lily-popover>` — a click-triggered overlay with optional title and rich
 * content.
 *
 * Uses `role="dialog"` (non-modal) and closes on Escape/outside click. The
 * trigger is the slotted child; the wrapper receives `aria-expanded` +
 * `aria-haspopup` and a click toggle.
 *
 * Attributes: `title`, `content`, `open` (reflected).
 *
 * @example
 * ```html
 * <lily-popover title="Info" content="Details…"><button>More</button></lily-popover>
 * ```
 */
export class LilyPopover extends LilyElement {
  private _id = uid();
  private dismissCleanup: (() => void) | null = null;

  static get observedAttributes(): string[] {
    return ['title', 'content', 'open'];
  }

  private setOpen(next: boolean): void {
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  protected build(): BuildResult {
    const isOpen = this.boolAttr('open');
    const title = this.attr('title');

    const root = h('span', {
      attrs: {
        'aria-expanded': isOpen ? 'true' : 'false',
        'aria-haspopup': 'dialog',
      },
    });
    root.style.position = 'relative';
    root.style.display = 'inline-flex';
    root.addEventListener('click', () => this.setOpen(!this.boolAttr('open')));

    const dialog = h('div', {
      class: [CLASS, 'lily-animate', 'lily-animate--zoom-in', 'lily-animate--snappy'],
      attrs: {
        role: 'dialog',
        id: this._id,
        'aria-label': title ?? null,
        hidden: isOpen ? null : '',
      },
    });
    if (title) {
      dialog.appendChild(h('div', { class: `${CLASS}__header`, text: title }));
    }
    dialog.appendChild(h('div', { class: `${CLASS}__body`, text: this.attr('content') }));

    // Manage the dismiss listener in step with the open state.
    this.dismissCleanup?.();
    this.dismissCleanup = null;
    if (isOpen) {
      this.dismissCleanup = listenDismiss(root, () => this.setOpen(false));
    }

    // The authored trigger is slotted into the wrapper, beside the dialog.
    root.appendChild(dialog);
    return { root, slot: root };
  }

  disconnectedCallback(): void {
    this.dismissCleanup?.();
    this.dismissCleanup = null;
  }
}
