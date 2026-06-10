import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

export interface AccordionItem {
  /** Stable key for the item. */
  id: string;
  /** Header text shown in the trigger. */
  header: string;
  /** Panel content. */
  content: string;
  /** Disable this item. */
  disabled?: boolean;
}

const CLASS = 'lily-accordion';

/**
 * `<lily-accordion>` — vertically stacked, collapsible sections.
 *
 * Follows the WAI-ARIA accordion pattern: each header is a `<button>` with
 * `aria-expanded` + `aria-controls`, and each panel is a region labeled by its
 * header. Items are provided as a JSON `items` attribute (shape
 * `{ id, header, content, disabled? }`). Dispatches a `change` event whose
 * `detail` is the array of open ids.
 *
 * Attributes: `items`, `multiple`.
 *
 * @example
 * ```html
 * <lily-accordion items='[{"id":"a","header":"A","content":"…"}]'></lily-accordion>
 * ```
 */
export class LilyAccordion extends LilyElement {
  private baseId = uid();
  private openIds: string[] = [];

  static get observedAttributes(): string[] {
    return ['items', 'multiple'];
  }

  private parseItems(): AccordionItem[] {
    const raw = this.attr('items');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as AccordionItem[]) : [];
    } catch {
      return [];
    }
  }

  private toggle(id: string): void {
    const multiple = this.boolAttr('multiple');
    const isOpen = this.openIds.includes(id);
    if (multiple) {
      this.openIds = isOpen ? this.openIds.filter((x) => x !== id) : [...this.openIds, id];
    } else {
      this.openIds = isOpen ? [] : [id];
    }
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: this.openIds }));
    this.rerender();
  }

  protected build(): BuildResult {
    const items = this.parseItems();
    const root = h('div', { class: CLASS });

    for (const item of items) {
      const isOpen = this.openIds.includes(item.id);
      const triggerId = `${this.baseId}-${item.id}-trigger`;
      const panelId = `${this.baseId}-${item.id}-panel`;

      const itemEl = h('div', { class: `${CLASS}__item` });
      const header = h('h3', { class: `${CLASS}__header` });
      const trigger = h('button', {
        class: `${CLASS}__trigger`,
        attrs: {
          type: 'button',
          id: triggerId,
          'aria-expanded': isOpen ? 'true' : 'false',
          'aria-controls': panelId,
          disabled: item.disabled ? '' : null,
        },
      });
      trigger.appendChild(h('span', { text: item.header }));
      trigger.appendChild(
        h('span', { class: `${CLASS}__trigger__icon`, attrs: { 'aria-hidden': 'true' }, html: '&#9662;' }),
      );
      trigger.addEventListener('click', () => this.toggle(item.id));
      header.appendChild(trigger);
      itemEl.appendChild(header);

      const panel = h('div', {
        class: `${CLASS}__panel`,
        attrs: {
          id: panelId,
          role: 'region',
          'aria-labelledby': triggerId,
          hidden: isOpen ? null : '',
        },
        text: item.content,
      });
      itemEl.appendChild(panel);

      root.appendChild(itemEl);
    }

    // Data-driven: no authored children are slotted.
    return { root, slot: null };
  }
}
