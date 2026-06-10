import { LilyElement, h, type BuildResult } from '../base/LilyElement';
import { listenDismiss } from '../base/interactions';

const CLASS = 'lily-dropdown';

/**
 * `<lily-dropdown>` — a toggleable menu anchored to a trigger button.
 *
 * The trigger exposes `aria-haspopup="menu"` and `aria-expanded`; the menu uses
 * `role="menu"` with `role="menuitem"` children (light-DOM
 * `<lily-dropdown-item>` / `<lily-dropdown-divider>`). Closes on Escape or
 * outside click.
 *
 * Attributes: `trigger`, `align-end`, `open` (reflected).
 *
 * @example
 * ```html
 * <lily-dropdown trigger="Options">
 *   <lily-dropdown-item>Edit</lily-dropdown-item>
 *   <lily-dropdown-divider></lily-dropdown-divider>
 *   <lily-dropdown-item>Delete</lily-dropdown-item>
 * </lily-dropdown>
 * ```
 */
export class LilyDropdown extends LilyElement {
  private dismissCleanup: (() => void) | null = null;

  static get observedAttributes(): string[] {
    return ['trigger', 'align-end', 'open'];
  }

  private setOpen(next: boolean): void {
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  protected build(): BuildResult {
    const isOpen = this.boolAttr('open');
    const alignEnd = this.boolAttr('align-end');

    const root = h('div', { class: CLASS });

    const trigger = h('button', {
      attrs: {
        type: 'button',
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen ? 'true' : 'false',
      },
      text: this.attr('trigger'),
    });
    trigger.addEventListener('click', () => this.setOpen(!this.boolAttr('open')));
    root.appendChild(trigger);

    const menu = h('ul', {
      class: [`${CLASS}__menu`, alignEnd && `${CLASS}__menu--end`, 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy'],
      attrs: { role: 'menu', hidden: isOpen ? null : '' },
    });
    root.appendChild(menu);

    // Manage the dismiss listener in step with the open state.
    this.dismissCleanup?.();
    this.dismissCleanup = null;
    if (isOpen) {
      this.dismissCleanup = listenDismiss(root, () => this.setOpen(false));
    }

    // Authored children (the menu items) are slotted into the menu.
    return { root, slot: menu };
  }

  disconnectedCallback(): void {
    this.dismissCleanup?.();
    this.dismissCleanup = null;
  }
}

/**
 * `<lily-dropdown-item>` — a single actionable menu item (`role="menuitem"`).
 * Use inside a `<lily-dropdown>`. Click events bubble out of the host.
 */
export class LilyDropdownItem extends LilyElement {
  static get observedAttributes(): string[] {
    return [];
  }

  protected build(): BuildResult {
    const root = h('li', { attrs: { role: 'none' } });
    const button = h('button', {
      class: `${CLASS}__item`,
      attrs: { type: 'button', role: 'menuitem' },
    });
    root.appendChild(button);
    return { root, slot: button };
  }
}

/**
 * `<lily-dropdown-divider>` — a visual separator between menu items. Use inside
 * a `<lily-dropdown>`.
 */
export class LilyDropdownDivider extends LilyElement {
  static get observedAttributes(): string[] {
    return [];
  }

  protected build(): BuildResult {
    const root = h('li', { attrs: { role: 'none' } });
    root.appendChild(h('hr', { class: `${CLASS}__divider` }));
    return { root, slot: null };
  }
}
