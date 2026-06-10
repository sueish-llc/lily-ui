import { forwardRef, type TableHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Zebra-striped rows. @default false */
  striped?: boolean;
  /** Highlight rows on hover. @default false */
  hover?: boolean;
  /** Bordered cells. @default false */
  bordered?: boolean;
  /** Compact padding. @default false */
  size?: 'sm' | 'md';
  /** Wrap in a horizontally scrollable container for narrow viewports. */
  responsive?: boolean;
  /** Accessible caption describing the table contents. */
  caption?: ReactNode;
}

const CLASS = 'lily-table';

/**
 * Table — accessible data table.
 *
 * Compose with native `<thead>/<tbody>/<tr>/<th>/<td>`. Provide a `caption`
 * (or `<th scope>` headers) so the table is understandable to screen readers.
 *
 * @example
 * ```tsx
 * <Table striped hover caption="Users">
 *   <thead><tr><th scope="col">Name</th></tr></thead>
 *   <tbody><tr><td>Ada</td></tr></tbody>
 * </Table>
 * ```
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { striped, hover, bordered, size = 'md', responsive, caption, className, children, ...rest },
  ref,
) {
  const table = (
    <table
      ref={ref}
      className={cx(
        CLASS,
        striped && `${CLASS}--striped`,
        hover && `${CLASS}--hover`,
        bordered && `${CLASS}--bordered`,
        size === 'sm' && `${CLASS}--sm`,
        className,
      )}
      {...rest}
    >
      {caption && <caption>{caption}</caption>}
      {children}
    </table>
  );

  if (responsive) {
    return <div className="lily-table-responsive">{table}</div>;
  }
  return table;
});
