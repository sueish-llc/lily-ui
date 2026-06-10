import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';
import { trapFocus, lockScroll, listenDismiss } from '../base/interactions';
import { exit } from '../base/presence';
import type { AnimationName } from '../utils/animations';

/** How the drawer relates to the rest of the page. */
export type DrawerVariant = 'temporary' | 'persistent' | 'permanent';
/** Edge the drawer is anchored to. */
export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

const CLASS = 'lily-drawer';

/** Slide animation per edge (temporary only) — enter slides in, exit reverses. */
const ENTER_ANIM: Record<DrawerAnchor, AnimationName> = {
  left: 'slide-in-left',
  right: 'slide-in-right',
  top: 'slide-in-down',
  bottom: 'slide-in-up',
};
const EXIT_ANIM: Record<DrawerAnchor, AnimationName> = {
  left: 'slide-out-left',
  right: 'slide-out-right',
  top: 'slide-out-up',
  bottom: 'slide-out-down',
};

/**
 * `<lily-drawer>` — a panel anchored to a screen edge, in one of three variants:
 *
 * - **temporary** (default): overlays the page on a backdrop with a focus trap,
 *   scroll lock, and Escape/backdrop dismissal (the {@link LilyModal} model).
 *   The panel is portaled to `document.body`; authored children move into it.
 * - **persistent**: sits in the normal flow and collapses open/closed.
 * - **permanent**: always visible, in the normal flow.
 *
 * Attributes: `open`, `title`, `variant`, `anchor`. Dispatches `close` (temporary
 * / persistent) on Escape, backdrop click, or the close button.
 *
 * @example
 * ```html
 * <lily-drawer open anchor="left" title="Menu">…</lily-drawer>
 * <lily-drawer variant="permanent" anchor="left">…</lily-drawer>
 * ```
 */
export class LilyDrawer extends LilyElement {
  private titleId = uid();
  /** Authored children, captured once and detached; re-homed per render. */
  private slotted: Node[] | null = null;
  private portal: HTMLDivElement | null = null;
  private panel: HTMLDivElement | null = null;
  /** The in-flow panel for permanent/persistent variants. */
  private inflow: HTMLDivElement | null = null;
  private cleanups: Array<() => void> = [];
  private closing = false;

  static get observedAttributes(): string[] {
    return ['open', 'title', 'variant', 'anchor'];
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
    this.teardownPortal();
    this.clearInflow();
  }

  // The base render pipeline is bypassed: this element manages its own DOM.
  protected build(): BuildResult {
    return { root: h('template') as unknown as HTMLElement, slot: null };
  }

  private get variant(): DrawerVariant {
    return (this.attr('variant', 'temporary') ?? 'temporary') as DrawerVariant;
  }
  private get anchor(): DrawerAnchor {
    return (this.attr('anchor', 'left') ?? 'left') as DrawerAnchor;
  }

  private requestClose(): void {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
  }

  private sync(): void {
    if (this.variant === 'temporary') {
      this.clearInflow();
      if (this.boolAttr('open')) this.openOverlay();
      else this.closeOverlay();
    } else {
      this.teardownPortal();
      this.renderInflow();
    }
  }

  private appendChildrenTo(body: HTMLElement): void {
    if (this.slotted) for (const node of this.slotted) body.appendChild(node);
  }

  private buildHeader(withClose: boolean): HTMLElement | null {
    const title = this.attr('title');
    if (!title && !withClose) return null;
    const header = h('div', { class: `${CLASS}__header` });
    if (title) {
      header.appendChild(h('h2', { class: `${CLASS}__title`, attrs: { id: this.titleId }, text: title }));
    }
    if (withClose) {
      const close = h('button', { class: 'lily-close', attrs: { type: 'button', 'aria-label': 'Close' } });
      close.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, html: '&times;' }));
      close.addEventListener('click', () => this.requestClose());
      header.appendChild(close);
    }
    return header;
  }

  // ── in-flow: permanent / persistent ────────────────────────────────────────
  private renderInflow(): void {
    // Detach any previously homed children before rebuilding.
    if (this.inflow && this.slotted) {
      for (const node of this.slotted) node.parentNode?.removeChild(node);
    }
    this.inflow?.remove();

    const variant = this.variant;
    const title = this.attr('title');
    const panel = h('div', {
      class: [CLASS, `${CLASS}--${variant}`, `${CLASS}--${this.anchor}`],
      attrs: {
        'aria-labelledby': title ? this.titleId : null,
        'data-open': variant === 'persistent' ? String(this.boolAttr('open')) : null,
      },
    });
    const header = this.buildHeader(variant === 'persistent' && !!title);
    if (header) panel.appendChild(header);
    const body = h('div', { class: `${CLASS}__body` });
    this.appendChildrenTo(body);
    panel.appendChild(body);

    this.appendChild(panel);
    this.inflow = panel;
  }

  private clearInflow(): void {
    if (this.inflow && this.slotted) {
      for (const node of this.slotted) node.parentNode?.removeChild(node);
    }
    this.inflow?.remove();
    this.inflow = null;
  }

  // ── temporary overlay (portaled) ───────────────────────────────────────────
  private openOverlay(): void {
    const anchor = this.anchor;

    if (this.closing && this.portal && this.panel) {
      this.closing = false;
      this.portal.className = this.cx('lily-backdrop', 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy');
      this.portal.setAttribute('data-state', 'open');
      this.panel.classList.remove(`lily-animate--${EXIT_ANIM[anchor]}`);
      this.panel.classList.add(`lily-animate--${ENTER_ANIM[anchor]}`);
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
      class: [CLASS, `${CLASS}--temporary`, `${CLASS}--${anchor}`, 'lily-animate', `lily-animate--${ENTER_ANIM[anchor]}`, 'lily-animate--snappy'],
      attrs: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': title ? this.titleId : null,
        'aria-label': !title ? this.attr('aria-label') : null,
        'data-state': 'open',
      },
    });

    const header = this.buildHeader(true);
    if (header) panel.appendChild(header);
    const body = h('div', { class: `${CLASS}__body` });
    this.appendChildrenTo(body);
    panel.appendChild(body);

    backdrop.appendChild(panel);
    document.body.appendChild(backdrop);
    this.portal = backdrop;
    this.panel = panel;

    this.cleanups.push(lockScroll());
    this.cleanups.push(trapFocus(panel));
    this.cleanups.push(listenDismiss(panel, () => this.requestClose(), { outsideClick: true }));
  }

  private closeOverlay(): void {
    if (!this.portal || this.closing) return;
    this.closing = true;
    for (const fn of this.cleanups) fn();
    this.cleanups = [];

    const anchor = this.anchor;
    if (this.portal) {
      this.portal.classList.remove('lily-animate--fade-in');
      this.portal.classList.add('lily-animate--fade-out');
      this.portal.setAttribute('data-state', 'closed');
    }
    if (this.panel) {
      this.panel.classList.remove(`lily-animate--${ENTER_ANIM[anchor]}`);
      this.panel.classList.add(`lily-animate--${EXIT_ANIM[anchor]}`);
    }
    const target = this.panel ?? this.portal;
    if (target) exit(target, () => this.closing && this.teardownPortal());
    else this.teardownPortal();
  }

  private teardownPortal(): void {
    for (const fn of this.cleanups) fn();
    this.cleanups = [];
    this.closing = false;
    this.panel = null;
    if (this.portal) {
      if (this.slotted) for (const node of this.slotted) node.parentNode?.removeChild(node);
      this.portal.remove();
      this.portal = null;
    }
  }
}
