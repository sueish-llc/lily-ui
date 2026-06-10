import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-list-group>` — a series of content items. Compose with
 * `<lily-list-group-item>`.
 *
 * @example
 * ```html
 * <lily-list-group>
 *   <lily-list-group-item active>One</lily-list-group-item>
 *   <lily-list-group-item>Two</lily-list-group-item>
 *   <lily-list-group-item disabled>Three</lily-list-group-item>
 * </lily-list-group>
 * ```
 */
export class LilyListGroup extends LilyElement {
  static get observedAttributes(): string[] {
    return [];
  }

  protected build(): BuildResult {
    const root = h('ul', { class: 'lily-list-group' });
    return { root };
  }
}

/**
 * `<lily-list-group-item>` — a single item in a `<lily-list-group>`.
 *
 * - `action` adds hover/focus affordances (`lily-list-group__item--action`).
 * - `active` sets `aria-current`.
 * - `disabled` sets `aria-disabled`.
 *
 * Attributes: `action`, `active`, `disabled`.
 *
 * @example
 * ```html
 * <lily-list-group-item action active>Current item</lily-list-group-item>
 * ```
 */
export class LilyListGroupItem extends LilyElement {
  static get observedAttributes(): string[] {
    return ['action', 'active', 'disabled'];
  }

  protected build(): BuildResult {
    const CLASS = 'lily-list-group';
    const action = this.boolAttr('action');
    const active = this.boolAttr('active');
    const disabled = this.boolAttr('disabled');

    const root = h('li', {
      class: [`${CLASS}__item`, action && `${CLASS}__item--action`],
      attrs: {
        'aria-current': active ? 'true' : null,
        'aria-disabled': disabled ? 'true' : null,
      },
    });

    return { root };
  }
}
