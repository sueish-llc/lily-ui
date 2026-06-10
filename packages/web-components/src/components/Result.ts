import { LilyElement, h, type BuildResult } from '../base/LilyElement';

export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

/** Default icons for each status (text glyphs — not color-only). */
const DEFAULT_ICONS: Record<ResultStatus, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
  '404': '?',
  '403': '⊘',
  '500': '☇',
};

const STATUS_LABELS: Record<ResultStatus, string> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  '404': 'not found',
  '403': 'forbidden',
  '500': 'server error',
};

/**
 * `<lily-result>` — a feedback block that reports the outcome of an operation.
 * Each status has a distinct icon so meaning is not conveyed by color alone.
 * Children become the actions area.
 *
 * Attributes: `status`, `title`, `description`.
 *
 * @example
 * ```html
 * <lily-result status="success" title="送信完了" description="受け付けました。">
 *   <lily-button>トップへ戻る</lily-button>
 * </lily-result>
 * ```
 */
export class LilyResult extends LilyElement {
  static get observedAttributes(): string[] {
    return ['status', 'title', 'description'];
  }

  protected build(): BuildResult {
    const status = (this.attr('status', 'info') as ResultStatus);
    const title = this.attr('title', '');
    const description = this.attr('description');

    const root = h('div', { class: ['lily-result', `lily-result--${status}`] });

    // Icon — conveys status by glyph + accessible label, not color alone.
    const iconSpan = h('span', {
      class: 'lily-result__icon',
      text: DEFAULT_ICONS[status] ?? '?',
      attrs: {
        role: 'img',
        'aria-label': STATUS_LABELS[status] ?? status,
      },
    });
    root.appendChild(iconSpan);

    root.appendChild(h('p', { class: 'lily-result__title', text: title ?? '' }));

    if (description) {
      root.appendChild(h('p', { class: 'lily-result__description', text: description }));
    }

    // Children become the actions row (empty slot is a no-op if no authored children).
    const actions = h('div', { class: 'lily-result__actions' });
    root.appendChild(actions);
    return { root, slot: actions };
  }
}
