import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';
import { trapFocus, lockScroll, listenDismiss } from '../base/interactions';
import { exit } from '../base/presence';

/** Size of the modal dialog. */
export type ModalSize = 'sm' | 'md' | 'lg';

const CLASS = 'lily-modal';

/**
 * `<lily-modal>` — an accessible dialog rendered in a portal over a backdrop.
 *
 * Implements the WAI-ARIA dialog pattern: `role="dialog"` + `aria-modal`,
 * focus trapped within, focus restored on close, background scroll locked, and
 * Escape/backdrop dismissal. Toggle visibility with the `open` attribute; the
 * element dispatches a `close` event on Escape, backdrop click, or close button.
 *
 * Because the dialog is portaled to `document.body`, the host's authored
 * children are moved into the dialog body while open and restored on close. Use
 * the `title` attribute for the accessible name; the `#footer` is not available
 * (place footer actions inside the authored content).
 *
 * Attributes: `open`, `title`, `size`, `close-on-backdrop`.
 *
 * @example
 * ```html
 * <lily-modal open title="Confirm">Are you sure?</lily-modal>
 * ```
 */
export class LilyModal extends LilyElement {
  private titleId = uid();
  /**
   * The host's authored children, captured once and detached. They live only in
   * the portal while open and are kept here (out of the document) while closed,
   * so the host renders nothing in the light DOM when closed.
   */
  private slotted: Node[] | null = null;
  private portal: HTMLDivElement | null = null;
  private dialog: HTMLDivElement | null = null;
  private cleanups: Array<() => void> = [];
  /** True while the exit animation is playing (portal still mounted). */
  private closing = false;

  static get observedAttributes(): string[] {
    return ['open', 'title', 'size', 'close-on-backdrop'];
  }

  connectedCallback(): void {
    if (this.slotted === null) {
      this.slotted = Array.from(this.childNodes);
      // Detach authored children; the host stays empty until opened.
      for (const node of this.slotted) node.parentNode?.removeChild(node);
    }
    // The host owns no box; the portal carries the dialog.
    this.style.display = 'contents';
    this.sync();
  }

  attributeChangedCallback(): void {
    if (this.slotted !== null) this.sync();
  }

  disconnectedCallback(): void {
    this.teardown();
  }

  // The base render pipeline is bypassed: this element manages a portal instead
  // of rendering into its own light DOM.
  protected build(): BuildResult {
    return { root: h('template') as unknown as HTMLElement, slot: null };
  }

  private requestClose(): void {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
  }

  private sync(): void {
    if (this.boolAttr('open')) this.open();
    else this.closeAnimated();
  }

  private open(): void {
    // Re-opening mid-exit: just reverse to the entering state.
    if (this.closing && this.portal && this.dialog) {
      this.closing = false;
      this.portal.className = this.cx('lily-backdrop', 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy');
      this.portal.setAttribute('data-state', 'open');
      this.dialog.classList.remove('lily-animate--zoom-out');
      this.dialog.classList.add('lily-animate--zoom-in');
      this.dialog.setAttribute('data-state', 'open');
      return;
    }
    if (this.portal) return;

    const size = this.attr('size', 'md');
    const title = this.attr('title');
    const closeOnBackdrop = this.attr('close-on-backdrop', 'true') !== 'false';

    const backdrop = h('div', {
      class: ['lily-backdrop', 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy'],
      attrs: { 'data-state': 'open' },
    });
    const dialog = h('div', {
      class: [CLASS, size !== 'md' && `${CLASS}--${size}`, 'lily-animate', 'lily-animate--zoom-in', 'lily-animate--snappy'],
      attrs: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': title ? this.titleId : null,
        'data-state': 'open',
      },
    });

    if (title) {
      const header = h('div', { class: `${CLASS}__header` });
      header.appendChild(h('h2', { class: `${CLASS}__title`, attrs: { id: this.titleId }, text: title }));
      const close = h('button', {
        class: 'lily-close',
        attrs: { type: 'button', 'aria-label': 'Close' },
      });
      close.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, html: '&times;' }));
      close.addEventListener('click', () => this.requestClose());
      header.appendChild(close);
      dialog.appendChild(header);
    }

    const body = h('div', { class: `${CLASS}__body` });
    // Move the authored children into the dialog body.
    if (this.slotted) {
      for (const node of this.slotted) body.appendChild(node);
    }
    dialog.appendChild(body);

    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);
    this.portal = backdrop;
    this.dialog = dialog;

    this.cleanups.push(lockScroll());
    this.cleanups.push(trapFocus(dialog));
    // Escape always closes; the backdrop (outside) click closes only when allowed.
    this.cleanups.push(
      listenDismiss(dialog, () => this.requestClose(), { outsideClick: closeOnBackdrop }),
    );
  }

  /**
   * Close with the exit animation: detach interactions immediately, play the
   * exit, then remove the portal once it finishes (or at once if motion is off).
   */
  private closeAnimated(): void {
    if (!this.portal || this.closing) return;
    this.closing = true;

    // Release trap/lock/dismiss now; the dialog is non-interactive while leaving.
    for (const fn of this.cleanups) fn();
    this.cleanups = [];

    if (this.portal) {
      this.portal.classList.remove('lily-animate--fade-in');
      this.portal.classList.add('lily-animate--fade-out');
      this.portal.setAttribute('data-state', 'closed');
    }
    if (this.dialog) {
      this.dialog.classList.remove('lily-animate--zoom-in');
      this.dialog.classList.add('lily-animate--zoom-out');
      // Mirror the React Modal: the dialog itself reflects the open/closed
      // state, not just the backdrop.
      this.dialog.setAttribute('data-state', 'closed');
    }

    const target = this.dialog ?? this.portal;
    if (target) {
      exit(target, () => {
        // A re-open may have cancelled the close mid-flight.
        if (this.closing) this.teardown();
      });
    } else {
      this.teardown();
    }
  }

  private teardown(): void {
    for (const fn of this.cleanups) fn();
    this.cleanups = [];
    this.closing = false;
    this.dialog = null;
    if (this.portal) {
      // Detach the authored children back out of the document (kept in memory).
      if (this.slotted) {
        for (const node of this.slotted) node.parentNode?.removeChild(node);
      }
      this.portal.remove();
      this.portal = null;
    }
  }
}
