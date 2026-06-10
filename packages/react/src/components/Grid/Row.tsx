import { forwardRef, type ElementType } from 'react';
import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../../utils/polymorphic';
import type { SpacingToken } from '../../tokens';

export interface RowOwnProps {
  /** Horizontal + vertical gutter (spacing token). */
  gutter?: SpacingToken;
  /** Horizontal gutter only (overrides `gutter`). */
  gutterX?: SpacingToken;
  /** Vertical gutter only (overrides `gutter`). */
  gutterY?: SpacingToken;
}

const CLASS = 'lily-row';
const DEFAULT_TAG = 'div' as const;

/**
 * Row — flex container for {@link Col}s in the 12-column grid.
 *
 * @example
 * ```tsx
 * <Row gutter="4">
 *   <Col span={6}>left</Col>
 *   <Col span={6}>right</Col>
 * </Row>
 * ```
 */
function RowImpl<C extends ElementType = typeof DEFAULT_TAG>(
  { as, gutter, gutterX, gutterY, className, children, ...rest }: PolymorphicProps<C, RowOwnProps> & { className?: string },
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? DEFAULT_TAG) as ElementType;
  const classes = cx(
    CLASS,
    gutter && `lily-g-${gutter}`,
    gutterX && `lily-gx-${gutterX}`,
    gutterY && `lily-gy-${gutterY}`,
    className,
  );
  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
}

export const Row = forwardRef(RowImpl) as <C extends ElementType = typeof DEFAULT_TAG>(
  props: PolymorphicProps<C, RowOwnProps> & { className?: string; ref?: React.Ref<Element> },
) => React.ReactElement;
