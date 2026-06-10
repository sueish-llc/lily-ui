import { LilyElement, h, type BuildResult } from '../base/LilyElement';

const CLASS = 'lily-toolbar';

/**
 * `<lily-toolbar>` — a single-tab-stop group of controls with a roving tabindex.
 *
 * Implements `role="toolbar"` with the WAI-ARIA keyboard model: Arrow keys move
 * focus between items; Home/End jump to first/last. Only one item holds
 * `tabindex="0"` at a time. Authored children (buttons, toggles, etc.) are
 * slotted directly into the toolbar container.
 *
 * Attributes: `orientation` (`horizontal` | `vertical`, default `horizontal`),
 * `aria-label`.
 *
 * @example
 * ```html
 * <lily-toolbar aria-label="Text formatting">
 *   <button type="button">Bold</button>
 *   <button type="button">Italic</button>
 * </lily-toolbar>
 * ```
 */
export class LilyToolbar extends LilyElement {
  static get observedAttributes(): string[] {
    return ['orientation', 'aria-label'];
  }

  protected build(): BuildResult {
    const orientation = this.attr('orientation', 'horizontal') as 'horizontal' | 'vertical';
    const label = this.attr('aria-label');

    const root = h('div', {
      class: this.cx(CLASS, orientation === 'vertical' && `${CLASS}--vertical`),
      attrs: {
        role: 'toolbar',
        'aria-orientation': orientation,
        'aria-label': label ?? null,
      },
    });

    root.addEventListener('keydown', (e: KeyboardEvent) => this.onKeyDown(e));
    root.addEventListener('focusin', () => this.ensureTabStop(root));

    return { root };
  }

  private getFocusableItems(root: HTMLElement): HTMLElement[] {
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [role="button"]:not([aria-disabled="true"]), [tabindex]:not([tabindex="-1"]):not([disabled])',
      ),
    ).filter((el) => el.closest('[role="toolbar"]') === root);
  }

  private ensureTabStop(root: HTMLElement): void {
    const items = this.getFocusableItems(root);
    if (items.length === 0) return;
    const hasTabStop = items.some((el) => el.getAttribute('tabindex') === '0');
    if (!hasTabStop) {
      items.forEach((el, i) => el.setAttribute('tabindex', i === 0 ? '0' : '-1'));
    }
  }

  private onKeyDown(e: KeyboardEvent): void {
    const root = this.querySelector<HTMLElement>('[role="toolbar"]');
    if (!root) return;
    const items = this.getFocusableItems(root);
    if (items.length === 0) return;

    const currentIdx = items.findIndex((el) => el === document.activeElement);
    const orientation = this.attr('orientation', 'horizontal') as 'horizontal' | 'vertical';
    const isHorizontal = orientation === 'horizontal';

    let nextIdx: number | null = null;

    switch (e.key) {
      case isHorizontal ? 'ArrowRight' : 'ArrowDown':
        nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % items.length;
        break;
      case isHorizontal ? 'ArrowLeft' : 'ArrowUp':
        nextIdx =
          currentIdx === -1
            ? items.length - 1
            : (currentIdx - 1 + items.length) % items.length;
        break;
      case isHorizontal ? 'ArrowDown' : 'ArrowRight':
        nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % items.length;
        break;
      case isHorizontal ? 'ArrowUp' : 'ArrowLeft':
        nextIdx =
          currentIdx === -1
            ? items.length - 1
            : (currentIdx - 1 + items.length) % items.length;
        break;
      case 'Home':
        nextIdx = 0;
        break;
      case 'End':
        nextIdx = items.length - 1;
        break;
      default:
        return;
    }

    if (nextIdx !== null) {
      e.preventDefault();
      const next = items[nextIdx];
      if (next) {
        items.forEach((el) => el.setAttribute('tabindex', '-1'));
        next.setAttribute('tabindex', '0');
        next.focus();
      }
    }
  }
}
