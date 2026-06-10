import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/** A single breadcrumb crumb. */
export interface BreadcrumbItem {
  /** Visible label. */
  label: string;
  /** Link target; omit for the current (last) page. */
  href?: string;
}

/**
 * `<lily-breadcrumb>` — shows the current page's location in the hierarchy.
 *
 * Renders a `<nav>` landmark with an ordered list; the last item is marked
 * `aria-current="page"` and rendered as plain text. Pass structured data via
 * the `items` JSON attribute.
 *
 * Attributes: `items` (JSON array of `{label, href?}`), `divider`, `label`.
 *
 * @example
 * ```html
 * <lily-breadcrumb
 *   items='[{"label":"Home","href":"/"},{"label":"Library"}]'
 * ></lily-breadcrumb>
 * ```
 */
export class LilyBreadcrumb extends LilyElement {
  static get observedAttributes(): string[] {
    return ['items', 'divider', 'label'];
  }

  protected build(): BuildResult {
    const divider = this.attr('divider', '/');
    const ariaLabel = this.attr('label', 'Breadcrumb');

    let items: BreadcrumbItem[] = [];
    try {
      const raw = this.attr('items');
      if (raw) items = JSON.parse(raw) as BreadcrumbItem[];
    } catch {
      // Malformed JSON — render with empty list.
    }

    const nav = h('nav', {
      attrs: { 'aria-label': ariaLabel ?? null },
    });

    const ol = h('ol', { class: 'lily-breadcrumb' });
    ol.style.setProperty('--lily-breadcrumb-divider', `'${divider}'`);

    items.forEach((item, i) => {
      const isLast = i === items.length - 1;
      const li = h('li', { class: 'lily-breadcrumb__item' });
      if (isLast) li.setAttribute('aria-current', 'page');

      if (item.href && !isLast) {
        li.appendChild(h('a', { class: 'lily-breadcrumb__link', attrs: { href: item.href }, text: item.label }));
      } else {
        li.textContent = item.label;
      }

      ol.appendChild(li);
    });

    nav.appendChild(ol);

    // No authored children to slot — slot is null.
    return { root: nav, slot: null };
  }
}
