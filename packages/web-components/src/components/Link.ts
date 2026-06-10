import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type LinkStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info';

/**
 * `<lily-link>` — a styled anchor using the AAA `*-text` color tokens with a
 * visible focus ring.
 *
 * Attributes: `href`, `status`, `quiet`, `external`, `target`, `rel`.
 *
 * @example
 * ```html
 * <lily-link href="/docs">ドキュメント</lily-link>
 * <lily-link href="https://example.com" external>外部サイト</lily-link>
 * ```
 */
export class LilyLink extends LilyElement {
  static get observedAttributes(): string[] {
    return ['href', 'status', 'quiet', 'external', 'target', 'rel'];
  }

  protected build(): BuildResult {
    const status = this.attr('status', 'primary');
    const external = this.boolAttr('external');
    const root = h('a', {
      class: ['lily-link', this.boolAttr('quiet') && 'lily-link--quiet', external && 'lily-link--external'],
      attrs: {
        href: this.attr('href') ?? null,
        'data-status': status !== 'primary' ? status : null,
        target: external ? (this.attr('target') ?? '_blank') : (this.attr('target') ?? null),
        rel: external ? (this.attr('rel') ?? 'noopener noreferrer') : (this.attr('rel') ?? null),
      },
    });

    if (external) {
      const inner = h('span');
      root.appendChild(inner);
      root.appendChild(h('span', { class: 'lily-visually-hidden', text: ' (opens in new tab)' }));
      return { root, slot: inner };
    }
    return { root };
  }
}
