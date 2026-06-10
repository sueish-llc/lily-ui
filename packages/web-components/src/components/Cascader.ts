import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export interface CascaderOption {
  value: string;
  label: string;
  disabled?: boolean;
  children?: CascaderOption[];
}

/**
 * `<lily-cascader>` — hierarchical selection shown as side-by-side columns.
 * Options are a JSON `options` attribute; the path seeds from a comma-joined
 * `value`. Dispatches a `change` event whose `detail` is the path array.
 *
 * Attributes: `options`, `value`, `label`.
 */
export class LilyCascader extends LilyElement {
  private path: string[] = [];
  private initialized = false;

  static get observedAttributes(): string[] {
    return ['options', 'value', 'label'];
  }

  private parse(): CascaderOption[] {
    const raw = this.attr('options');
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? (p as CascaderOption[]) : [];
    } catch {
      return [];
    }
  }

  protected build(): BuildResult {
    const options = this.parse();
    if (!this.initialized) {
      this.path = (this.attr('value') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
      this.initialized = true;
    }

    const columns: CascaderOption[][] = [options];
    let level = options;
    for (const id of this.path) {
      const opt = level.find((o) => o.value === id);
      if (opt?.children?.length) {
        columns.push(opt.children);
        level = opt.children;
      } else break;
    }

    const root = h('div', { class: 'lily-cascader', attrs: { role: 'group', 'aria-label': this.attr('label', 'Cascader')! } });
    columns.forEach((col, depth) => {
      const column = h('div', { class: 'lily-cascader__column' });
      for (const opt of col) {
        const btn = h('button', {
          class: ['lily-cascader__option', this.path[depth] === opt.value && 'lily-cascader__option--active'],
          attrs: { type: 'button', 'aria-disabled': opt.disabled ? 'true' : null, disabled: opt.disabled ? '' : null },
        });
        btn.appendChild(h('span', { text: opt.label }));
        if (opt.children?.length) btn.appendChild(h('span', { class: 'lily-cascader__arrow', attrs: { 'aria-hidden': 'true' }, text: '›' }));
        btn.addEventListener('click', () => {
          this.path = [...this.path.slice(0, depth), opt.value];
          this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: [...this.path] }));
          this.rerender();
        });
        column.appendChild(btn);
      }
      root.appendChild(column);
    });

    return { root, slot: null };
  }
}
