import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';
import { trapFocus, lockScroll, listenDismiss } from '../base/interactions';
import { exit } from '../base/presence';
import type { AnimationName } from '../utils/animations';

/** Edge the panel slides in from. */
export type OffcanvasPlacement = 'start' | 'end' | 'top' | 'bottom';

const CLASS = 'lily-offcanvas';

/** Slide animation per edge — enter slides in from the edge, exit reverses. */
const ENTER_ANIM: Record<OffcanvasPlacement, AnimationName> = {
  start: 'slide-in-left',
  end: 'slide-in-right',
  top: 'slide-in-down',
  bottom: 'slide-in-up',
};
const EXIT_ANIM: Record<OffcanvasPlacement, AnimationName> = {
  start: 'slide-out-left',
  end: 'slide-out-right',
  top: 'slide-out-up',
  bottom: 'slide-out-down',
};

/**
 * `<lily-offcanvas>` — a panel that slides in from a screen edge, over a
 * backdrop.
 *
 * Same accessibility model as {@link LilyModal}: dialog semantics, focus trap,
 * scroll lock, Escape/backdrop dismissal. Toggle visibility with the `open`
 * attribute; the element dispatches a `close` event on Escape, backdrop click,
 * or close button.
 *
 * Because the panel is portaled to `document.body`, the host's authored
 * children are moved into the panel body while open and restored on close.
 *
 * Attributes: `open`, `title`, `placement`.
 *
 * @example
 * ```html
 * <lily-offcanvas open placement="end" title="Menu">…</lily-offcanvas>
 * ```
 */
export class LilyOffcanvas extends LilyElement {
  private titleId = uid();
  /**
   * The host's authored children, captured once and detached. They live only in
   * the portal while open and are kept here (out of the document) while closed,
   * so the host renders nothing in the light DOM when closed.
   */
  private slotted: Node[] | null = null;
  private portal: HTMLDivElement | null = null;
  private panel: HTMLDivElement | null = null;
  private cleanups: Array<() => void> = [];
  /** True while the slide-out is playing (portal still mounted). */
  private closing = false;

  static get observedAttributes(): string[] {
    return ['open', 'title', 'placement'];
  }

  connectedCallback(): void {
    if (this.slotted === null) {
      this.slotted = Array.from(this.childNodes);
      // Detach authored children; the host stays empty until opened.
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
    const placement = (this.attr('placement', 'start') ?? 'start') as OffcanvasPlacement;

    // Re-opening mid-exit: reverse to the entering state.
    if (this.closing && this.portal && this.panel) {
      this.closing = false;
      this.portal.className = this.cx('lily-backdrop', 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy');
      this.portal.setAttribute('data-state', 'open');
      this.panel.classList.remove(`lily-animate--${EXIT_ANIM[placement]}`);
      this.panel.classList.add(`lily-animate--${ENTER_ANIM[placement]}`);
      this.panel.setAttribute('data-state', 'open');
      return;
    }
    if (this.portal) return;

    const title = this.attr('title');

    const backdrop = h('div', {
      class: ['lily-backdrop', 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy'],
      attrs: { 'data-state': 'open' },
    });
    const panel = h('div', {
      class: [CLASS, `${CLASS}--${placement}`, 'lily-animate', `lily-animate--${ENTER_ANIM[placement]}`, 'lily-animate--snappy'],
      attrs: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': title ? this.titleId : null,
        'data-state': 'open',
      },
    });

    const header = h('div', { class: `${CLASS}__header` });
    if (title) {
      header.appendChild(h('h2', { class: `${CLASS}__title`, attrs: { id: this.titleId }, text: title }));
    }
    const close = h('button', {
      class: 'lily-close',
      attrs: { type: 'button', 'aria-label': 'Close' },
    });
    close.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, html: '&times;' }));
    close.addEventListener('click', () => this.requestClose());
    header.appendChild(close);
    panel.appendChild(header);

    const body = h('div', { class: `${CLASS}__body` });
    // Move the authored children into the panel body.
    if (this.slotted) {
      for (const node of this.slotted) body.appendChild(node);
    }
    panel.appendChild(body);

    backdrop.appendChild(panel);
    document.body.appendChild(backdrop);
    this.portal = backdrop;
    this.panel = panel;

    this.cleanups.push(lockScroll());
    this.cleanups.push(trapFocus(panel));
    // Escape + backdrop (outside) click both dismiss.
    this.cleanups.push(
      listenDismiss(panel, () => this.requestClose(), { outsideClick: true }),
    );
  }

  /**
   * Close with the slide-out: detach interactions immediately, play the exit,
   * then remove the portal once it finishes (or at once if motion is off).
   */
  private closeAnimated(): void {
    if (!this.portal || this.closing) return;
    this.closing = true;

    for (const fn of this.cleanups) fn();
    this.cleanups = [];

    const placement = (this.attr('placement', 'start') ?? 'start') as OffcanvasPlacement;
    if (this.portal) {
      this.portal.classList.remove('lily-animate--fade-in');
      this.portal.classList.add('lily-animate--fade-out');
      this.portal.setAttribute('data-state', 'closed');
    }
    if (this.panel) {
      this.panel.classList.remove(`lily-animate--${ENTER_ANIM[placement]}`);
      this.panel.classList.add(`lily-animate--${EXIT_ANIM[placement]}`);
    }

    const target = this.panel ?? this.portal;
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
    this.panel = null;
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
