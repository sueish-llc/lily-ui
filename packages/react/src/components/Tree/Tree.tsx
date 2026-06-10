import { forwardRef, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../hooks';

export interface TreeNode {
  /** Stable id. */
  id: string;
  /** Visible label. */
  label: ReactNode;
  /** Child nodes (makes this a branch). */
  children?: TreeNode[];
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  /** Root nodes. */
  nodes: TreeNode[];
  /** Controlled expanded ids. */
  expanded?: string[];
  /** Initial expanded ids when uncontrolled. @default [] */
  defaultExpanded?: string[];
  /** Called with the expanded ids. */
  onExpandedChange?: (ids: string[]) => void;
  /** Controlled selected id. */
  selected?: string | null;
  /** Initial selected id when uncontrolled. @default null */
  defaultSelected?: string | null;
  /** Called with the selected id. */
  onSelect?: (id: string) => void;
  /** Accessible label for the tree. */
  'aria-label'?: string;
}

interface FlatNode {
  node: TreeNode;
  level: number;
  parentId: string | null;
  hasChildren: boolean;
}

/**
 * Tree — a hierarchical, keyboard-navigable list (WAI-ARIA tree). Branches
 * expand/collapse; arrow keys move/expand/collapse, Enter/Space selects.
 *
 * @example
 * ```tsx
 * <Tree aria-label="ファイル" nodes={tree} defaultExpanded={['src']} onSelect={open} />
 * ```
 */
export const Tree = forwardRef<HTMLUListElement, TreeProps>(function Tree(
  { nodes, expanded: expandedProp, defaultExpanded = [], onExpandedChange, selected: selectedProp, defaultSelected = null, onSelect, className, ...rest },
  ref,
) {
  const [expanded, setExpanded] = useControllableState<string[]>({
    value: expandedProp,
    defaultValue: defaultExpanded,
    onChange: onExpandedChange,
  });
  const [selected, setSelected] = useControllableState<string | null>({
    value: selectedProp,
    defaultValue: defaultSelected,
    onChange: (v) => v != null && onSelect?.(v),
  });
  const [focusedId, setFocusedId] = useState<string | null>(nodes[0]?.id ?? null);
  const refs = useRef<Record<string, HTMLLIElement | null>>({});
  const expandedSet = new Set(expanded);

  const toggle = (id: string) =>
    setExpanded(expandedSet.has(id) ? expanded.filter((x) => x !== id) : [...expanded, id]);

  // Flatten the currently-visible nodes for linear keyboard navigation.
  const flat: FlatNode[] = [];
  const walk = (list: TreeNode[], level: number, parentId: string | null) => {
    for (const node of list) {
      const hasChildren = !!node.children?.length;
      flat.push({ node, level, parentId, hasChildren });
      if (hasChildren && expandedSet.has(node.id)) walk(node.children!, level + 1, node.id);
    }
  };
  walk(nodes, 0, null);

  const focus = (id: string) => {
    setFocusedId(id);
    refs.current[id]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLLIElement>, fn: FlatNode) => {
    const i = flat.findIndex((f) => f.node.id === fn.node.id);
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (i < flat.length - 1) focus(flat[i + 1]!.node.id);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (i > 0) focus(flat[i - 1]!.node.id);
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (fn.hasChildren && !expandedSet.has(fn.node.id)) toggle(fn.node.id);
        else if (fn.hasChildren) focus(fn.node.children![0]!.id);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (fn.hasChildren && expandedSet.has(fn.node.id)) toggle(fn.node.id);
        else if (fn.parentId) focus(fn.parentId);
        break;
      case 'Home':
        e.preventDefault();
        focus(flat[0]!.node.id);
        break;
      case 'End':
        e.preventDefault();
        focus(flat[flat.length - 1]!.node.id);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        setSelected(fn.node.id);
        break;
    }
  };

  const renderList = (list: TreeNode[], level: number): ReactNode => (
    <ul
      role={level === 0 ? 'tree' : 'group'}
      className={level === 0 ? cx('lily-tree', className) : 'lily-tree__group'}
      aria-label={level === 0 ? rest['aria-label'] : undefined}
      ref={level === 0 ? ref : undefined}
      {...(level === 0 ? rest : {})}
    >
      {list.map((node) => {
        const hasChildren = !!node.children?.length;
        const isExpanded = expandedSet.has(node.id);
        const fn: FlatNode = { node, level, parentId: null, hasChildren };
        return (
          <li
            key={node.id}
            ref={(el) => {
              refs.current[node.id] = el;
            }}
            className="lily-tree__node"
            role="treeitem"
            aria-level={level + 1}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-selected={selected === node.id}
            tabIndex={focusedId === node.id ? 0 : -1}
            onKeyDown={(e) => onKeyDown(e, { ...fn, parentId: flat.find((f) => f.node.id === node.id)?.parentId ?? null })}
            onFocus={() => setFocusedId(node.id)}
            onClick={(e) => {
              e.stopPropagation();
              setSelected(node.id);
              if (hasChildren) toggle(node.id);
            }}
          >
            <div className="lily-tree__label">
              {hasChildren ? (
                <span className="lily-tree__toggle" aria-hidden="true">
                  ▸
                </span>
              ) : (
                <span className="lily-tree__spacer" aria-hidden="true" />
              )}
              <span>{node.label}</span>
            </div>
            {hasChildren && isExpanded && renderList(node.children!, level + 1)}
          </li>
        );
      })}
    </ul>
  );

  return renderList(nodes, 0);
});
