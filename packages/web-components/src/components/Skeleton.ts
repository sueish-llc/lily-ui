import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

const dim = (v: string | null): string | null => {
  if (v == null) return null;
  return /^\d+$/.test(v) ? `${v}px` : v;
};

/**
 * `<lily-skeleton>` — a shimmering loading placeholder (decorative,
 * `aria-hidden`). The shimmer is disabled under reduced motion.
 *
 * Attributes: `variant`, `width`, `height`, `lines`, `animated` (default on;
 * set `animated="false"` to disable).
 */
export class LilySkeleton extends LilyElement {
  static get observedAttributes(): string[] {
    return ['variant', 'width', 'height', 'lines', 'animated'];
  }

  protected build(): BuildResult {
    const variant = (this.attr('variant', 'text') as SkeletonVariant) ?? 'text';
    const animated = this.attr('animated') !== 'false';
    const lines = this.numAttr('lines', 1);
    const width = dim(this.getAttribute('width'));
    const height = dim(this.getAttribute('height'));

    if (variant === 'text' && lines > 1) {
      const root = h('div', { attrs: { 'aria-hidden': 'true' } });
      for (let i = 0; i < lines; i++) {
        const span = h('span', { class: ['lily-skeleton', 'lily-skeleton--text', animated && 'lily-skeleton--animated'] });
        span.style.width = i === lines - 1 ? '70%' : (width ?? '100%');
        root.appendChild(span);
      }
      return { root, slot: null };
    }

    const root = h('span', {
      class: ['lily-skeleton', `lily-skeleton--${variant}`, animated && 'lily-skeleton--animated'],
      attrs: { 'aria-hidden': 'true' },
    });
    if (width) root.style.width = width;
    if (height) root.style.height = height;
    return { root, slot: null };
  }
}
