import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-back-top>` — a floating button that appears after scrolling past
 * `visibility-height` and smoothly returns to the top. Respects reduced motion.
 *
 * Attributes: `visibility-height` (default 400), `label`.
 */
export class LilyBackTop extends LilyElement {
  private btn: HTMLButtonElement | null = null;
  private onScroll = () => {
    if (this.btn) this.btn.hidden = window.scrollY <= this.numAttr('visibility-height', 400);
  };

  static get observedAttributes(): string[] {
    return ['visibility-height', 'label'];
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  disconnectedCallback(): void {
    window.removeEventListener('scroll', this.onScroll);
  }

  protected build(): BuildResult {
    const btn = h('button', {
      class: 'lily-back-top',
      attrs: { type: 'button', 'aria-label': this.attr('label', 'Back to top')! },
    }) as HTMLButtonElement;
    btn.hidden = window.scrollY <= this.numAttr('visibility-height', 400);
    btn.addEventListener('click', () => {
      // Guard `matchMedia` (absent in SSR/minimal test runtimes, same as the
      // checks in utils/motion.ts). Without the signal we cannot rule out a
      // reduced-motion preference, so fall back to an instant jump.
      const reduce =
        typeof window.matchMedia !== 'function' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    const hasChildren = this.children.length > 0 || (this.textContent ?? '').trim() !== '';
    if (!hasChildren) btn.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, text: '↑' }));
    this.btn = btn;
    return { root: btn, slot: hasChildren ? btn : h('span') };
  }
}
