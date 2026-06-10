import {
  forwardRef,
  useId,
  useRef,
  useState,
  type AriaAttributes,
  type KeyboardEvent,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState, useDismiss } from '../../hooks';
import { useFieldControl } from '../FormField';
import { Tree } from '../Tree/Tree';
import type { TreeNode } from '../Tree/Tree';

export type { TreeNode } from '../Tree/Tree';

export interface TreeSelectProps {
  /** Tree data. */
  nodes: TreeNode[];
  /** Controlled selected node id(s). */
  value?: string | string[] | null;
  /** Initial selection when uncontrolled. @default null (single) / [] (multiple) */
  defaultValue?: string | string[] | null;
  /** Called with the selected id or id array. */
  onChange?: (value: string | null) => void;
  /** Allow selecting multiple nodes. @default false */
  multiple?: boolean;
  /** Placeholder shown when nothing is selected. */
  placeholder?: string;
  /** Disable the trigger. @default false */
  disabled?: boolean;
  /** Control size. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label (when not inside a FormField). */
  'aria-label'?: string;
  id?: string;
  className?: string;
}

const CLASS = 'lily-tree-select';

/** Flatten a tree to all leaf+branch ids for label lookup. */
function findLabel(nodes: TreeNode[], id: string): string | undefined {
  for (const n of nodes) {
    if (n.id === id) return typeof n.label === 'string' ? n.label : id;
    if (n.children) {
      const found = findLabel(n.children, id);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

const ChevronIcon = () => (
  <svg
    className={`${CLASS}__chevron`}
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    fill="none"
    aria-hidden="true"
  >
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * TreeSelect — a trigger button that opens a tree-structured panel for node
 * selection. Mirrors the Dropdown key model (Escape closes, Enter/Space selects)
 * combined with the Tree navigation (Arrow keys, Home/End).
 *
 * @example
 * ```tsx
 * <TreeSelect
 *   aria-label="カテゴリ"
 *   nodes={categories}
 *   placeholder="選択してください"
 *   onChange={setCategory}
 * />
 * ```
 */
export const TreeSelect = forwardRef<HTMLButtonElement, TreeSelectProps>(function TreeSelect(
  {
    nodes,
    value: valueProp,
    defaultValue = null,
    onChange,
    multiple = false,
    placeholder,
    disabled = false,
    size = 'md',
    id,
    className,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const popupId = `${reactId}-popup`;
  const rootRef = useRef<HTMLDivElement>(null);

  const fieldProps = useFieldControl<{
    id?: string;
    'aria-label'?: AriaAttributes['aria-label'];
    'aria-describedby'?: string;
    'aria-invalid'?: AriaAttributes['aria-invalid'];
    required?: boolean;
  }>({ id, 'aria-label': rest['aria-label'] });

  const triggerId = fieldProps.id ?? `${reactId}-trigger`;

  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useControllableState<string | null>({
    value: Array.isArray(valueProp) ? (valueProp[0] ?? null) : (valueProp ?? undefined),
    defaultValue: Array.isArray(defaultValue) ? (defaultValue[0] ?? null) : (defaultValue as string | null),
    onChange: onChange as (v: string | null) => void,
  });

  useDismiss(rootRef, open, () => setOpen(false));

  const displayLabel = selected ? (findLabel(nodes, selected) ?? selected) : null;

  const handleSelect = (id: string) => {
    setSelected(id);
    if (!multiple) setOpen(false);
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setOpen(true);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
    }
    // Arrow/Enter/Space/Home/End are handled by the inner Tree component.
  };

  return (
    <div
      ref={rootRef}
      className={cx(CLASS, className)}
    >
      <button
        ref={ref}
        id={triggerId}
        type="button"
        className={cx(`${CLASS}__trigger`, size !== 'md' && `${CLASS}__trigger--${size}`, disabled && `${CLASS}__trigger--disabled`)}
        aria-haspopup="tree"
        aria-expanded={open}
        aria-controls={popupId}
        aria-label={rest['aria-label'] ?? fieldProps['aria-label']}
        aria-describedby={fieldProps['aria-describedby']}
        disabled={disabled}
        onKeyDown={onTriggerKeyDown}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span className={cx(`${CLASS}__value`, !displayLabel && `${CLASS}__value--placeholder`)}>
          {displayLabel ?? placeholder ?? ''}
        </span>
        <ChevronIcon />
      </button>

      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- dialog panel forwards Escape/arrow keys to the inner Tree */}
      <div
        id={popupId}
        role="dialog"
        aria-label={rest['aria-label'] ?? fieldProps['aria-label']}
        className={cx(`${CLASS}__panel`, 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy')}
        hidden={!open}
        onKeyDown={onPanelKeyDown}
      >
        <Tree
          nodes={nodes}
          selected={selected}
          onSelect={handleSelect}
          aria-label={rest['aria-label'] ?? fieldProps['aria-label']}
          className={`${CLASS}__tree`}
        />
      </div>
    </div>
  );
});
