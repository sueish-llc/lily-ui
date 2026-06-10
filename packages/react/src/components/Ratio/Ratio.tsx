import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

/** A named ratio or an explicit `[width, height]` pair. */
export type NamedRatio = '1x1' | '4x3' | '16x9' | '21x9';
export type RatioValue = NamedRatio | [number, number];

const NAMED: Record<NamedRatio, [number, number]> = {
  '1x1': [1, 1],
  '4x3': [4, 3],
  '16x9': [16, 9],
  '21x9': [21, 9],
};

export interface RatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio. @default '16x9' */
  ratio?: RatioValue;
  children: ReactNode;
}

const CLASS = 'lily-ratio';

/**
 * Ratio — maintains an aspect ratio for embedded content (iframe, video, img).
 *
 * @example
 * ```tsx
 * <Ratio ratio="16x9"><iframe title="demo" src="…" /></Ratio>
 * <Ratio ratio={[3, 2]}><img src="…" alt="" /></Ratio>
 * ```
 */
export const Ratio = forwardRef<HTMLDivElement, RatioProps>(function Ratio(
  { ratio = '16x9', className, style, children, ...rest },
  ref,
) {
  const [w, h] = Array.isArray(ratio) ? ratio : NAMED[ratio];
  const percentage = `${(h / w) * 100}%`;
  return (
    <div
      ref={ref}
      className={cx(CLASS, className)}
      style={{ ['--lily-aspect-ratio' as string]: percentage, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
});
