import { LilyElement, h, type BuildResult } from '../base/LilyElement';
import { listenDismiss } from '../base/interactions';

const CLASS = 'lily-context-menu';

const ITEM_SELECTOR = `.${CLASS}__item:not([aria-disabled="true"])`;

/**
 * `<lily-context-menu>` — a menu that opens at the pointer on right-click over
 * its trigger area, and from the keyboard (Shift+F10 or the ContextMenu key).
 *
 * The menu uses `role="menu"` with `role="menuitem"` children (light-DOM
 * `<lily-context-menu-item>` / `<lily-context-menu-divider>`) and the standard
 * roving-focus key model (Arrow keys, Home/End, Enter to activate, Escape to
 * close). The trigger area label comes from the `label` attribute.
 *
 * Attributes: `label`, `open` (reflected).
 *
 * @example
 * ```html
 * <lily-context-menu label="Right-click here">
 *   <lily-context-menu-item>Copy</lily-context-menu-item>
 *   <lily-context-menu-divider></lily-context-menu-divider>
 *   <lily-context-menu-item>Delete</lily-context-menu-item>
 * </lily-context-menu>
 * ```
 */
export class LilyContextMenu extends LilyElement {
  private x = 0;
  private y = 0;
  private dismissCleanup: (() => void) | null = null;

  static get observedAttributes(): string[] {
    return ['label', 'open'];
  }

  private setOpen(next: boolean): void {
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  private openAt(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.setOpen(true);
  }

  protected build(): BuildResult {
    const isOpen = this.boolAttr('open');

    const root = h('div', { class: CLASS });

    const trigger = h('div', {
      class: `${CLASS}__trigger`,
      attrs: { tabindex: '0' },
      text: this.attr('label'),
    });
    trigger.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.openAt((e as MouseEvent).clientX, (e as MouseEvent).clientY);
    });
    trigger.addEventListener('keydown', (e) => {
      const ke = e as KeyboardEvent;
      if (ke.key === 'ContextMenu' || (ke.shiftKey && ke.key === 'F10')) {
        ke.preventDefault();
        const rect = trigger.getBoundingClientRect();
        this.openAt(rect.left, rect.bottom);
      }
    });
    root.appendChild(trigger);

    const menu = h('div', {
      class: [`${CLASS}__menu`, 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy'],
      attrs: { role: 'menu', hidden: isOpen ? null : '' },
    });
    menu.style.position = 'fixed';
    menu.style.left = `${this.x}px`;
    menu.style.top = `${this.y}px`;

    const items = (): HTMLElement[] => Array.from(menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    menu.addEventListener('keydown', (e) => {
      const ke = e as KeyboardEvent;
      const list = items();
      if (list.length === 0) return;
      const active = (typeof document !== 'undefined' ? document.activeElement : null) as HTMLElement | null;
      const current = active ? list.indexOf(active) : -1;
      const focusAt = (i: number) => list[(i + list.length) % list.length]?.focus();
      if (ke.key === 'ArrowDown') {
        ke.preventDefault();
        focusAt(current + 1);
      } else if (ke.key === 'ArrowUp') {
        ke.preventDefault();
        focusAt(current - 1);
      } else if (ke.key === 'Home') {
        ke.preventDefault();
        focusAt(0);
      } else if (ke.key === 'End') {
        ke.preventDefault();
        focusAt(list.length - 1);
      } else if (ke.key === 'Tab') {
        ke.preventDefault();
        this.setOpen(false);
      }
    });
    menu.addEventListener('click', () => this.setOpen(false));
    root.appendChild(menu);

    // Manage the dismiss listener (Escape / outside click) in step with open.
    this.dismissCleanup?.();
    this.dismissCleanup = null;
    if (isOpen) {
      this.dismissCleanup = listenDismiss(root, () => this.setOpen(false));
      // Move focus to the first item so roving focus + Arrow keys work.
      requestAnimationFrame(() => items()[0]?.focus());
    }

    // Authored menu items are slotted into the menu.
    return { root, slot: menu };
  }

  disconnectedCallback(): void {
    this.dismissCleanup?.();
    this.dismissCleanup = null;
  }
}

/**
 * `<lily-context-menu-item>` — a single actionable menu item (`role="menuitem"`).
 * Use inside a `<lily-context-menu>`. Click events bubble out of the host.
 */
export class LilyContextMenuItem extends LilyElement {
  static get observedAttributes(): string[] {
    return ['disabled'];
  }

  protected build(): BuildResult {
    const disabled = this.boolAttr('disabled');
    const root = h('button', {
      class: `${CLASS}__item`,
      attrs: {
        type: 'button',
        role: 'menuitem',
        tabindex: '-1',
        'aria-disabled': disabled ? 'true' : null,
        disabled: disabled ? '' : null,
      },
    });
    return { root, slot: root };
  }
}

/**
 * `<lily-context-menu-divider>` — a visual separator between menu items. Use
 * inside a `<lily-context-menu>`.
 */
export class LilyContextMenuDivider extends LilyElement {
  static get observedAttributes(): string[] {
    return [];
  }

  protected build(): BuildResult {
    const root = h('div', { class: `${CLASS}__divider`, attrs: { role: 'separator' } });
    return { root, slot: null };
  }
}
