import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/** A column span: 1–12, `'auto'` (content width), or `true` (equal width). */
export type ColSpan = number | 'auto' | boolean;

/** Map a single span value to its class name for a given breakpoint infix. */
function spanClass(value: string | null, infix: string): string | false {
  if (value === null) return false;
  if (value === '') return `lily-col${infix}`;
  return `lily-col${infix}-${value}`;
}

/**
 * `<lily-col>` — a column in the 12-column `<lily-row>` grid.
 *
 * Attributes: `span`, `offset`, `sm`, `md`, `lg`, `xl`, `xxl` (2xl), `as`.
 * Use an empty-string attribute value (e.g. `<lily-col sm="">`) for an
 * equal-width column at that breakpoint.
 *
 * @example
 * ```html
 * <lily-col span="12" md="6" lg="4">responsive column</lily-col>
 * <lily-col>equal width</lily-col>
 * <lily-col span="auto">content width</lily-col>
 * ```
 */
export class LilyCol extends LilyElement {
  static get observedAttributes(): string[] {
    return ['span', 'offset', 'sm', 'md', 'lg', 'xl', 'xxl', 'as'];
  }

  protected build(): BuildResult {
    const spanAttr = this.getAttribute('span');
    const offsetAttr = this.attr('offset');
    const smAttr = this.getAttribute('sm');
    const mdAttr = this.getAttribute('md');
    const lgAttr = this.getAttribute('lg');
    const xlAttr = this.getAttribute('xl');
    const xxlAttr = this.getAttribute('xxl');

    // Default to equal-width when no base span or offset is given.
    let baseClass: string | false;
    if (spanAttr === null && offsetAttr === undefined) {
      baseClass = 'lily-col';
    } else {
      baseClass = spanAttr !== null ? spanClass(spanAttr, '') : false;
    }

    const root = h(this.attr('as', 'div') as 'div', {
      class: [
        baseClass,
        offsetAttr ? `lily-offset-${offsetAttr}` : false,
        spanClass(smAttr, '-sm'),
        spanClass(mdAttr, '-md'),
        spanClass(lgAttr, '-lg'),
        spanClass(xlAttr, '-xl'),
        spanClass(xxlAttr, '-2xl'),
      ],
    });
    return { root };
  }
}
