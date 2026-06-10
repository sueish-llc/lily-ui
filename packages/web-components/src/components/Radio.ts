import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

/** Attributes forwarded to the inner radio input. */
const RADIO_ATTRS = ['name', 'value', 'checked', 'disabled', 'required', 'aria-describedby', 'aria-invalid'] as const;

/**
 * `<lily-radio>` — a single option in a radio group.
 *
 * Group radios by sharing a `name` attribute. For an accessible group, wrap
 * them in a `<fieldset>` with a `<legend>`.
 *
 * Attributes: `label`, `id`, `name`, `value`, `checked`, `disabled`,
 * `required`, `aria-describedby`, `aria-invalid`.
 *
 * @example
 * ```html
 * <fieldset>
 *   <legend>Plan</legend>
 *   <lily-radio name="plan" value="free" label="Free"></lily-radio>
 *   <lily-radio name="plan" value="pro" label="Pro"></lily-radio>
 * </fieldset>
 * ```
 */
export class LilyRadio extends LilyElement {
  static get observedAttributes(): string[] {
    return ['label', 'id', ...RADIO_ATTRS];
  }

  protected build(): BuildResult {
    const label = this.attr('label');
    const inputId = this.attr('id') || uid('lily-check');

    const wrapper = h('span', { class: 'lily-check' });

    const input = h('input', {
      class: 'lily-check__input',
      attrs: { type: 'radio', id: inputId },
    });

    this.forwardAttrs(input, RADIO_ATTRS);

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
