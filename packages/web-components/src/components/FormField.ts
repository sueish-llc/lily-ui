import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-form-field>` — wires a label, help text, and error message to a form
 * control.
 *
 * After building, the base class slots the host's authored children into the
 * field body. The first form control found among those slotted children gets
 * `id`, `aria-describedby`, `aria-invalid`, and `required` attributes set on it
 * so it is correctly associated with the field.
 *
 * Attributes: `label`, `help`, `error`, `required`, `hide-label`.
 *
 * @example
 * ```html
 * <lily-form-field label="Email" help="We never share it." required>
 *   <lily-input type="email"></lily-input>
 * </lily-form-field>
 * ```
 */
export class LilyFormField extends LilyElement {
  static get observedAttributes(): string[] {
    return ['label', 'help', 'error', 'required', 'hide-label'];
  }

  protected build(): BuildResult {
    const label = this.attr('label', '')!;
    const help = this.attr('help');
    const error = this.attr('error');
    const required = this.boolAttr('required');
    const hideLabel = this.boolAttr('hide-label');

    const base = uid('lily-field');
    const controlId = `${base}-control`;
    const helpId = help ? `${base}-help` : undefined;
    const errorId = error ? `${base}-error` : undefined;

    const root = h('div', { class: 'lily-field' });

    // Label
    const labelEl = h('label', {
      class: this.cx('lily-label', hideLabel && 'lily-visually-hidden'),
      attrs: { for: controlId },
    });
    labelEl.textContent = label;
    if (required) {
      labelEl.appendChild(
        h('span', { class: 'lily-label__required', attrs: { 'aria-hidden': 'true' }, text: '*' }),
      );
    }
    root.appendChild(labelEl);

    // Body slot — authored children go here
    const body = h('div', { class: 'lily-field__body' });
    root.appendChild(body);

    // Help text
    if (help && helpId) {
      root.appendChild(h('div', { class: 'lily-help', attrs: { id: helpId }, text: help }));
    }

    // Error text
    if (error && errorId) {
      root.appendChild(h('div', { class: 'lily-error', attrs: { id: errorId }, text: error }));
    }

    // After update(), the base class places _slotted nodes into `slot` (body).
    // We need to wire up the first control — do it asynchronously so the DOM is settled.
    Promise.resolve().then(() => {
      const control = this._findControl(body);
      if (!control) return;

      if (!control.getAttribute('id')) control.setAttribute('id', controlId);

      const describedByParts = [helpId, errorId].filter(Boolean) as string[];
      const existing = control.getAttribute('aria-describedby');
      const allParts = existing
        ? [existing, ...describedByParts].join(' ')
        : describedByParts.join(' ');
      if (allParts) control.setAttribute('aria-describedby', allParts);

      if (error) control.setAttribute('aria-invalid', 'true');
      else control.removeAttribute('aria-invalid');

      if (required) control.setAttribute('required', '');
    });

    return { root, slot: body };
  }

  /** Find the first native or Lily form control in the given container. */
  private _findControl(container: HTMLElement): HTMLElement | null {
    // Direct native control
    const native = container.querySelector<HTMLElement>('input, select, textarea');
    if (native) return native;

    // Lily custom element that wraps a native control
    const lilyCtl = container.querySelector<HTMLElement>(
      'lily-input, lily-textarea, lily-select, lily-checkbox, lily-radio, lily-switch, lily-range',
    );
    return lilyCtl ?? null;
  }
}
