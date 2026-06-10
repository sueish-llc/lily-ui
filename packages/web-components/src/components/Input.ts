import { LilyElement, h, FORM_CONTROL_ATTRS, type BuildResult } from '../base/LilyElement';

/** Control size. */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * `<lily-input>` — a single-line text control.
 *
 * Inside a `<lily-form-field>` the field wires `id`, `aria-describedby`,
 * `aria-invalid`, and `required` automatically.
 *
 * Native attributes (`name`, `value`, `placeholder`, `required`, `disabled`,
 * `readonly`, `type`, `autocomplete`, `inputmode`, `pattern`, `minlength`,
 * `maxlength`, `aria-label`, `aria-describedby`, `aria-invalid`) are forwarded
 * to the inner `<input>` element.
 *
 * Attributes: `size`, plus all native input attrs.
 *
 * @example
 * ```html
 * <lily-form-field label="Name"><lily-input type="text"></lily-input></lily-form-field>
 * <lily-input type="email" aria-label="Email"></lily-input>
 * ```
 */
export class LilyInput extends LilyElement {
  static get observedAttributes(): string[] {
    return ['size', ...FORM_CONTROL_ATTRS];
  }

  protected build(): BuildResult {
    const size = this.attr('size', 'md');

    const inner = h('input', {
      class: [
        'lily-input',
        size !== 'md' && `lily-input--${size}`,
      ],
    });

    this.forwardAttrs(inner, FORM_CONTROL_ATTRS);

    // native input/change events bubble out of the host automatically.
    return { root: inner, slot: null };
  }
}
