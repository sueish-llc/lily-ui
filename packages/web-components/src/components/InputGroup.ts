import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-input-group>` — joins a control with leading/trailing addons into one
 * unit. Compose with `<lily-input-group-addon>`.
 *
 * Decorative text addons should be associated with the control via
 * `aria-describedby` or a visible label.
 *
 * @example
 * ```html
 * <lily-input-group>
 *   <lily-input-group-addon>@</lily-input-group-addon>
 *   <lily-input aria-label="Username"></lily-input>
 * </lily-input-group>
 * ```
 */
export class LilyInputGroup extends LilyElement {
  static get observedAttributes(): string[] {
    return [];
  }

  protected build(): BuildResult {
    const root = h('div', { class: 'lily-input-group' });
    return { root };
  }
}

/**
 * `<lily-input-group-addon>` — a text/icon/button decoration attached to a
 * `<lily-input-group>`.
 *
 * @example
 * ```html
 * <lily-input-group-addon>@</lily-input-group-addon>
 * ```
 */
export class LilyInputGroupAddon extends LilyElement {
  static get observedAttributes(): string[] {
    return [];
  }

  protected build(): BuildResult {
    const root = h('span', { class: 'lily-input-group__addon' });
    return { root };
  }
}
