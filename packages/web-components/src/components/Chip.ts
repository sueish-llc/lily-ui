import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type ChipStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral';

/**
 * `<lily-chip>` — a compact token. Can be a selectable toggle (`clickable`) or
 * removable (`removable`); these modes are mutually exclusive (removable wins).
 * A removable chip dispatches a bubbling `remove` event from its host.
 *
 * Attributes: `status`, `small`, `selected`, `clickable`, `removable`, `remove-label`.
 *
 * @example
 * ```html
 * <lily-chip status="info">React</lily-chip>
 * <lily-chip removable>ada@example.com</lily-chip>
 * ```
 */
export class LilyChip extends LilyElement {
  static get observedAttributes(): string[] {
    return ['status', 'small', 'selected', 'clickable', 'removable', 'remove-label'];
  }

  protected build(): BuildResult {
    const status = this.attr('status', 'neutral');
    const selected = this.boolAttr('selected');
    const removable = this.boolAttr('removable');
    const asButton = this.boolAttr('clickable') && !removable;
    const dataStatus = status !== 'neutral' && !selected ? status : null;
    const classes = [
      'lily-chip',
      this.boolAttr('small') && 'lily-chip--sm',
      selected && 'lily-chip--selected',
      asButton && 'lily-chip--clickable',
    ];

    if (asButton) {
      const root = h('button', {
        class: classes,
        attrs: { type: 'button', 'data-status': dataStatus, 'aria-pressed': String(selected) },
      });
      return { root };
    }

    const root = h('span', { class: classes, attrs: { 'data-status': dataStatus } });
    const inner = h('span');
    root.appendChild(inner);
    if (removable) {
      const remove = h('button', {
        class: 'lily-chip__remove',
        attrs: { type: 'button', 'aria-label': this.attr('remove-label', 'Remove')! },
      });
      remove.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, text: '×' }));
      remove.addEventListener('click', (e) => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent('remove', { bubbles: true }));
      });
      root.appendChild(remove);
    }
    return { root, slot: inner };
  }
}
