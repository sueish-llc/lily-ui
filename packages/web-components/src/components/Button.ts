import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/** Visual emphasis of the button. */
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';
/** Semantic intent, mapped to theme color tokens. */
export type ButtonStatus = 'primary' | 'danger' | 'success' | 'warning' | 'neutral';
/** Control size. */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * `<lily-button>` — the primary action control.
 *
 * Renders a native `<button>` (or the element named by `as`) with the correct
 * Lily classes and ARIA state. Click and other native events bubble out of the
 * host as usual.
 *
 * Attributes: `variant`, `status`, `size`, `block`, `loading`, `loading-label`,
 * `disabled`, `type`, `as`.
 *
 * @example
 * ```html
 * <lily-button status="danger" variant="outline">Delete</lily-button>
 * <lily-button as="a" href="/docs">Read the docs</lily-button>
 * ```
 */
export class LilyButton extends LilyElement {
  static get observedAttributes(): string[] {
    return ['variant', 'status', 'size', 'block', 'loading', 'loading-label', 'disabled', 'type', 'as'];
  }

  protected build(): BuildResult {
    const variant = this.attr('variant', 'solid');
    const status = this.attr('status', 'primary');
    const size = this.attr('size', 'md');
    const block = this.boolAttr('block');
    const loading = this.boolAttr('loading');
    const disabled = this.boolAttr('disabled') || loading;
    const tag = this.attr('as', 'button')!;
    const isNativeButton = tag === 'button';

    const root = h(tag as 'button', {
      class: [
        'lily-button',
        `lily-button--${variant}`,
        `lily-button--${size}`,
        block && 'lily-button--block',
      ],
      attrs: {
        'data-status': status ?? null,
        'aria-busy': loading ? 'true' : null,
      },
    });

    if (isNativeButton) {
      root.setAttribute('type', this.attr('type', 'button')!);
      if (disabled) (root as HTMLButtonElement).disabled = true;
    } else if (disabled) {
      root.setAttribute('aria-disabled', 'true');
    }

    if (loading) {
      root.appendChild(h('span', { class: 'lily-button__spinner', attrs: { 'aria-hidden': 'true' } }));
      root.appendChild(
        h('span', { class: 'lily-visually-hidden', text: this.attr('loading-label', 'Loading') }),
      );
    }

    // Authored children are appended after the spinner by the base class.
    return { root };
  }
}
