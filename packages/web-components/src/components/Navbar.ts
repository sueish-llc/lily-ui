import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-navbar>` — responsive top navigation. Collapses to a toggle on small
 * screens. The default children become the collapsible nav content.
 *
 * Attributes: `brand`, `brand-href`, `label`, `toggle-label`.
 *
 * @example
 * ```html
 * <lily-navbar brand="Lily" brand-href="/">
 *   <a href="/docs">Docs</a>
 *   <a href="/about">About</a>
 * </lily-navbar>
 * ```
 */
export class LilyNavbar extends LilyElement {
  static get observedAttributes(): string[] {
    return ['brand', 'brand-href', 'label', 'toggle-label'];
  }

  /** Internal open/closed state for the collapsible region. */
  private _open = false;

  /** Stable id linking the toggle button to the collapsible region. */
  private readonly _collapseId: string = uid('lily-navbar');

  protected build(): BuildResult {
    const CLASS = 'lily-navbar';
    const brand = this.attr('brand');
    const brandHref = this.attr('brand-href', '#')!;
    const label = this.attr('label', 'Main')!;
    const toggleLabel = this.attr('toggle-label', 'Toggle navigation')!;

    const nav = h('nav', {
      class: CLASS,
      attrs: { 'aria-label': label },
    });

    // Brand link (only rendered when the `brand` attribute is present).
    if (brand) {
      nav.appendChild(
        h('a', { class: `${CLASS}__brand`, attrs: { href: brandHref }, text: brand }),
      );
    }

    // Toggle button.
    const toggle = h('button', {
      class: `${CLASS}__toggle`,
      attrs: {
        type: 'button',
        'aria-expanded': String(this._open),
        'aria-controls': this._collapseId,
        'aria-label': toggleLabel,
      },
    });
    toggle.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, html: '&#9776;' }));
    toggle.addEventListener('click', () => {
      this._open = !this._open;
      this.rerender();
    });
    nav.appendChild(toggle);

    // Collapsible region — default children go here.
    const collapse = h('div', {
      class: [
        `${CLASS}__collapse`,
        this._open && `${CLASS}__collapse--open`,
      ],
      attrs: { id: this._collapseId },
    });
    nav.appendChild(collapse);

    return { root: nav, slot: collapse };
  }
}
