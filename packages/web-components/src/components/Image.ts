import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-image>` — a media wrapper with lazy-loading, fade-in, an optional fixed
 * aspect ratio, and a graceful fallback when the source fails.
 *
 * Attributes: `src`, `alt`, `fallback`, `ratio` (e.g. `16/9`), `rounded`,
 * `loading`.
 */
export class LilyImage extends LilyElement {
  static get observedAttributes(): string[] {
    return ['src', 'alt', 'fallback', 'ratio', 'rounded', 'loading'];
  }

  protected build(): BuildResult {
    const alt = this.attr('alt', '')!;
    const ratio = this.attr('ratio');
    const root = h('div', {
      class: ['lily-image', this.boolAttr('rounded') && 'lily-image--rounded', 'lily-image--loading'],
    });
    if (ratio) {
      const [w, hgt] = ratio.split('/').map(Number);
      if (w && hgt) root.style.aspectRatio = String(w / hgt);
    }

    const img = h('img', {
      class: 'lily-image__img',
      attrs: { src: this.attr('src') ?? null, alt, loading: this.attr('loading', 'lazy')! },
    }) as HTMLImageElement;
    img.addEventListener('load', () => root.classList.remove('lily-image--loading'));
    img.addEventListener('error', () => {
      root.classList.remove('lily-image--loading');
      root.replaceChildren(h('div', { class: 'lily-image__fallback', text: this.attr('fallback') ?? alt }));
    });
    root.appendChild(img);
    return { root, slot: null };
  }
}
