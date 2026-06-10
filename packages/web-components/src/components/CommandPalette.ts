import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  shortcut?: string;
  keywords?: string[];
}

/**
 * `<lily-command-palette>` — a ⌘K overlay with a search field and a filtered,
 * grouped command list. Toggle with the `open` attribute (or ⌘K / Ctrl+K).
 * Dispatches `select` (detail = command id) and `open-change` (detail = boolean).
 *
 * Attributes: `open`, `items` (JSON), `placeholder`, `empty-text`, `hotkey`
 * (`false` to disable), `label`.
 */
export class LilyCommandPalette extends LilyElement {
  private query = '';
  private active = 0;
  private wasOpen = false;
  private baseId = uid('cmd');
  private onGlobalKey = (e: KeyboardEvent) => {
    if (this.attr('hotkey') !== 'false' && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.setOpen(!this.boolAttr('open'));
    }
  };

  static get observedAttributes(): string[] {
    return ['open', 'items', 'placeholder', 'empty-text', 'hotkey', 'label'];
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this.onGlobalKey);
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this.onGlobalKey);
  }

  private setOpen(open: boolean): void {
    if (open) this.setAttribute('open', '');
    else this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('open-change', { bubbles: true, detail: open }));
  }

  private parse(): CommandItem[] {
    const raw = this.attr('items');
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? (p as CommandItem[]) : [];
    } catch {
      return [];
    }
  }

  protected build(): BuildResult {
    const open = this.boolAttr('open');
    if (!open) {
      this.wasOpen = false;
      return { root: h('div'), slot: null };
    }
    if (!this.wasOpen) {
      this.query = '';
      this.active = 0;
      this.wasOpen = true;
    }

    const items = this.parse();
    const listId = `${this.baseId}-list`;
    const emptyText = this.attr('empty-text', 'No results')!;

    const filtered = () => {
      const q = this.query.toLowerCase();
      return items.filter((it) => !q || it.label.toLowerCase().includes(q) || it.keywords?.some((k) => k.toLowerCase().includes(q)));
    };
    const choose = (it: CommandItem) => {
      this.dispatchEvent(new CustomEvent('select', { bubbles: true, detail: it.id }));
      this.setOpen(false);
    };

    const root = h('div', { class: 'lily-command-palette' });
    root.addEventListener('pointerdown', () => this.setOpen(false));

    const dialog = h('div', {
      class: 'lily-command-palette__dialog',
      attrs: { role: 'dialog', 'aria-modal': 'true', 'aria-label': this.attr('label', 'Command palette')! },
    });
    dialog.addEventListener('pointerdown', (e) => e.stopPropagation());

    const input = h('input', {
      class: 'lily-command-palette__input',
      attrs: {
        role: 'combobox',
        'aria-expanded': 'true',
        'aria-controls': listId,
        'aria-autocomplete': 'list',
        placeholder: this.attr('placeholder', 'コマンドを検索…')!,
        value: this.query,
      },
    }) as HTMLInputElement;
    const list = h('ul', { class: 'lily-command-palette__list', attrs: { id: listId, role: 'listbox' } });

    const renderList = () => {
      const rows = filtered();
      list.replaceChildren();
      input.setAttribute('aria-activedescendant', rows[this.active] ? `${listId}-${this.active}` : '');
      if (rows.length === 0) {
        list.appendChild(h('li', { class: 'lily-command-palette__empty', attrs: { role: 'presentation' }, text: emptyText }));
        return;
      }
      let last: string | undefined;
      rows.forEach((it, i) => {
        if (it.group && it.group !== last) list.appendChild(h('li', { class: 'lily-command-palette__group', attrs: { role: 'presentation' }, text: it.group }));
        last = it.group;
        const li = h('li', {
          class: ['lily-command-palette__item', i === this.active && 'lily-command-palette__item--active'],
          attrs: { id: `${listId}-${i}`, role: 'option', 'aria-selected': String(i === this.active) },
        });
        li.appendChild(h('span', { text: it.label }));
        if (it.shortcut) li.appendChild(h('span', { class: 'lily-command-palette__shortcut', text: it.shortcut }));
        li.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          choose(it);
        });
        li.addEventListener('pointerenter', () => {
          this.active = i;
          renderList();
        });
        list.appendChild(li);
      });
    };

    input.addEventListener('input', () => {
      this.query = input.value;
      this.active = 0;
      renderList();
    });
    input.addEventListener('keydown', (e) => {
      const rows = filtered();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.active = Math.min(rows.length - 1, this.active + 1);
        renderList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.active = Math.max(0, this.active - 1);
        renderList();
      } else if (e.key === 'Enter' && rows[this.active]) {
        e.preventDefault();
        choose(rows[this.active]!);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.setOpen(false);
      }
    });

    dialog.append(input, list);
    root.appendChild(dialog);
    renderList();
    requestAnimationFrame(() => input.focus());
    return { root, slot: null };
  }
}
