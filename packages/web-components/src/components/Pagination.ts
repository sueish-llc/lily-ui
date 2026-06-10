import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/** Build the visible page list with `'…'` gaps — ported exactly from React. */
function buildPages(count: number, page: number, windowSize: number): (number | 'gap')[] {
  if (count <= windowSize) return Array.from({ length: count }, (_, i) => i + 1);

  const side = Math.max(1, Math.floor((windowSize - 3) / 2));
  const pages: (number | 'gap')[] = [1];
  const start = Math.max(2, page - side);
  const end = Math.min(count - 1, page + side);

  if (start > 2) pages.push('gap');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < count - 1) pages.push('gap');
  pages.push(count);
  return pages;
}

/**
 * `<lily-pagination>` — accessible page navigation.
 *
 * Renders a `<nav>` + list of buttons; the current page has `aria-current`,
 * and disabled arrows have `aria-disabled`. Activating a page dispatches a
 * `change` CustomEvent with the target page number as `detail`.
 *
 * Attributes: `count`, `page`, `sibling-window`, `show-arrows`, `label`.
 *
 * @example
 * ```html
 * <lily-pagination count="10" page="1"></lily-pagination>
 * ```
 */
export class LilyPagination extends LilyElement {
  static get observedAttributes(): string[] {
    return ['count', 'page', 'sibling-window', 'show-arrows', 'label'];
  }

  protected build(): BuildResult {
    const CLASS = 'lily-pagination';
    const count = this.numAttr('count', 1);
    const page = this.numAttr('page', 1);
    const siblingWindow = this.numAttr('sibling-window', 7);
    // `show-arrows` defaults true; it is false only when the attribute is
    // explicitly set to the string "false".
    const showArrowsAttr = this.getAttribute('show-arrows');
    const showArrows = showArrowsAttr === null || showArrowsAttr !== 'false';
    const label = this.attr('label', 'Pagination')!;

    const pages = buildPages(count, page, siblingWindow);
    const atStart = page <= 1;
    const atEnd = page >= count;

    const nav = h('nav', { attrs: { 'aria-label': label } });
    const ul = h('ul', { class: CLASS });
    nav.appendChild(ul);

    const activate = (nextPage: number) => {
      this.dispatchEvent(new CustomEvent('change', { detail: nextPage, bubbles: true }));
    };

    // Previous arrow
    if (showArrows) {
      const li = h('li', { class: `${CLASS}__item` });
      const btn = h('button', {
        class: `${CLASS}__link`,
        attrs: {
          type: 'button',
          'aria-label': 'Previous page',
          'aria-disabled': atStart ? 'true' : null,
        },
        html: '&lsaquo;',
      });
      if (atStart) btn.disabled = true;
      btn.addEventListener('click', () => { if (!atStart) activate(page - 1); });
      li.appendChild(btn);
      ul.appendChild(li);
    }

    // Page buttons
    for (const p of pages) {
      if (p === 'gap') {
        const li = h('li', {
          class: `${CLASS}__item`,
          attrs: { 'aria-hidden': 'true' },
        });
        const span = h('span', { class: `${CLASS}__link`, attrs: { 'aria-disabled': 'true' }, html: '&hellip;' });
        li.appendChild(span);
        ul.appendChild(li);
      } else {
        const li = h('li', { class: `${CLASS}__item` });
        if (p === page) li.setAttribute('aria-current', 'page');
        const btn = h('button', {
          class: `${CLASS}__link`,
          attrs: { type: 'button', 'aria-label': `Page ${p}` },
          text: String(p),
        });
        btn.addEventListener('click', () => activate(p));
        li.appendChild(btn);
        ul.appendChild(li);
      }
    }

    // Next arrow
    if (showArrows) {
      const li = h('li', { class: `${CLASS}__item` });
      const btn = h('button', {
        class: `${CLASS}__link`,
        attrs: {
          type: 'button',
          'aria-label': 'Next page',
          'aria-disabled': atEnd ? 'true' : null,
        },
        html: '&rsaquo;',
      });
      if (atEnd) btn.disabled = true;
      btn.addEventListener('click', () => { if (!atEnd) activate(page + 1); });
      li.appendChild(btn);
      ul.appendChild(li);
    }

    return { root: nav, slot: null };
  }
}
