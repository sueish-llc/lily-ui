import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

export interface CarouselProps {
  /** Slides to display. */
  slides: ReactNode[];
  /** Controlled active slide index. */
  index?: number;
  /** Initial active index (uncontrolled). @default 0 */
  defaultIndex?: number;
  /** Called when the active slide changes. */
  onIndexChange?: (index: number) => void;
  /** Auto-advance interval in ms (0 disables). @default 0 */
  interval?: number;
  /** Show prev/next controls. @default true */
  controls?: boolean;
  /** Show slide indicators. @default true */
  indicators?: boolean;
  /** Accessible label for the carousel. @default 'Carousel' */
  label?: string;
  className?: string;
}

const CLASS = 'lily-carousel';

/**
 * Carousel — a slideshow for cycling through items.
 *
 * Uses `aria-roledescription="carousel"`, labeled slides, and pauses
 * auto-advance on hover/focus. Respect users' reduced-motion preference by
 * leaving `interval` at 0 unless motion is wanted.
 *
 * @example
 * ```tsx
 * <Carousel slides={[<img … />, <img … />]} interval={5000} />
 * ```
 */
export function Carousel({
  slides,
  index,
  defaultIndex = 0,
  onIndexChange,
  interval = 0,
  controls = true,
  indicators = true,
  label = 'Carousel',
  className,
}: CarouselProps) {
  const id = useId();
  const count = slides.length;
  const [active, setActive] = useControllableState<number>({
    value: index,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  });
  const paused = useRef(false);

  const go = useCallback(
    (next: number) => setActive((next + count) % count),
    [count, setActive],
  );

  // Auto-advance, referencing the latest active index without resetting the
  // timer on every slide change.
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    if (interval <= 0 || count <= 1) return;
    const t = setInterval(() => {
      if (!paused.current) go(activeRef.current + 1);
    }, interval);
    return () => clearInterval(t);
  }, [interval, count, go]);

  return (
    <div
      className={cx(CLASS, className)}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      <div className={`${CLASS}__viewport`} style={{ transform: `translateX(-${active * 100}%)` }}>
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`${CLASS}__slide`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            id={`${id}-slide-${i}`}
            aria-hidden={i !== active}
          >
            {slide}
          </div>
        ))}
      </div>

      {controls && count > 1 && (
        <>
          <button
            type="button"
            className={`${CLASS}__control ${CLASS}__control--prev`}
            aria-label="Previous slide"
            onClick={() => go(active - 1)}
          >
            <span aria-hidden="true">&lsaquo;</span>
          </button>
          <button
            type="button"
            className={`${CLASS}__control ${CLASS}__control--next`}
            aria-label="Next slide"
            onClick={() => go(active + 1)}
          >
            <span aria-hidden="true">&rsaquo;</span>
          </button>
        </>
      )}

      {indicators && count > 1 && (
        <ul className={`${CLASS}__indicators`}>
          {slides.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                className={`${CLASS}__indicator`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active || undefined}
                onClick={() => setActive(i)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
