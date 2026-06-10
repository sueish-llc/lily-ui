import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

/** Attributes forwarded to the inner checkbox input. */
const CHECKBOX_ATTRS = ['name', 'value', 'checked', 'disabled', 'required', 'aria-describedby', 'aria-invalid'] as const;

/**
 * `<lily-checkbox>` — a single boolean control with an inline label.
 *
 * Attributes: `label`, `id`, `checked`, `name`, `value`, `disabled`,
 * `required`, `aria-describedby`, `aria-invalid`.
 *
 * @example
 * ```html
 * <lily-checkbox label="Accept terms" name="terms"></lily-checkbox>
 * ```
 */
export class LilyCheckbox extends LilyElement {
  static get observedAttributes(): string[] {
    return ['label', 'id', ...CHECKBOX_ATTRS];
  }

  protected build(): BuildResult {
    const label = this.attr('label');
    const inputId = this.attr('id') || uid('lily-check');

    const wrapper = h('span', { class: 'lily-check' });

    const input = h('input', {
      class: 'lily-check__input',
      attrs: { type: 'checkbox', id: inputId },
    });

    this.forwardAttrs(input, CHECKBOX_ATTRS);

    wrapper.appendChild(input);

    if (label) {
      wrapper.appendChild(
        h('label', { class: 'lily-check__label', attrs: { for: inputId }, text: label }),
      );
    }

    // native change events bubble out of the host automatically.
    return { root: wrapper, slot: null };
  }
}
