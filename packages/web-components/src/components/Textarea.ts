import { LilyElement, h, FORM_CONTROL_ATTRS, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-textarea>` — a multi-line text control.
 *
 * Inside a `<lily-form-field>` the field wires `id`, `aria-describedby`,
 * `aria-invalid`, and `required` automatically.
 *
 * Native attributes (`name`, `value`, `placeholder`, `required`, `disabled`,
 * `readonly`, `minlength`, `maxlength`, `autocomplete`, `aria-label`,
 * `aria-describedby`, `aria-invalid`) are forwarded to the inner `<textarea>`.
 *
 * Authored children (e.g. initial text content) are slotted inside the
 * `<textarea>` element.
 *
 * @example
 * ```html
 * <lily-form-field label="Bio"><lily-textarea rows="4"></lily-textarea></lily-form-field>
 * ```
 */
export class LilyTextarea extends LilyElement {
  static get observedAttributes(): string[] {
    return [...FORM_CONTROL_ATTRS];
  }

  protected build(): BuildResult {
    const inner = h('textarea', { class: 'lily-textarea' });

    this.forwardAttrs(inner, FORM_CONTROL_ATTRS);

    // native input/change events bubble out of the host automatically.
    // Authored children (text nodes) are slotted inside the textarea.
    return { root: inner, slot: inner };
  }
}
