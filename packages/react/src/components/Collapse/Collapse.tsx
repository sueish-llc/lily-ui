import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';

export interface CollapseProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the content is expanded. */
  open: boolean;
}

const CLASS = 'lily-collapse';

/**
 * Collapse — animates showing/hiding content by height.
 *
 * Pair the toggling control with `aria-expanded` and `aria-controls` pointing
 * at this element's `id`.
 *
 * @example
 * ```tsx
 * <button aria-expanded={open} aria-controls="c1" onClick={() => setOpen(!open)}>
 *   Toggle
 * </button>
 * <Collapse id="c1" open={open}>content</Collapse>
 * ```
 */
export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(function Collapse(
  { open, className, children, style, ...rest },
  ref,
) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(open ? undefined : 0);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (open) {
      // Expand to content height, then release to auto for responsiveness.
      setHeight(el.scrollHeight);
      const t = setTimeout(() => setHeight(undefined), 220);
      return () => clearTimeout(t);
    } else {
      // Collapse: set explicit height first so the transition has a start.
      setHeight(el.scrollHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  return (
    <div
      ref={mergeRefs(ref, innerRef)}
      className={cx(CLASS, className)}
      style={{ height, ...style }}
      hidden={!open && height === 0}
      {...rest}
    >
      {children}
    </div>
  );
});
