import { forwardRef, useState, type CSSProperties, type ImgHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  /** Image source. */
  src: string;
  /** Required alternative text. */
  alt: string;
  /** Content shown if the image fails to load. @default the alt text */
  fallback?: ReactNode;
  /** Fixed aspect ratio as `w/h` (e.g. `16/9`) or `[w, h]`. */
  ratio?: number | [number, number];
  /** Rounded corners. @default false */
  rounded?: boolean;
}

/**
 * Image — a media wrapper with lazy-loading, fade-in, optional fixed aspect
 * ratio, and a graceful fallback when the source fails.
 *
 * @example
 * ```tsx
 * <Image src="/p.jpg" alt="製品" ratio={16 / 9} rounded />
 * ```
 */
export const Image = forwardRef<HTMLDivElement, ImageProps>(function Image(
  { src, alt, fallback, ratio, rounded = false, className, style, loading = 'lazy', ...rest },
  ref,
) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const aspect = Array.isArray(ratio) ? ratio[0] / ratio[1] : ratio;

  return (
    <div
      ref={ref}
      className={cx('lily-image', rounded && 'lily-image--rounded', !loaded && !errored && 'lily-image--loading', className)}
      style={{ aspectRatio: aspect, ...style } as CSSProperties}
    >
      {errored ? (
        <div className="lily-image__fallback">{fallback ?? alt}</div>
      ) : (
        <img
          className="lily-image__img"
          src={src}
          alt={alt}
          loading={loading}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          {...rest}
        />
      )}
    </div>
  );
});
