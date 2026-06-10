import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-footer>` — the page's `contentinfo` landmark, the counterpart to
 * `<lily-navbar>`. A `<footer>` region with a centered inner row; authored
 * children are placed into the inner container.
 *
 * Attributes: `bordered` (set `bordered="false"` to drop the top border).
 *
 * @example
 * ```html
 * <lily-footer>
 *   <p>© 2026 Lily</p>
 *   <a href="/terms">Terms</a>
 * </lily-footer>
 * ```
 */
export class LilyFooter extends LilyElement {
  static get observedAttributes(): string[] {
    return ['bordered'];
  }

  protected build(): BuildResult {
    const bordered = this.attr('bordered') !== 'false';
    const root = h('footer', { class: ['lily-footer', bordered && 'lily-footer--bordered'] });
    const inner = h('div', { class: 'lily-footer__inner' });
    root.appendChild(inner);
    return { root, slot: inner };
  }
}
