import { useId, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

export interface AccordionItem {
  /** Stable key for the item. */
  id: string;
  /** Header text shown in the trigger. */
  header: ReactNode;
  /** Panel content. */
  content: ReactNode;
  /** Disable this item. */
  disabled?: boolean;
}

export interface AccordionProps {
  /** The items to render. */
  items: AccordionItem[];
  /** Allow multiple panels open at once. @default false */
  multiple?: boolean;
  /** Controlled set of open item ids. */
  open?: string[];
  /** Initial open item ids (uncontrolled). @default [] */
  defaultOpen?: string[];
  /** Called when the open set changes. */
  onOpenChange?: (open: string[]) => void;
  className?: string;
}

const CLASS = 'lily-accordion';

/**
 * Accordion — vertically stacked, collapsible sections.
 *
 * Follows the WAI-ARIA accordion pattern: each header is a `<button>` with
 * `aria-expanded` + `aria-controls`, and each panel is a region labeled by its
 * header.
 *
 * @example
 * ```tsx
 * <Accordion items={[{ id: 'a', header: 'A', content: '…' }]} />
 * ```
 */
export function Accordion({
  items,
  multiple = false,
  open,
  defaultOpen = [],
  onOpenChange,
  className,
}: AccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useControllableState<string[]>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const toggle = (id: string) => {
    const isOpen = openIds.includes(id);
    if (multiple) {
      setOpenIds(isOpen ? openIds.filter((x) => x !== id) : [...openIds, id]);
    } else {
      setOpenIds(isOpen ? [] : [id]);
    }
  };

  return (
    <div className={cx(CLASS, className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div className={`${CLASS}__item`} key={item.id}>
            <h3 className={`${CLASS}__header`}>
              <button
                type="button"
                id={triggerId}
                className={`${CLASS}__trigger`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
              >
                <span>{item.header}</span>
                <span className={`${CLASS}__trigger__icon`} aria-hidden="true">
                  &#9662;
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={`${CLASS}__panel`}
              hidden={!isOpen}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
