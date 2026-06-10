import { LilyElement, h, FORM_CONTROL_ATTRS, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-select>` — a native dropdown control (accessible by default).
 *
 * Inside a `<lily-form-field>` the field wires `id`, `aria-describedby`,
 * `aria-invalid`, and `required` automatically.
 *
 * Native attributes (`name`, `value`, `required`, `disabled`, `autocomplete`,
 * `aria-label`, `aria-describedby`, `aria-invalid`) are forwarded to the inner
 * `<select>`. Authored children (`<option>` elements) are slotted inside.
 *
 * @example
 * ```html
 * <lily-form-field label="Country">
 *   <lily-select name="country">
 *     <option value="jp">Japan</option>
 *     <option value="us">USA</option>
 *   </lily-select>
 * </lily-form-field>
 * ```
 */
export class LilySelect extends LilyElement {
  static get observedAttributes(): string[] {
    return [...FORM_CONTROL_ATTRS];
  }

  protected build(): BuildResult {
    const inner = h('select', { class: 'lily-select' });

    this.forwardAttrs(inner, FORM_CONTROL_ATTRS);

    // native change events bubble out of the host automatically.
    // Authored children (<option> elements) are slotted inside the select.
    return { root: inner, slot: inner };
  }
}
