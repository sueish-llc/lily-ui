import { forwardRef, type ElementType } from 'react';
import { cx } from '../../utils/cx';
import type { PolymorphicProps } from '../../utils/polymorphic';
import type { SpacingToken } from '../../tokens';

export interface StackOwnProps {
  /** Layout direction. @default 'vertical' */
  direction?: 'vertical' | 'horizontal';
  /** Gap between children (spacing token). @default '3' */
  gap?: SpacingToken;
}

const DEFAULT_TAG = 'div' as const;

/**
 * Stack — one-dimensional flex layout with a consistent gap.
 *
 * @example
 * ```tsx
 * <Stack gap="4">…</Stack>                       // vertical
 * <Stack direction="horizontal" gap="2">…</Stack> // horizontal
 * ```
 */
function StackImpl<C extends ElementType = typeof DEFAULT_TAG>(
  { as, direction = 'vertical', gap = '3', className, children, ...rest }: PolymorphicProps<C, StackOwnProps> & {
    className?: string;
  },
  ref: React.Ref<Element>,
) {
  const Tag = (as ?? DEFAULT_TAG) as ElementType;
  const base = direction === 'horizontal' ? 'lily-hstack' : 'lily-vstack';
  const classes = cx(base, `lily-gap-${gap}`, className);
  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
}

export const Stack = forwardRef(StackImpl) as <C extends ElementType = typeof DEFAULT_TAG>(
  props: PolymorphicProps<C, StackOwnProps> & { className?: string; ref?: React.Ref<Element> },
) => React.ReactElement;
