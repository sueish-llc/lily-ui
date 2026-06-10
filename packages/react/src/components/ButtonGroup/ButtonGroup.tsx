import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout orientation. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Accessible label describing the group. */
  label?: string;
}

const CLASS = 'lily-btn-group';

/**
 * ButtonGroup — segments multiple {@link Button}s into a single control.
 *
 * Renders `role="group"`; provide a `label` so the group's purpose is announced.
 *
 * @example
 * ```tsx
 * <ButtonGroup label="Text alignment">
 *   <Button>Left</Button>
 *   <Button>Center</Button>
 *   <Button>Right</Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { orientation = 'horizontal', label, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={cx(CLASS, orientation === 'vertical' && `${CLASS}--vertical`, className)}
      {...rest}
    >
      {children}
    </div>
  );
});
