import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * `<lily-visually-hidden>` — hides content visually while keeping it available
 * to assistive technologies (the classic sr-only technique).
 *
 * Renders a `<span>` that uses clip-path / position / 0-size to disappear from
 * visual layout while remaining in the accessibility tree. Add the `focusable`
 * attribute to make it reappear on `:focus-within` — useful for skip-navigation
 * links and other keyboard-only helpers.
 *
 * Attributes: `focusable`, `as`.
 *
 * @example
 * ```html
 * <!-- Static SR label -->
 * <lily-visually-hidden>Loading…</lily-visually-hidden>
 *
 * <!-- Skip link, visible on focus -->
 * <lily-visually-hidden as="a" focusable href="#main">
 *   Skip to main content
 * </lily-visually-hidden>
 * ```
 */
export class LilyVisuallyHidden extends LilyElement {
  static get observedAttributes(): string[] {
    return ['focusable', 'as'];
  }

  protected build(): BuildResult {
    const tag = (this.attr('as') ?? 'span') as keyof HTMLElementTagNameMap;
    const focusable = this.boolAttr('focusable');

    const root = h(tag, {
      class: this.cx(
        'lily-visually-hidden',
        focusable && 'lily-visually-hidden--focusable',
      ),
    });

    // Forward anchor-relevant attributes when rendered as a link.
    if (tag === 'a') {
      this.forwardAttrs(root, ['href', 'target', 'rel', 'aria-label']);
    }

    return { root };
  }
}
