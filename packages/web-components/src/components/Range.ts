import { LilyElement, h, FORM_CONTROL_ATTRS, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-range>` — a slider control (`<input type="range">`).
 *
 * Inside a `<lily-form-field>` the field wires `id`, `aria-describedby`,
 * `aria-invalid`, and `required` automatically. Provide an `aria-label` or
 * a FormField label so the slider is named.
 *
 * Native attributes (`name`, `value`, `min`, `max`, `step`, `required`,
 * `disabled`, `aria-label`, `aria-describedby`, `aria-invalid`) are forwarded
 * to the inner `<input type="range">`.
 *
 * @example
 * ```html
 * <lily-form-field label="Volume">
 *   <lily-range min="0" max="100"></lily-range>
 * </lily-form-field>
 * ```
 */
export class LilyRange extends LilyElement {
  static get observedAttributes(): string[] {
    return [...FORM_CONTROL_ATTRS];
  }

  protected build(): BuildResult {
    const inner = h('input', {
      class: 'lily-range',
      attrs: { type: 'range' },
    });

    this.forwardAttrs(inner, FORM_CONTROL_ATTRS);

    // native input/change events bubble out of the host automatically.
    return { root: inner, slot: null };
  }
}
