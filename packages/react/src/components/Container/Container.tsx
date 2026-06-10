import { forwardRef, type ElementType } from 'react';
import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../../utils/polymorphic';

import type { BreakpointToken } from '../../tokens';

/** Breakpoint at which the container becomes width-capped, or `'fluid'`. */
export type ContainerWidth = Exclude<BreakpointToken, 'xs'> | 'fluid';

export interface ContainerOwnProps {
  /**
   * Cap behavior:
   * - omitted → responsive (caps step up at each breakpoint)
   * - a breakpoint (`'sm'`…`'2xl'`) → fluid until then, capped after
   * - `'fluid'` → always full width
   */
  width?: ContainerWidth;
}

const CLASS = 'lily-container';
const DEFAULT_TAG = 'div' as const;

/**
 * Container — centers page content and constrains its max width.
 *
 * @example
 * ```tsx
 * <Container>…</Container>          // responsive
 * <Container width="lg">…</Container> // fluid until lg
 * <Container width="fluid">…</Container>
 * ```
 */
function ContainerImpl<C extends ElementType = typeof DEFAULT_TAG>(
  { as, width, className, children, ...rest }: PolymorphicProps<C, ContainerOwnProps> & { className?: string },
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? DEFAULT_TAG) as ElementType;
  const classes = cx(CLASS, width && `${CLASS}--${width}`, className);
  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
}

export const Container = forwardRef(ContainerImpl) as <C extends ElementType = typeof DEFAULT_TAG>(
  props: PolymorphicProps<C, ContainerOwnProps> & { className?: string; ref?: React.Ref<Element> },
) => React.ReactElement;
