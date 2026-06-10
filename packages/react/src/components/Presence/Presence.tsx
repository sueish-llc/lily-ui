import { cloneElement, isValidElement, type ReactElement, type Ref } from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';
import { usePresence } from '../../hooks/usePresence';
import type { AnimationName } from '../../motion/animations';

export interface PresenceProps {
  /** Whether the child should be shown. Exit animation plays when it goes false. */
  present: boolean;
  /** Entrance animation (catalog name). @default 'fade-in' */
  enter?: AnimationName;
  /** Exit animation (catalog name). @default 'fade-out' */
  exit?: AnimationName;
  /**
   * The single element to animate. It must accept `className`, `style`, and a
   * forwarded `ref` (every Lily component does).
   */
  children: ReactElement;
}

/**
 * Animate a single child in and out of the DOM using the animation catalog.
 *
 * Keeps the child mounted through its exit animation, then removes it. Honors
 * the motion tier (`minimal` shortens to a fade, `none`/reduced-motion unmounts
 * instantly).
 *
 * @example
 * <Presence present={open} enter="zoom-in" exit="zoom-out">
 *   <div className="card">…</div>
 * </Presence>
 */
export function Presence({ present, enter = 'fade-in', exit = 'fade-out', children }: PresenceProps) {
  const { isPresent, state, ref } = usePresence(present);

  if (!isPresent || !isValidElement(children)) return null;

  // While leaving, present is already false → play the exit animation.
  const name = present ? enter : exit;
  const child = children as ReactElement<{
    className?: string;
    'data-state'?: string;
    ref?: Ref<HTMLElement>;
  }>;
  const childRef = (child as { ref?: Ref<HTMLElement> }).ref;

  return cloneElement(child, {
    className: cx('lily-animate', `lily-animate--${name}`, child.props.className),
    'data-state': state,
    ref: childRef ? mergeRefs(childRef, ref) : ref,
  });
}
