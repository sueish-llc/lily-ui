import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-empty-state>` — a centered placeholder for empty lists / no results.
 * The host's light-DOM children become the actions area.
 *
 * Attributes: `title`, `description`, `icon` (text/emoji).
 *
 * @example
 * ```html
 * <lily-empty-state title="まだ何もありません" description="追加しましょう。" icon="🗂️">
 *   <lily-button>追加</lily-button>
 * </lily-empty-state>
 * ```
 */
export class LilyEmptyState extends LilyElement {
  static get observedAttributes(): string[] {
    return ['title', 'description', 'icon'];
  }

  protected build(): BuildResult {
    const root = h('div', { class: 'lily-empty-state' });
    const icon = this.attr('icon');
    if (icon) root.appendChild(h('span', { class: 'lily-empty-state__icon', attrs: { 'aria-hidden': 'true' }, text: icon }));
    root.appendChild(h('p', { class: 'lily-empty-state__title', text: this.attr('title', '')! }));
    const description = this.attr('description');
    if (description) root.appendChild(h('p', { class: 'lily-empty-state__description', text: description }));

    // Authored children (if any) become the actions row.
    if (this.children.length > 0) {
      const actions = h('div', { class: 'lily-empty-state__actions' });
      root.appendChild(actions);
      return { root, slot: actions };
    }
    return { root, slot: h('span') };
  }
}
