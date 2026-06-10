import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export interface MenuItemDef {
  label?: string;
  value?: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  divider?: boolean;
}

/**
 * `<lily-menu>` — a standalone command menu (WAI-ARIA menu) with roving tabindex
 * and arrow-key navigation. Items are a JSON `items` attribute. Dispatches a
 * `select` event whose `detail` is `{ value, index }`.
 *
 * Attributes: `items`, `label`.
 */
export class LilyMenu extends LilyElement {
  static get observedAttributes(): string[] {
    return ['items', 'label'];
  }

  private parse(): MenuItemDef[] {
    const raw = this.attr('items');
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? (p as MenuItemDef[]) : [];
    } catch {
      return [];
    }
  }

  protected build(): BuildResult {
    const items = this.parse();
    const root = h('div', { class: 'lily-menu', attrs: { role: 'menu', 'aria-label': this.attr('label') ?? null } });

    const enabled = items.map((it, i) => (!it.divider && !it.disabled ? i : -1)).filter((i) => i >= 0);
    const buttons = new Map<number, HTMLButtonElement>();
    const setFocus = (index: number) => {
      buttons.forEach((b, i) => b.setAttribute('tabindex', i === index ? '0' : '-1'));
      buttons.get(index)?.focus();
    };

    items.forEach((item, i) => {
      if (item.divider) {
        root.appendChild(h('div', { class: 'lily-menu__divider', attrs: { role: 'separator' } }));
        return;
      }
      const btn = h('button', {
        class: 'lily-menu__item',
        attrs: {
          type: 'button',
          role: 'menuitem',
          tabindex: i === enabled[0] ? 0 : -1,
          'aria-disabled': item.disabled ? 'true' : null,
          disabled: item.disabled ? '' : null,
        },
      }) as HTMLButtonElement;
      if (item.icon) btn.appendChild(h('span', { class: 'lily-menu__icon', attrs: { 'aria-hidden': 'true' }, text: item.icon }));
      btn.appendChild(h('span', { text: item.label ?? '' }));
      if (item.shortcut) btn.appendChild(h('span', { class: 'lily-menu__shortcut', text: item.shortcut }));

      btn.addEventListener('click', () => this.dispatchEvent(new CustomEvent('select', { bubbles: true, detail: { value: item.value, index: i } })));
      btn.addEventListener('keydown', (e) => {
        const pos = enabled.indexOf(i);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setFocus(enabled[(pos + 1) % enabled.length]!);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setFocus(enabled[(pos - 1 + enabled.length) % enabled.length]!);
        } else if (e.key === 'Home') {
          e.preventDefault();
          setFocus(enabled[0]!);
        } else if (e.key === 'End') {
          e.preventDefault();
          setFocus(enabled[enabled.length - 1]!);
        }
      });
      buttons.set(i, btn);
      root.appendChild(btn);
    });

    return { root, slot: null };
  }
}
