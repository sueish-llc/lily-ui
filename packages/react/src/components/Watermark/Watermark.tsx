import { forwardRef, useMemo, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface WatermarkProps extends HTMLAttributes<HTMLDivElement> {
  /** Text to tile as the watermark. */
  text?: string;
  /** Image URL to tile instead of text. */
  image?: string;
  /** Rotation in degrees. @default -22 */
  rotate?: number;
  /** Gap between repeated tiles as `[x, y]` in pixels. @default [100, 60] */
  gap?: [number, number];
  /** Opacity of the overlay (0–1). Keep subtle to avoid obscuring content. @default 0.12 */
  opacity?: number;
  /** Content rendered beneath the watermark. */
  children?: ReactNode;
}

const CLASS = 'lily-watermark';

/**
 * Watermark — tiles a low-opacity text (or image) across its children using a
 * CSS `mask-image` / `background` overlay. The overlay is `pointer-events:none`
 * and `aria-hidden` so it does not interfere with content or assistive tech.
 *
 * Keep `opacity` subtle so the watermark never reduces content contrast below
 * WCAG 2.1 AAA thresholds — the default (0.12) is safe on white and dark
 * backgrounds.
 *
 * @example
 * ```tsx
 * <Watermark text="Confidential" rotate={-22} opacity={0.1}>
 *   <p>Protected content</p>
 * </Watermark>
 * ```
 */
export const Watermark = forwardRef<HTMLDivElement, WatermarkProps>(function Watermark(
  {
    text,
    image,
    rotate = -22,
    gap = [100, 60],
    opacity = 0.12,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const [gapX, gapY] = gap;

  /**
   * Build a data-URL SVG tile that carries the watermark mark. SVG lets us
   * rotate text precisely without DOM layout, and produces a lossless tile for
   * both retina and standard displays.
   */
  const dataUrl = useMemo(() => {
    const TILE_W = 200;
    const TILE_H = 120;
    let inner: string;
    if (image) {
      const safeHref = image.replace(/"/g, '&quot;');
      inner = `<image href="${safeHref}" x="0" y="0" width="${TILE_W}" height="${TILE_H}" preserveAspectRatio="xMidYMid meet" />`;
    } else {
      const safeText = (text ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      inner = `<text
        x="${TILE_W / 2}"
        y="${TILE_H / 2}"
        font-size="14"
        font-family="sans-serif"
        fill="currentColor"
        text-anchor="middle"
        dominant-baseline="middle"
        transform="rotate(${rotate}, ${TILE_W / 2}, ${TILE_H / 2})"
      >${safeText}</text>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}">${inner}</svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  }, [text, image, rotate]);

  const overlayStyle: CSSProperties = {
    backgroundImage: dataUrl,
    backgroundRepeat: 'repeat',
    backgroundSize: `${200 + gapX}px ${120 + gapY}px`,
    opacity,
  };

  return (
    <div
      ref={ref}
      className={cx(CLASS, className)}
      style={style}
      {...rest}
    >
      {children}
      <div
        className={`${CLASS}__overlay`}
        style={overlayStyle}
        aria-hidden="true"
      />
    </div>
  );
});
