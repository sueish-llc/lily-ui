import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-fieldset>` — groups related form controls with a native `<fieldset>`
 * and `<legend>` for maximum browser and screen-reader compatibility.
 *
 * Setting the `disabled` attribute propagates natively to every descendant form
 * control — no extra JS required.
 *
 * Attributes: `legend`, `description`, `disabled`.
 *
 * @example
 * ```html
 * <lily-fieldset legend="Shipping address" description="Where should we send it?">
 *   <lily-input type="text" placeholder="Street"></lily-input>
 * </lily-fieldset>
 * ```
 */
export class LilyFieldset extends LilyElement {
  static get observedAttributes(): string[] {
    return ['legend', 'description', 'disabled'];
  }

  protected build(): BuildResult {
    const legend = this.attr('legend', '')!;
    const description = this.attr('description');
    const disabled = this.boolAttr('disabled');

    const CLASS = 'lily-fieldset';

    const root = h('fieldset', {
      class: CLASS,
      attrs: { disabled: disabled ? true : null },
    });

    root.appendChild(
      h('legend', { class: `${CLASS}__legend`, text: legend }),
    );

    if (description) {
      root.appendChild(
        h('p', { class: `${CLASS}__description`, text: description }),
      );
    }

    // A nested div collects authored children so the base class can slot them.
    const body = h('div');
    root.appendChild(body);

    return { root, slot: body };
  }
}
