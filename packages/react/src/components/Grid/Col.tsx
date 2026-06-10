import { forwardRef, type ElementType } from 'react';
import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../../utils/polymorphic';

/** A column span: 1–12, `'auto'` (content width), or `true` (equal width). */
export type ColSpan = number | 'auto' | boolean;

/** Per-breakpoint span configuration. */
export interface ColResponsive {
  sm?: ColSpan;
  md?: ColSpan;
  lg?: ColSpan;
  xl?: ColSpan;
  '2xl'?: ColSpan;
}

export interface ColOwnProps extends ColResponsive {
  /** Base (xs) span. */
  span?: ColSpan;
  /** Base (xs) offset, 0–11. */
  offset?: number;
}

const CLASS = 'lily-col';
const DEFAULT_TAG = 'div' as const;
const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', '2xl'] as const;

/** Map a single span value to its class name for a given breakpoint infix. */
function spanClass(value: ColSpan | undefined, infix: string): string | false {
  if (value === undefined || value === false) return false;
  if (value === true) return `${CLASS}${infix}`;
  return `${CLASS}${infix}-${value}`;
}

/**
 * Col — a column in the 12-column {@link Row} grid.
 *
 * @example
 * ```tsx
 * <Col span={12} md={6} lg={4}>responsive column</Col>
 * <Col>equal width</Col>
 * <Col span="auto">content width</Col>
 * ```
 */
function ColImpl<C extends ElementType = typeof DEFAULT_TAG>(
  {
    as,
    span,
    offset,
    sm,
    md,
    lg,
    xl,
    '2xl': xxl,
    className,
    children,
    ...rest
  }: PolymorphicProps<C, ColOwnProps> & { className?: string },
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? DEFAULT_TAG) as ElementType;
  const responsive: ColResponsive = { sm, md, lg, xl, '2xl': xxl };

  // Default to equal-width when no base span is given.
  const base = span === undefined && offset === undefined ? true : span;

  const classes = cx(
    spanClass(base, ''),
    offset ? `lily-offset-${offset}` : false,
    ...BREAKPOINTS.map((bp) => spanClass(responsive[bp], `-${bp}`)),
    className,
  );

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
}

export const Col = forwardRef(ColImpl) as <C extends ElementType = typeof DEFAULT_TAG>(
  props: PolymorphicProps<C, ColOwnProps> & { className?: string; ref?: React.Ref<Element> },
) => React.ReactElement;
