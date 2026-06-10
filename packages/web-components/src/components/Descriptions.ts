import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-descriptions>` — a key/value definition list rendered as `<dl>`.
 * Compose with `<lily-descriptions-item>` children.
 *
 * Attributes: `columns` (1|2|3), `layout` (horizontal|vertical), `bordered`.
 *
 * @example
 * ```html
 * <lily-descriptions columns="2" bordered>
 *   <lily-descriptions-item term="Name">Lily UI</lily-descriptions-item>
 *   <lily-descriptions-item term="Version">1.0.0</lily-descriptions-item>
 * </lily-descriptions>
 * ```
 */
export class LilyDescriptions extends LilyElement {
  static get observedAttributes(): string[] {
    return ['columns', 'layout', 'bordered'];
  }

  protected build(): BuildResult {
    const columns = this.attr('columns', '1');
    const layout = this.attr('layout', 'horizontal');
    const bordered = this.boolAttr('bordered');

    const root = h('dl', {
      class: [
        'lily-descriptions',
        `lily-descriptions--${layout}`,
        `lily-descriptions--cols-${columns}`,
        bordered && 'lily-descriptions--bordered',
      ],
    });
    return { root };
  }
}

/**
 * `<lily-descriptions-item>` — a single key/value pair inside `<lily-descriptions>`.
 *
 * Attributes: `term`.
 *
 * @example
 * ```html
 * <lily-descriptions-item term="Version">1.0.0</lily-descriptions-item>
 * ```
 */
export class LilyDescriptionsItem extends LilyElement {
  static get observedAttributes(): string[] {
    return ['term'];
  }

  protected build(): BuildResult {
    const wrapper = h('div', { class: 'lily-descriptions__item' });
    wrapper.appendChild(
      h('dt', { class: 'lily-descriptions__term', text: this.attr('term', '') }),
    );
    const detail = h('dd', { class: 'lily-descriptions__detail' });
    wrapper.appendChild(detail);
    return { root: wrapper, slot: detail };
  }
}
