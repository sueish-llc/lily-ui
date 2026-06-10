import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';
import { trapFocus, lockScroll, listenDismiss } from '../base/interactions';
import { exit } from '../base/presence';

/** Semantic intent of the alert dialog. */
export type AlertDialogStatus = 'primary' | 'danger' | 'warning' | 'success' | 'info' | 'neutral';

const CLASS = 'lily-alert-dialog';

/**
 * `<lily-alert-dialog>` — a confirmation dialog for consequential actions.
 *
 * Implements `role="alertdialog"` + `aria-modal`, labelled by its `title`
 * attribute and described by its body content. Focus is trapped within and
 * restored on close; Escape closes the dialog. Unlike Modal, clicking the
 * backdrop does NOT dismiss it — an explicit action is required. Toggle
 * visibility with the `open` attribute; the element dispatches a `close` event
 * on Escape or when `requestClose()` is called.
 *
 * Attributes: `open`, `title`, `status`.
 *
 * @example
 * ```html
 * <lily-alert-dialog open title="Delete item?" status="danger">
 *   This action cannot be undone.
 * </lily-alert-dialog>
 * ```
 */
export class LilyAlertDialog extends LilyElement {
  private titleId = uid();
  private descId = uid();
  private slotted: Node[] | null = null;
  private portal: HTMLDivElement | null = null;
  private dialog: HTMLDivElement | null = null;
  private cleanups: Array<() => void> = [];
  private closing = false;

  static get observedAttributes(): string[] {
    return ['open', 'title', 'status'];
  }

  connectedCallback(): void {
    if (this.slotted === null) {
      this.slotted = Array.from(this.childNodes);
      for (const node of this.slotted) node.parentNode?.removeChild(node);
    }
    this.style.display = 'contents';
    this.sync();
  }

  attributeChangedCallback(): void {
    if (this.slotted !== null) this.sync();
  }

  disconnectedCallback(): void {
    this.teardown();
  }

  // Bypass the standard light-DOM render — this element manages a portal.
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
    if (this.closing && this.portal && this.dialog) {
      this.closing = false;
      this.portal.className = this.cx(
        'lily-backdrop',
        'lily-animate',
        'lily-animate--fade-in',
        'lily-animate--snappy',
      );
      this.portal.setAttribute('data-state', 'open');
      this.dialog.classList.remove('lily-animate--zoom-out');
      this.dialog.classList.add('lily-animate--zoom-in');
      this.dialog.setAttribute('data-state', 'open');
      return;
    }
    if (this.portal) return;

    const title = this.attr('title', '');
    const status = this.attr('status', 'primary') as AlertDialogStatus;

    const backdrop = h('div', {
      class: [
        'lily-backdrop',
        'lily-animate',
        'lily-animate--fade-in',
        'lily-animate--snappy',
      ],
      attrs: { 'data-state': 'open' },
    });

    const dialog = h('div', {
      class: [
        CLASS,
        status !== 'neutral' && `${CLASS}--${status}`,
        'lily-animate',
        'lily-animate--zoom-in',
        'lily-animate--snappy',
      ],
      attrs: {
        role: 'alertdialog',
        'aria-modal': 'true',
        'aria-labelledby': this.titleId,
        'aria-describedby': this.descId,
        'data-state': 'open',
      },
    });

    // Header
    const header = h('div', { class: `${CLASS}__header` });
    header.appendChild(
      h('h2', {
        class: `${CLASS}__title`,
        attrs: { id: this.titleId },
        text: title ?? '',
      }),
    );
    dialog.appendChild(header);

    // Body — authored children go here
    const body = h('div', {
      class: `${CLASS}__body`,
      attrs: { id: this.descId },
    });
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
    // Escape closes; backdrop clicks do NOT (outsideClick: false).
    this.cleanups.push(
      listenDismiss(dialog, () => this.requestClose(), { outsideClick: false }),
    );
  }

  private closeAnimated(): void {
    if (!this.portal || this.closing) return;
    this.closing = true;

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
    }

    const target = this.dialog ?? this.portal;
    if (target) {
      exit(target, () => {
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
      if (this.slotted) {
        for (const node of this.slotted) node.parentNode?.removeChild(node);
      }
      this.portal.remove();
      this.portal = null;
    }
  }
}
