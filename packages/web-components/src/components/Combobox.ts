import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';
import { listenDismiss } from '../base/interactions';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * `<lily-combobox>` — a text field with a filtered listbox popup (WAI-ARIA
 * combobox). Options are a JSON `options` attribute. Dispatches a `change`
 * event whose `detail` is the selected value.
 *
 * Attributes: `options`, `value`, `placeholder`, `disabled`, `empty-text`,
 * `size`, `label`, `name`, `id`.
 */
export class LilyCombobox extends LilyElement {
  private baseId = uid('combobox');
  private value: string | null = null;
  private query = '';
  private open = false;
  private active = 0;
  private initialized = false;
  private dispose: (() => void) | null = null;

  static get observedAttributes(): string[] {
    return ['options', 'value', 'placeholder', 'disabled', 'empty-text', 'size', 'label', 'name', 'id'];
  }

  disconnectedCallback(): void {
    this.dispose?.();
    this.dispose = null;
  }

  private parse(): ComboboxOption[] {
    const raw = this.attr('options');
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? (p as ComboboxOption[]) : [];
    } catch {
      return [];
    }
  }

  protected build(): BuildResult {
    const options = this.parse();
    const size = this.attr('size', 'md');
    const emptyText = this.attr('empty-text', 'No matches')!;
    const listboxId = `${this.baseId}-listbox`;

    if (!this.initialized) {
      this.value = this.attr('value') ?? null;
      this.query = options.find((o) => o.value === this.value)?.label ?? '';
      this.initialized = true;
    }

    const selectedLabel = () => options.find((o) => o.value === this.value)?.label ?? '';
    const matches = () =>
      this.query === selectedLabel() && !this.open
        ? options
        : options.filter((o) => o.label.toLowerCase().includes(this.query.toLowerCase()));

    const root = h('div', { class: 'lily-combobox' });
    const input = h('input', {
      class: ['lily-input', size !== 'md' && `lily-input--${size}`],
      attrs: {
        id: this.attr('id') ?? `${this.baseId}-input`,
        name: this.attr('name') ?? null,
        role: 'combobox',
        'aria-controls': listboxId,
        'aria-autocomplete': 'list',
        'aria-label': this.attr('label') ?? null,
        autocomplete: 'off',
        placeholder: this.attr('placeholder') ?? null,
        disabled: this.boolAttr('disabled') ? '' : null,
        value: this.query,
      },
    }) as HTMLInputElement;
    const listbox = h('ul', { class: 'lily-combobox__listbox', attrs: { id: listboxId, role: 'listbox' } });

    const choose = (opt: ComboboxOption) => {
      if (opt.disabled) return;
      this.value = opt.value;
      this.query = opt.label;
      input.value = opt.label;
      this.open = false;
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: opt.value }));
      render();
    };

    const render = () => {
      const list = matches();
      input.setAttribute('aria-expanded', String(this.open));
      if (this.open && list[this.active]) input.setAttribute('aria-activedescendant', `${listboxId}-${this.active}`);
      else input.removeAttribute('aria-activedescendant');
      listbox.hidden = !this.open;
      listbox.replaceChildren();
      if (list.length === 0) {
        listbox.appendChild(h('li', { class: 'lily-combobox__empty', attrs: { role: 'presentation' }, text: emptyText }));
        return;
      }
      list.forEach((opt, i) => {
        const li = h('li', {
          class: ['lily-combobox__option', i === this.active && 'lily-combobox__option--active'],
          attrs: {
            id: `${listboxId}-${i}`,
            role: 'option',
            'aria-selected': String(opt.value === this.value),
            'aria-disabled': opt.disabled ? 'true' : null,
          },
          text: opt.label,
        });
        li.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          choose(opt);
        });
        li.addEventListener('pointerenter', () => {
          this.active = i;
          render();
        });
        listbox.appendChild(li);
      });
    };

    input.addEventListener('input', () => {
      this.query = input.value;
      this.open = true;
      this.active = 0;
      render();
    });
    input.addEventListener('focus', () => {
      this.open = true;
      render();
    });
    input.addEventListener('keydown', (e) => {
      const list = matches();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.open = true;
        this.active = Math.min(list.length - 1, this.active + 1);
        render();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.active = Math.max(0, this.active - 1);
        render();
      } else if (e.key === 'Enter' && this.open && list[this.active]) {
        e.preventDefault();
        choose(list[this.active]!);
      } else if (e.key === 'Escape') {
        this.open = false;
        render();
      }
    });

    root.append(input, listbox);
    render();

    this.dispose?.();
    this.dispose = listenDismiss(root, () => {
      this.open = false;
      render();
    });

    return { root, slot: null };
  }
}
