import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';

/** Attributes forwarded to the inner switch input. */
const SWITCH_ATTRS = ['name', 'value', 'checked', 'disabled', 'required', 'aria-describedby', 'aria-invalid'] as const;

/**
 * `<lily-switch>` — a toggle styled as a sliding switch.
 *
 * It is a checkbox under the hood with `role="switch"`, so it's fully
 * keyboard accessible.
 *
 * Attributes: `label`, `id`, `checked`, `name`, `value`, `disabled`,
 * `required`, `aria-describedby`, `aria-invalid`.
 *
 * @example
 * ```html
 * <lily-switch label="Enable notifications" name="notifications"></lily-switch>
 * ```
 */
export class LilySwitch extends LilyElement {
  static get observedAttributes(): string[] {
    return ['label', 'id', ...SWITCH_ATTRS];
  }

  protected build(): BuildResult {
    const label = this.attr('label');
    const inputId = this.attr('id') || uid('lily-switch');

    const wrapper = h('span', { class: 'lily-switch' });

    const input = h('input', {
      class: 'lily-switch__input',
      attrs: { type: 'checkbox', role: 'switch', id: inputId },
    });

    this.forwardAttrs(input, SWITCH_ATTRS);

    wrapper.appendChild(input);

    if (label) {
      wrapper.appendChild(
        h('label', { class: 'lily-switch__label', attrs: { for: inputId }, text: label }),
      );
    }

    // native change events bubble out of the host automatically.
    return { root: wrapper, slot: null };
  }
}
