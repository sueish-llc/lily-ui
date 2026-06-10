import { Fragment, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface CommandItem {
  /** Stable id passed to `onSelect`. */
  id: string;
  /** Visible label. */
  label: string;
  /** Optional group heading. */
  group?: string;
  /** Trailing shortcut hint. */
  shortcut?: string;
  /** Leading icon. */
  icon?: ReactNode;
  /** Extra search terms. */
  keywords?: string[];
}

export interface CommandPaletteProps {
  /** Whether the palette is open. */
  open: boolean;
  /** Called to request open/close (Escape, backdrop, ⌘K). */
  onOpenChange: (open: boolean) => void;
  /** The commands. */
  items: CommandItem[];
  /** Called with the chosen command id (the palette then closes). */
  onSelect: (id: string) => void;
  /** Search field placeholder. @default 'コマンドを検索…' */
  placeholder?: string;
  /** Text when nothing matches. @default 'No results' */
  emptyText?: string;
  /** Register a global ⌘K / Ctrl+K toggle. @default true */
  hotkey?: boolean;
  /** Accessible label for the dialog. @default 'Command palette' */
  'aria-label'?: string;
}

/**
 * CommandPalette — a ⌘K overlay with a search field and a filtered, grouped
 * command list. Type to filter, Up/Down to move, Enter to run, Esc to close.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 * <CommandPalette open={open} onOpenChange={setOpen} items={cmds} onSelect={run} />
 * ```
 */
export function CommandPalette({
  open,
  onOpenChange,
  items,
  onSelect,
  placeholder = 'コマンドを検索…',
  emptyText = 'No results',
  hotkey = true,
  ...rest
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const reactId = useId();
  const listId = `${reactId}-list`;

  // Global ⌘K / Ctrl+K toggle.
  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [hotkey, open, onOpenChange]);

  // Reset + focus on open.
  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  if (!open) return null;

  const q = query.toLowerCase();
  const filtered = items.filter(
    (it) => !q || it.label.toLowerCase().includes(q) || it.keywords?.some((k) => k.toLowerCase().includes(q)),
  );

  const choose = (it: CommandItem) => {
    onSelect(it.id);
    onOpenChange(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(filtered.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter' && filtered[active]) {
      e.preventDefault();
      choose(filtered[active]!);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onOpenChange(false);
    }
  };

  let lastGroup: string | undefined;

  return (
    <div className="lily-command-palette" onPointerDown={() => onOpenChange(false)}>
      <div
        className="lily-command-palette__dialog"
        role="dialog"
        aria-modal="true"
        aria-label={rest['aria-label'] ?? 'Command palette'}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="lily-command-palette__input"
          role="combobox"
          aria-expanded
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={filtered[active] ? `${listId}-${active}` : undefined}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
        />
        <ul className="lily-command-palette__list" id={listId} role="listbox">
          {filtered.length === 0 ? (
            <li className="lily-command-palette__empty" role="presentation">
              {emptyText}
            </li>
          ) : (
            filtered.map((it, i) => {
              const header = it.group && it.group !== lastGroup ? it.group : null;
              lastGroup = it.group;
              return (
                <Fragment key={it.id}>
                  {header && (
                    <li className="lily-command-palette__group" role="presentation">
                      {header}
                    </li>
                  )}
                  <li
                    id={`${listId}-${i}`}
                    className={cx('lily-command-palette__item', i === active && 'lily-command-palette__item--active')}
                    role="option"
                    aria-selected={i === active}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      choose(it);
                    }}
                    onPointerEnter={() => setActive(i)}
                  >
                    {it.icon && <span aria-hidden="true">{it.icon}</span>}
                    <span>{it.label}</span>
                    {it.shortcut && <span className="lily-command-palette__shortcut">{it.shortcut}</span>}
                  </li>
                </Fragment>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
