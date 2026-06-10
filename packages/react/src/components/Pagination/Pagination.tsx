import { forwardRef, type HTMLAttributes } from 'react';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Total number of pages. */
  count: number;
  /** Current page (1-based). */
  page: number;
  /** Called with the next page when a control is activated. */
  onChange: (page: number) => void;
  /** Max number of numbered buttons to show (window). @default 7 */
  siblingWindow?: number;
  /** Show previous/next arrows. @default true */
  showArrows?: boolean;
  /** Accessible label for the nav landmark. @default 'Pagination' */
  label?: string;
}

const CLASS = 'lily-pagination';

/** Build the visible page list with `'…'` gaps. */
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
 * Pagination — accessible page navigation.
 *
 * Renders a `<nav>` + list of buttons; the current page is `aria-current`,
 * and disabled arrows are `aria-disabled`.
 *
 * @example
 * ```tsx
 * <Pagination count={10} page={page} onChange={setPage} />
 * ```
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { count, page, onChange, siblingWindow = 7, showArrows = true, label = 'Pagination', className, ...rest },
  ref,
) {
  const pages = buildPages(count, page, siblingWindow);
  const atStart = page <= 1;
  const atEnd = page >= count;

  return (
    <nav ref={ref} aria-label={label} className={className} {...rest}>
      <ul className={CLASS}>
        {showArrows && (
          <li className={`${CLASS}__item`}>
            <button
              type="button"
              className={`${CLASS}__link`}
              aria-label="Previous page"
              aria-disabled={atStart || undefined}
              disabled={atStart}
              onClick={() => !atStart && onChange(page - 1)}
            >
              &lsaquo;
            </button>
          </li>
        )}

        {pages.map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} className={`${CLASS}__item`} aria-hidden="true">
              <span className={`${CLASS}__link`} aria-disabled="true">
                &hellip;
              </span>
            </li>
          ) : (
            <li
              key={p}
              className={`${CLASS}__item`}
              {...(p === page ? { 'aria-current': 'page' as const } : {})}
            >
              <button
                type="button"
                className={`${CLASS}__link`}
                aria-label={`Page ${p}`}
                onClick={() => onChange(p)}
              >
                {p}
              </button>
            </li>
          ),
        )}

        {showArrows && (
          <li className={`${CLASS}__item`}>
            <button
              type="button"
              className={`${CLASS}__link`}
              aria-label="Next page"
              aria-disabled={atEnd || undefined}
              disabled={atEnd}
              onClick={() => !atEnd && onChange(page + 1)}
            >
              &rsaquo;
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
});
