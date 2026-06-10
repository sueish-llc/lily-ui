import { LilyElement, h, type BuildResult } from '../base/LilyElement';

const CLASS = 'lily-mark';

type MarkStatus = 'warning' | 'success' | 'info' | 'danger' | 'primary';
const VALID_STATUSES = new Set<MarkStatus>(['warning', 'success', 'info', 'danger', 'primary']);

/**
 * `<lily-mark>` — highlights a text run with a semantic-color background using
 * the native `<mark>` element. The highlight is decorative; meaning must live
 * in the text itself (WCAG 1.4.1).
 *
 * Attributes: `status` (`'warning'`(default)|`'success'`|`'info'`|`'danger'`|`'primary'`).
 *
 * @example
 * ```html
 * <p>Read the <lily-mark>important notice</lily-mark> before continuing.</p>
 * <lily-mark status="success">Approved</lily-mark>
 * ```
 */
export class LilyMark extends LilyElement {
  static get observedAttributes(): string[] {
    return ['status'];
  }

  protected build(): BuildResult {
    const raw = this.attr('status', 'warning') as MarkStatus;
    const status: MarkStatus = VALID_STATUSES.has(raw) ? raw : 'warning';
    const root = h('mark', { class: this.cx(CLASS, `${CLASS}--${status}`) });
    return { root, slot: root };
  }
}
