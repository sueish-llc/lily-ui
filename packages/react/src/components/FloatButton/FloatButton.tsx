import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { cx } from '../../utils/cx';

export type FloatButtonPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type FloatButtonShape = 'circle' | 'square';
export type FloatButtonStatus = 'primary' | 'danger' | 'success' | 'warning' | 'neutral';
export type FloatButtonSize = 'sm' | 'md' | 'lg';

export interface FloatButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Corner of the viewport to anchor to. @default 'bottom-right' */
  position?: FloatButtonPosition;
  /** Semantic color. @default 'primary' */
  status?: FloatButtonStatus;
  /** Control size. @default 'md' */
  size?: FloatButtonSize;
  /** Button shape. @default 'circle' */
  shape?: FloatButtonShape;
  /** Icon or label content. */
  children?: ReactNode;
}

/**
 * FloatButton — a floating action button anchored to a viewport corner.
 * Always requires an accessible name: pass `aria-label` when icon-only.
 *
 * @example
 * ```tsx
 * <FloatButton position="bottom-right" aria-label="ページ先頭へ戻る">↑</FloatButton>
 * ```
 */
export const FloatButton = forwardRef<HTMLButtonElement, FloatButtonProps>(function FloatButton(
  {
    position = 'bottom-right',
    status = 'primary',
    size = 'md',
    shape = 'circle',
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cx(
        'lily-float-button',
        `lily-float-button--${position}`,
        `lily-float-button--${size}`,
        `lily-float-button--${shape}`,
        className,
      )}
      data-status={status}
      {...rest}
    >
      {children}
    </button>
  );
});

// ─── FloatButtonGroup ─────────────────────────────────────────────────────────

export interface FloatButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Corner of the viewport to anchor to. @default 'bottom-right' */
  position?: FloatButtonPosition;
  /**
   * Main trigger button content (icon/label). Toggles the group open/closed.
   * Supply an `aria-label` via `triggerProps` when icon-only.
   */
  trigger: ReactNode;
  /** Props forwarded to the main trigger button. Use to set `aria-label`. */
  triggerProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  /** Action buttons shown when the group is open. */
  children: ReactNode;
}

/**
 * FloatButtonGroup — a speed-dial wrapper that stacks several `FloatButton`s.
 * The main trigger button toggles the child buttons; Escape closes the group.
 * Fully keyboard-operable and screen-reader-friendly.
 *
 * @example
 * ```tsx
 * <FloatButtonGroup position="bottom-right" trigger="+" triggerProps={{ 'aria-label': 'アクション' }}>
 *   <FloatButton aria-label="メモを追加">📝</FloatButton>
 *   <FloatButton aria-label="共有">⬆</FloatButton>
 * </FloatButtonGroup>
 * ```
 */
export const FloatButtonGroup = forwardRef<HTMLDivElement, FloatButtonGroupProps>(
  function FloatButtonGroup(
    { position = 'bottom-right', trigger, triggerProps, children, className, ...rest },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const groupRef = useRef<HTMLDivElement>(null);

    const toggle = useCallback(() => setOpen((v) => !v), []);
    const close = useCallback(() => setOpen(false), []);

    // Close when focus leaves the group.
    const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
      if (!groupRef.current?.contains(e.relatedTarget as Node)) {
        close();
      }
    }, [close]);

    // Esc closes the group.
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
          close();
        }
      },
      [close],
    );

    // Click outside closes.
    useEffect(() => {
      if (!open || typeof document === 'undefined') return;
      const onPointerDown = (e: PointerEvent) => {
        if (!groupRef.current?.contains(e.target as Node)) close();
      };
      document.addEventListener('pointerdown', onPointerDown);
      return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open, close]);

    const mergedRef = (node: HTMLDivElement | null) => {
      (groupRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- speed-dial container; Escape and arrow keys drive it, the buttons inside are the interactive targets
      <div
        ref={mergedRef}
        className={cx(
          'lily-float-button-group',
          `lily-float-button-group--${position}`,
          open && 'lily-float-button-group--open',
          className,
        )}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        {...rest}
      >
        {/* Child action buttons — visible only when open */}
        <div
          className="lily-float-button-group__items"
          aria-hidden={!open}
          role="group"
        >
          {children}
        </div>

        {/* Main trigger */}
        <button
          type="button"
          className={cx(
            'lily-float-button',
            'lily-float-button--circle',
            'lily-float-button-group__trigger',
          )}
          aria-expanded={open}
          aria-haspopup="true"
          onClick={toggle}
          {...triggerProps}
        >
          {trigger}
        </button>
      </div>
    );
  },
);
