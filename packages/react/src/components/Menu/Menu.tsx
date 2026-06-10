import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface MenuItemDef {
  /** Visible label. */
  label?: ReactNode;
  /** Value passed to `onSelect`. */
  value?: string;
  /** Leading icon. */
  icon?: ReactNode;
  /** Trailing shortcut hint. */
  shortcut?: ReactNode;
  /** Disable this item. */
  disabled?: boolean;
  /** Render a separator instead of an item. */
  divider?: boolean;
}

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Menu entries (items and dividers). */
  items: MenuItemDef[];
  /** Called when an item is activated. */
  onSelect?: (value: string | undefined, index: number) => void;
  /** Accessible label for the menu. */
  'aria-label'?: string;
}

/**
 * Menu — a standalone command menu (WAI-ARIA menu) with roving tabindex and
 * arrow-key navigation. Unlike Dropdown, it has no trigger — drop it into a
 * popover or context menu.
 *
 * @example
 * ```tsx
 * <Menu aria-label="操作" items={[{ label: '編集', value: 'edit' }, { divider: true }, { label: '削除', value: 'delete' }]} onSelect={run} />
 * ```
 */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { items, onSelect, className, ...rest },
  ref,
) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = items.map((it, i) => (!it.divider && !it.disabled ? i : -1)).filter((i) => i >= 0);
  const [focused, setFocused] = useState(enabled[0] ?? -1);

  const move = (to: number) => {
    setFocused(to);
    itemRefs.current[to]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const pos = enabled.indexOf(index);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(enabled[(pos + 1) % enabled.length]!);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(enabled[(pos - 1 + enabled.length) % enabled.length]!);
    } else if (e.key === 'Home') {
      e.preventDefault();
      move(enabled[0]!);
    } else if (e.key === 'End') {
      e.preventDefault();
      move(enabled[enabled.length - 1]!);
    }
  };

  return (
    <div ref={ref} className={cx('lily-menu', className)} role="menu" {...rest}>
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} className="lily-menu__divider" role="separator" />
        ) : (
          <button
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            type="button"
            className="lily-menu__item"
            role="menuitem"
            tabIndex={i === focused ? 0 : -1}
            aria-disabled={item.disabled || undefined}
            disabled={item.disabled}
            onClick={() => onSelect?.(item.value, i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            onFocus={() => setFocused(i)}
          >
            {item.icon && (
              <span className="lily-menu__icon" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
            {item.shortcut && <span className="lily-menu__shortcut">{item.shortcut}</span>}
          </button>
        ),
      )}
    </div>
  );
});
