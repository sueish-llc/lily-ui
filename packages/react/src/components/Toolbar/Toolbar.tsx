import { forwardRef, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { mergeRefs } from '../../utils/mergeRefs';

export interface ToolbarProps {
  /** Layout direction; maps to `aria-orientation`. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Accessible label for the toolbar (`aria-label`). */
  'aria-label': string;
  /** Toolbar items: buttons, toggles, or other controls. */
  children: ReactNode;
  className?: string;
}

const CLASS = 'lily-toolbar';

/**
 * Toolbar — a single-tab-stop group of controls with a roving tabindex.
 *
 * Implements `role="toolbar"` with the WAI-ARIA toolbar keyboard model:
 * Arrow keys move focus between items, Home/End jump to the first/last.
 * Only one item is in the tab sequence at a time (roving tabindex), so the
 * toolbar as a whole consumes a single Tab stop.
 *
 * Place `<Button>`, toggle buttons, or any interactive element as direct
 * children. Disabled children are skipped during arrow-key navigation.
 *
 * @example
 * ```tsx
 * <Toolbar aria-label="Text formatting">
 *   <Button variant="ghost" size="sm">Bold</Button>
 *   <Button variant="ghost" size="sm">Italic</Button>
 *   <Button variant="ghost" size="sm">Underline</Button>
 * </Toolbar>
 * ```
 */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { orientation = 'horizontal', 'aria-label': ariaLabel, children, className, ...rest },
  ref,
) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  const getFocusableItems = (): HTMLElement[] => {
    const node = toolbarRef.current;
    if (!node) return [];
    return Array.from(
      node.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [role="button"]:not([aria-disabled="true"]), [tabindex]:not([tabindex="-1"]):not([disabled])',
      ),
    ).filter((el) => el.closest('[role="toolbar"]') === node);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = getFocusableItems();
    if (items.length === 0) return;

    const currentIdx = items.findIndex((el) => el === document.activeElement);
    const isHorizontal = orientation === 'horizontal';

    let nextIdx: number | null = null;

    switch (e.key) {
      case isHorizontal ? 'ArrowRight' : 'ArrowDown':
        nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % items.length;
        break;
      case isHorizontal ? 'ArrowLeft' : 'ArrowUp':
        nextIdx =
          currentIdx === -1
            ? items.length - 1
            : (currentIdx - 1 + items.length) % items.length;
        break;
      // Accept both axes so toolbar items work when orientation is changed.
      case isHorizontal ? 'ArrowDown' : 'ArrowRight':
        nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % items.length;
        break;
      case isHorizontal ? 'ArrowUp' : 'ArrowLeft':
        nextIdx =
          currentIdx === -1
            ? items.length - 1
            : (currentIdx - 1 + items.length) % items.length;
        break;
      case 'Home':
        nextIdx = 0;
        break;
      case 'End':
        nextIdx = items.length - 1;
        break;
      default:
        return;
    }

    if (nextIdx !== null) {
      e.preventDefault();
      const next = items[nextIdx];
      if (next) {
        // Update roving tabindex: remove from current, add to next.
        items.forEach((el) => el.setAttribute('tabindex', '-1'));
        next.setAttribute('tabindex', '0');
        next.focus();
      }
    }
  };

  // Set initial roving tabindex: first item gets 0, rest get -1.
  // We do this via onFocus delegation so it works for dynamically added children.
  const onFocus = () => {
    const items = getFocusableItems();
    if (items.length === 0) return;
    const hasTabStop = items.some((el) => el.getAttribute('tabindex') === '0');
    if (!hasTabStop) {
      items.forEach((el, i) => el.setAttribute('tabindex', i === 0 ? '0' : '-1'));
    }
  };

  return (
    <div
      ref={mergeRefs(toolbarRef, ref)}
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={cx(CLASS, orientation === 'vertical' && `${CLASS}--vertical`, className)}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      {...rest}
    >
      {children}
    </div>
  );
});
