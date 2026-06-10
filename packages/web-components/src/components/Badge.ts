import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/** Semantic intent, mapped to theme color tokens. */
export type BadgeStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral';

/**
 * `<lily-badge>` — a small count or label.
 *
 * Attributes: `status`, `subtle`, `pill`, `as`.
 *
 * @example
 * ```html
 * <lily-badge status="danger" pill>9</lily-badge>
 * <lily-badge status="success" subtle>Active</lily-badge>
 * ```
 */
export class LilyBadge extends LilyElement {
  static get observedAttributes(): string[] {
    return ['status', 'subtle', 'pill', 'as'];
  }

  protected build(): BuildResult {
    const root = h(this.attr('as', 'span') as 'span', {
      class: [
        'lily-badge',
        this.boolAttr('subtle') && 'lily-badge--subtle',
        this.boolAttr('pill') && 'lily-badge--pill',
      ],
      attrs: { 'data-status': this.attr('status', 'primary') ?? null },
    });
    return { root };
  }
}
