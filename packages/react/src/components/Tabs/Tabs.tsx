import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

export interface TabItem {
  /** Stable id for the tab. */
  id: string;
  /** Tab label. */
  label: ReactNode;
  /** Panel content. */
  content: ReactNode;
  /** Disable this tab. */
  disabled?: boolean;
}

export interface TabsProps {
  /** Tabs to render. */
  items: TabItem[];
  /** Visual style. @default 'tabs' */
  variant?: 'tabs' | 'pills';
  /** Controlled active tab id. */
  value?: string;
  /** Initial active tab id (uncontrolled). Defaults to the first tab. */
  defaultValue?: string;
  /** Called when the active tab changes. */
  onChange?: (id: string) => void;
  /** Accessible label for the tablist. */
  label?: string;
  className?: string;
}

const CLASS = 'lily-nav';

/**
 * Tabs — an accessible tabbed interface (WAI-ARIA tabs pattern).
 *
 * Arrow keys move between tabs (roving focus); Home/End jump to first/last.
 * Each panel is associated with its tab via `aria-labelledby`/`aria-controls`.
 *
 * @example
 * ```tsx
 * <Tabs label="Settings" items={[{ id: 'a', label: 'A', content: '…' }]} />
 * ```
 */
export function Tabs({
  items,
  variant = 'tabs',
  value,
  defaultValue,
  onChange,
  label,
  className,
}: TabsProps) {
  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [active, setActive] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? items[0]?.id ?? '',
    onChange,
  });

  const enabled = items.filter((t) => !t.disabled);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentId: string) => {
    const idx = enabled.findIndex((t) => t.id === currentId);
    if (idx === -1) return;
    let nextIdx: number | null = null;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIdx = (idx + 1) % enabled.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIdx = (idx - 1 + enabled.length) % enabled.length;
        break;
      case 'Home':
        nextIdx = 0;
        break;
      case 'End':
        nextIdx = enabled.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    const next = enabled[nextIdx];
    if (next) {
      setActive(next.id);
      tabRefs.current[next.id]?.focus();
    }
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className={cx(CLASS, `${CLASS}--${variant}`)}>
        {items.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-${tab.id}-tab`}
              className={`${CLASS}__link`}
              aria-selected={selected}
              aria-controls={`${baseId}-${tab.id}-panel`}
              aria-disabled={tab.disabled || undefined}
              tabIndex={selected ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && setActive(tab.id)}
              onKeyDown={(e) => onKeyDown(e, tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {items.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-${tab.id}-panel`}
          aria-labelledby={`${baseId}-${tab.id}-tab`}
          className="lily-tab-panel"
          hidden={tab.id !== active}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
