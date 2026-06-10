import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export interface TransferItem {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * `<lily-transfer>` — move items between a source and a target list. Items are a
 * JSON `items` attribute; the target seeds from a comma-joined `value`.
 * Dispatches a `change` event whose `detail` is the target value array.
 *
 * Attributes: `items`, `value`, `source-title`, `target-title`,
 * `to-target-label`, `to-source-label`.
 */
export class LilyTransfer extends LilyElement {
  private target: string[] = [];
  private checked = new Set<string>();
  private initialized = false;

  static get observedAttributes(): string[] {
    return ['items', 'value', 'source-title', 'target-title', 'to-target-label', 'to-source-label'];
  }

  private parse(): TransferItem[] {
    const raw = this.attr('items');
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? (p as TransferItem[]) : [];
    } catch {
      return [];
    }
  }

  protected build(): BuildResult {
    const items = this.parse();
    if (!this.initialized) {
      this.target = (this.attr('value') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
      this.initialized = true;
    }
    const targetSet = new Set(this.target);
    const sourceItems = items.filter((it) => !targetSet.has(it.value));
    const targetItems = items.filter((it) => targetSet.has(it.value));
    const emit = () => this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: [...this.target] }));

    const toggle = (v: string) => {
      if (this.checked.has(v)) this.checked.delete(v);
      else this.checked.add(v);
    };
    const moveToTarget = () => {
      const moving = sourceItems.filter((it) => this.checked.has(it.value) && !it.disabled).map((it) => it.value);
      this.target = [...this.target, ...moving];
      moving.forEach((v) => this.checked.delete(v));
      emit();
      this.rerender();
    };
    const moveToSource = () => {
      const moving = targetItems.filter((it) => this.checked.has(it.value) && !it.disabled).map((it) => it.value);
      this.target = this.target.filter((v) => !moving.includes(v));
      moving.forEach((v) => this.checked.delete(v));
      emit();
      this.rerender();
    };

    const list = (title: string, rows: TransferItem[]) => {
      const wrap = h('div', { class: 'lily-transfer__list' });
      wrap.appendChild(h('div', { class: 'lily-transfer__header', text: title }));
      const ul = h('ul', { class: 'lily-transfer__items' });
      for (const it of rows) {
        const li = h('li');
        const label = h('label', { class: 'lily-transfer__item' });
        const cb = h('input', { attrs: { type: 'checkbox', ...(this.checked.has(it.value) ? { checked: '' } : {}), ...(it.disabled ? { disabled: '' } : {}) } }) as HTMLInputElement;
        cb.addEventListener('change', () => toggle(it.value));
        label.append(cb, h('span', { text: it.label }));
        li.appendChild(label);
        ul.appendChild(li);
      }
      wrap.appendChild(ul);
      return wrap;
    };

    const btn = (label: string, glyph: string, enabled: boolean, onClick: () => void) => {
      const b = h('button', {
        class: 'lily-button lily-button--outline lily-button--sm',
        attrs: { type: 'button', 'data-status': 'primary', 'aria-label': label, disabled: enabled ? null : '' },
      });
      b.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, text: glyph }));
      b.addEventListener('click', onClick);
      return b;
    };

    const root = h('div', { class: 'lily-transfer' });
    const actions = h('div', { class: 'lily-transfer__actions' });
    actions.append(
      btn(this.attr('to-target-label', 'Add selected')!, '›', sourceItems.some((it) => this.checked.has(it.value)), moveToTarget),
      btn(this.attr('to-source-label', 'Remove selected')!, '‹', targetItems.some((it) => this.checked.has(it.value)), moveToSource),
    );
    root.append(list(this.attr('source-title', 'Available')!, sourceItems), actions, list(this.attr('target-title', 'Selected')!, targetItems));
    return { root, slot: null };
  }
}
