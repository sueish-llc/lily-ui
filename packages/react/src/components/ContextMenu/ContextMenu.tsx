import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState, useDismiss } from '../../hooks';

export interface ContextMenuProps {
  /** The trigger area; right-clicking (or Shift+F10) within it opens the menu. */
  children: ReactNode;
  /** Menu items (use `ContextMenu.Item` / `ContextMenu.Divider`). */
  menu: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const CLASS = 'lily-context-menu';

const ITEM_SELECTOR = `.${CLASS}__item:not([aria-disabled="true"])`;

/**
 * ContextMenu — a menu that opens at the pointer on right-click over its trigger
 * area, and via the keyboard (Shift+F10 or the ContextMenu key).
 *
 * The menu uses `role="menu"` with `role="menuitem"` children and the same
 * roving-focus key model as Menu/Dropdown (Arrow keys, Home/End, Enter to
 * activate, Escape to close). Reuses the dropdown item markup.
 *
 * @example
 * ```tsx
 * <ContextMenu
 *   menu={
 *     <>
 *       <ContextMenu.Item onSelect={cut}>切り取り</ContextMenu.Item>
 *       <ContextMenu.Divider />
 *       <ContextMenu.Item onSelect={remove}>削除</ContextMenu.Item>
 *     </>
 *   }
 * >
 *   <div>右クリックで操作</div>
 * </ContextMenu>
 * ```
 */
export function ContextMenu({
  children,
  menu,
  open,
  defaultOpen = false,
  onOpenChange,
  className,
}: ContextMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useDismiss(rootRef, isOpen, () => setOpen(false));

  const items = useCallback(
    () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []),
    [],
  );

  const openAt = (x: number, y: number) => {
    setPos({ x, y });
    setOpen(true);
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openAt(e.clientX, e.clientY);
  };

  // Keyboard entry: Shift+F10 / ContextMenu key opens at the trigger's corner.
  const onTriggerKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      openAt(rect.left, rect.bottom);
    }
  };

  // When open, move focus to the first item so roving focus + Arrow keys work.
  useEffect(() => {
    if (isOpen) items()[0]?.focus();
  }, [isOpen, items]);

  const onMenuKeyDown = (e: ReactKeyboardEvent) => {
    const list = items();
    if (list.length === 0) return;
    const active = (typeof document !== 'undefined' ? document.activeElement : null) as
      | HTMLElement
      | null;
    const current = active ? list.indexOf(active) : -1;
    const focusAt = (i: number) => list[(i + list.length) % list.length]?.focus();

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusAt(current + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusAt(current - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusAt(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusAt(list.length - 1);
    } else if (e.key === 'Tab') {
      // Menus are not part of the page tab sequence.
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cx(CLASS, className)}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- contextmenu surface; the children carry the real semantics, keyboard opens via Shift+F10 */}
      <div
        className={`${CLASS}__trigger`}
        onContextMenu={onContextMenu}
        onKeyDown={onTriggerKeyDown}
      >
        {children}
      </div>
      <div
        ref={menuRef}
        role="menu"
        tabIndex={-1}
        className={cx(
          `${CLASS}__menu`,
          'lily-animate',
          'lily-animate--fade-in',
          'lily-animate--snappy',
        )}
        hidden={!isOpen}
        style={{ position: 'fixed', left: pos.x, top: pos.y }}
        onKeyDown={onMenuKeyDown}
        onClick={() => setOpen(false)}
      >
        {menu}
      </div>
    </div>
  );
}

export interface ContextMenuItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  /** Called when the item is activated (click or Enter/Space). */
  onSelect?: () => void;
  children: ReactNode;
}

function ContextMenuItem({
  className,
  children,
  onSelect,
  onClick,
  disabled,
  ...rest
}: ContextMenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      className={cx(`${CLASS}__item`, className)}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={(e) => {
        onSelect?.();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

function ContextMenuDivider() {
  return <div className={`${CLASS}__divider`} role="separator" />;
}

ContextMenuItem.displayName = 'ContextMenu.Item';
ContextMenuDivider.displayName = 'ContextMenu.Divider';

ContextMenu.Item = ContextMenuItem;
ContextMenu.Divider = ContextMenuDivider;
