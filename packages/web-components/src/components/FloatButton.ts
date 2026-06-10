import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-float-button>` — a floating action button anchored to a viewport corner.
 * Always supply an accessible name via the `aria-label` attribute when icon-only.
 *
 * Attributes: `position` (bottom-right|bottom-left|top-right|top-left),
 * `status` (primary|danger|success|warning|neutral), `size` (sm|md|lg),
 * `shape` (circle|square).
 *
 * @example
 * ```html
 * <lily-float-button position="bottom-right" aria-label="ページ先頭へ戻る">↑</lily-float-button>
 * ```
 */
export class LilyFloatButton extends LilyElement {
  static get observedAttributes(): string[] {
    return ['position', 'status', 'size', 'shape', 'disabled', 'aria-label'];
  }

  protected build(): BuildResult {
    const position = this.attr('position', 'bottom-right');
    const status = this.attr('status', 'primary');
    const size = this.attr('size', 'md');
    const shape = this.attr('shape', 'circle');
    const disabled = this.boolAttr('disabled');
    const ariaLabel = this.attr('aria-label');

    const root = h('button', {
      class: [
        'lily-float-button',
        `lily-float-button--${position}`,
        `lily-float-button--${size}`,
        `lily-float-button--${shape}`,
      ],
      attrs: {
        type: 'button',
        'data-status': status ?? null,
        ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
      },
    });

    if (disabled) (root as HTMLButtonElement).disabled = true;

    return { root };
  }
}

/**
 * `<lily-float-button-group>` — a speed-dial wrapper that stacks several
 * `<lily-float-button>` elements. The trigger button toggles visibility of
 * the child buttons. Keyboard-operable: Escape closes the group.
 *
 * Attributes: `position`, `trigger-label`.
 *
 * @example
 * ```html
 * <lily-float-button-group position="bottom-right" trigger-label="アクションを開く">
 *   <lily-float-button aria-label="メモを追加">📝</lily-float-button>
 * </lily-float-button-group>
 * ```
 */
export class LilyFloatButtonGroup extends LilyElement {
  static get observedAttributes(): string[] {
    return ['position', 'trigger-label'];
  }

  private _open = false;
  private _trigger: HTMLButtonElement | null = null;
  private _boundKeyDown: ((e: KeyboardEvent) => void) | null = null;
  private _boundPointerDown: ((e: PointerEvent) => void) | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._boundKeyDown = this._handleKeyDown.bind(this);
    this._boundPointerDown = this._handlePointerDown.bind(this);
    this.addEventListener('keydown', this._boundKeyDown);
    if (typeof document !== 'undefined') {
      document.addEventListener('pointerdown', this._boundPointerDown);
    }
  }

  disconnectedCallback(): void {
    if (this._boundKeyDown) this.removeEventListener('keydown', this._boundKeyDown);
    if (this._boundPointerDown && typeof document !== 'undefined') {
      document.removeEventListener('pointerdown', this._boundPointerDown);
    }
  }

  protected build(): BuildResult {
    const position = this.attr('position', 'bottom-right');
    const triggerLabel = this.attr('trigger-label', 'Toggle actions');

    const root = h('div', {
      class: [
        'lily-float-button-group',
        `lily-float-button-group--${position}`,
        this._open && 'lily-float-button-group--open',
      ],
    });

    // Items container
    const items = h('div', {
      class: 'lily-float-button-group__items',
      attrs: { role: 'group', 'aria-hidden': this._open ? 'false' : 'true' },
    });
    root.appendChild(items);

    // Trigger button
    const trigger = h('button', {
      class: 'lily-float-button lily-float-button--circle lily-float-button-group__trigger',
      attrs: {
        type: 'button',
        'aria-expanded': this._open ? 'true' : 'false',
        'aria-haspopup': 'true',
        'aria-label': triggerLabel ?? null,
      },
      text: '+',
    });
    trigger.addEventListener('click', () => {
      this._open = !this._open;
      this.rerender();
    });
    this._trigger = trigger;
    root.appendChild(trigger);

    return { root, slot: items };
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this._open) {
      this._open = false;
      this.rerender();
      this._trigger?.focus();
    }
  }

  private _handlePointerDown(e: PointerEvent): void {
    if (this._open && !this.contains(e.target as Node)) {
      this._open = false;
      this.rerender();
    }
  }
}
