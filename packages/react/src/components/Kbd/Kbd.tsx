import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

/**
 * Kbd — an inline keyboard key/shortcut.
 *
 * @example
 * ```tsx
 * <Kbd>⌘</Kbd> <Kbd>K</Kbd>
 * ```
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ className, children, ...rest }, ref) {
  return (
    <kbd ref={ref} className={cx('lily-kbd', className)} {...rest}>
      {children}
    </kbd>
  );
});

export interface CodeProps extends HTMLAttributes<HTMLElement> {
  /** Render as a padded, scrollable block instead of inline. @default false */
  block?: boolean;
  children?: ReactNode;
}

/**
 * Code — inline (or block) monospace code.
 *
 * @example
 * ```tsx
 * <Code>npm i @lily-ui/react</Code>
 * <Code block>{source}</Code>
 * ```
 */
export const Code = forwardRef<HTMLElement, CodeProps>(function Code(
  { block = false, className, children, ...rest },
  ref,
) {
  return (
    <code ref={ref} className={cx('lily-code', block && 'lily-code--block', className)} {...rest}>
      {children}
    </code>
  );
});
