import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-floating-label>` — a label that floats above the control when it has
 * focus or a value.
 *
 * Wrap a single control (e.g. `<lily-input>`, `<input>`, `<select>`,
 * `<lily-select>`). The label is a real `<label for>`, so it remains fully
 * accessible. The slotted control receives an `id` (if not already set) and a
 * `placeholder=" "` (required for the CSS `:not(:placeholder-shown)` float
 * trigger).
 *
 * Attributes: `label`.
 *
 * Rendered DOM:
 * ```html
 * <div class="lily-floating">
 *   <!-- slotted control -->
 *   <label for="…">…</label>
 * </div>
 * ```
 *
 * @example
 * ```html
 * <lily-floating-label label="Email">
 *   <lily-input type="email"></lily-input>
 * </lily-floating-label>
 * ```
 */
export class LilyFloatingLabel extends LilyElement {
  static get observedAttributes(): string[] {
    return ['label'];
  }

  protected build(): BuildResult {
    const label = this.attr('label', '')!;
    const controlId = uid('lily-floating');

    const root = h('div', { class: 'lily-floating' });

    // The label is appended after the slotted control (mirrors React DOM order).
    const labelEl = h('label', { attrs: { for: controlId }, text: label });

    // The base class will slot the authored children directly into root.
    // We append the label after the slot, so it ends up after the control.
    // We use a microtask to append the label after the base class has placed
    // the slotted nodes into root.
    Promise.resolve().then(() => {
      // Wire the slotted control: set id and placeholder.
      const control = this._findControl(root);
      if (control) {
        if (!control.getAttribute('id')) control.setAttribute('id', controlId);

        // Inputs need a non-empty placeholder for the CSS float trigger.
        if (control.tagName !== 'SELECT' && !control.getAttribute('placeholder')) {
          control.setAttribute('placeholder', ' ');
        }

        // Update label's for attribute in case the control already had an id.
        const actualId = control.getAttribute('id');
        if (actualId) labelEl.setAttribute('for', actualId);
      }

      // Ensure the label is the last child of root (after the slotted control).
      root.appendChild(labelEl);
    });

    return { root, slot: root };
  }

  /** Find the first native or Lily form control in the given container. */
  private _findControl(container: HTMLElement): HTMLElement | null {
    // Direct native control
    const native = container.querySelector<HTMLElement>('input, select, textarea');
    if (native) return native;

    // Lily custom element that wraps a native control
    const lilyCtl = container.querySelector<HTMLElement>(
      'lily-input, lily-textarea, lily-select',
    );
    return lilyCtl ?? null;
  }
}
