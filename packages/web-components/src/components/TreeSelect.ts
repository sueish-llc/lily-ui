import { LilyElement, h, uid, type BuildResult } from '../base/LilyElement';
import { listenDismiss } from '../base/interactions';

const CLASS = 'lily-tree-select';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface FlatNode {
  node: TreeNode;
  level: number;
  parentId: string | null;
  hasChildren: boolean;
}

function findLabel(nodes: TreeNode[], id: string): string | undefined {
  for (const n of nodes) {
    if (n.id === id) return n.label;
    if (n.children) {
      const r = findLabel(n.children, id);
      if (r !== undefined) return r;
    }
  }
  return undefined;
}

/**
 * `<lily-tree-select>` — a trigger button that opens a tree-structured panel
 * for node selection. Mirrors the Dropdown key model (Escape closes, Arrow
 * opens) combined with the Tree navigation.
 *
 * Attributes: `nodes` (JSON), `value`, `placeholder`, `disabled` (boolean),
 * `size` (`sm`|`md`|`lg`), `multiple` (boolean), `label` (aria-label).
 *
 * Dispatches a `change` CustomEvent whose `detail` is the selected node id.
 *
 * @example
 * ```html
 * <lily-tree-select
 *   label="Category"
 *   placeholder="Select a category"
 *   nodes='[{"id":"a","label":"A","children":[{"id":"a1","label":"A1"}]}]'
 * ></lily-tree-select>
 * ```
 */
export class LilyTreeSelect extends LilyElement {
  private isOpen = false;
  private selected: string | null = null;
  private treeExpanded = new Set<string>();
  private treeFocusedId: string | null = null;
  private treeRefs = new Map<string, HTMLLIElement>();
  private dismissCleanup: (() => void) | null = null;
  private popupId: string;

  constructor() {
    super();
    this.popupId = uid('lily-tree-select-popup');
  }

  static get observedAttributes(): string[] {
    return ['nodes', 'value', 'placeholder', 'disabled', 'size', 'multiple', 'label'];
  }

  private parseNodes(): TreeNode[] {
    const raw = this.attr('nodes');
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? (p as TreeNode[]) : [];
    } catch {
      return [];
    }
  }

  private flattenVisible(nodes: TreeNode[]): FlatNode[] {
    const out: FlatNode[] = [];
    const walk = (list: TreeNode[], level: number, parentId: string | null) => {
      for (const node of list) {
        const hasChildren = !!node.children?.length;
        out.push({ node, level, parentId, hasChildren });
        if (hasChildren && this.treeExpanded.has(node.id)) walk(node.children!, level + 1, node.id);
      }
    };
    walk(nodes, 0, null);
    return out;
  }

  private setOpen(next: boolean): void {
    this.isOpen = next;
    this.dismissCleanup?.();
    this.dismissCleanup = null;
    this.rerender();
  }

  private selectNode(id: string): void {
    this.selected = id;
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: id }));
    if (!this.boolAttr('multiple')) this.setOpen(false);
    else this.rerender();
  }

  disconnectedCallback(): void {
    this.dismissCleanup?.();
    this.dismissCleanup = null;
  }

  protected build(): BuildResult {
    const nodes = this.parseNodes();
    const disabled = this.boolAttr('disabled');
    const size = this.attr('size', 'md');
    const placeholder = this.attr('placeholder', '');
    const label = this.attr('label');

    if (this.treeFocusedId === null && nodes.length > 0) {
      this.treeFocusedId = nodes[0]!.id;
    }

    const root = h('div', { class: CLASS });

    // --- Trigger button ---
    const displayLabel = this.selected ? (findLabel(nodes, this.selected) ?? this.selected) : null;
    const triggerClasses = this.cx(
      `${CLASS}__trigger`,
      size !== 'md' && `${CLASS}__trigger--${size}`,
      disabled && `${CLASS}__trigger--disabled`,
    );
    const trigger = h('button', {
      class: triggerClasses,
      attrs: {
        type: 'button',
        'aria-haspopup': 'tree',
        'aria-expanded': this.isOpen ? 'true' : 'false',
        'aria-controls': this.popupId,
        ...(label ? { 'aria-label': label } : {}),
        ...(disabled ? { disabled: '' } : {}),
      },
    });

    const valueSpan = h('span', {
      class: this.cx(`${CLASS}__value`, !displayLabel && `${CLASS}__value--placeholder`),
      text: displayLabel ?? placeholder ?? '',
    });
    trigger.appendChild(valueSpan);

    // Chevron — built via DOM (no innerHTML)
    const ns = 'http://www.w3.org/2000/svg';
    const chevronSvg = document.createElementNS(ns, 'svg') as unknown as SVGSVGElement;
    chevronSvg.setAttribute('class', `${CLASS}__chevron`);
    chevronSvg.setAttribute('viewBox', '0 0 16 16');
    chevronSvg.setAttribute('width', '1em');
    chevronSvg.setAttribute('height', '1em');
    chevronSvg.setAttribute('fill', 'none');
    chevronSvg.setAttribute('aria-hidden', 'true');
    const chevronPath = document.createElementNS(ns, 'path');
    chevronPath.setAttribute('d', 'M4 6l4 4 4-4');
    chevronPath.setAttribute('stroke', 'currentColor');
    chevronPath.setAttribute('stroke-width', '1.5');
    chevronPath.setAttribute('stroke-linecap', 'round');
    chevronPath.setAttribute('stroke-linejoin', 'round');
    chevronSvg.appendChild(chevronPath);
    trigger.appendChild(chevronSvg as unknown as HTMLElement);

    trigger.addEventListener('click', () => {
      if (!this.boolAttr('disabled')) this.setOpen(!this.isOpen);
    });
    trigger.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!this.boolAttr('disabled')) this.setOpen(true);
      } else if (e.key === 'Escape') {
        this.setOpen(false);
      }
    });
    root.appendChild(trigger);

    // --- Panel ---
    const panel = h('div', {
      class: this.cx(
        `${CLASS}__panel`,
        'lily-animate',
        'lily-animate--fade-in',
        'lily-animate--snappy',
      ),
      attrs: {
        id: this.popupId,
        role: 'dialog',
        ...(label ? { 'aria-label': label } : {}),
        ...(this.isOpen ? {} : { hidden: '' }),
      },
    });

    panel.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        this.setOpen(false);
      }
    });

    // --- Embedded tree ---
    this.treeRefs.clear();
    const flat = this.flattenVisible(nodes);

    const renderList = (list: TreeNode[], level: number): HTMLElement => {
      const ul = h('ul', {
        class: level === 0 ? this.cx('lily-tree', `${CLASS}__tree`) : 'lily-tree__group',
        attrs: {
          role: level === 0 ? 'tree' : 'group',
          ...(level === 0 && label ? { 'aria-label': label } : {}),
        },
      });

      for (const node of list) {
        const hasChildren = !!node.children?.length;
        const isExpanded = this.treeExpanded.has(node.id);

        const li = h('li', {
          class: 'lily-tree__node',
          attrs: {
            role: 'treeitem',
            'aria-level': level + 1,
            ...(hasChildren ? { 'aria-expanded': String(isExpanded) } : {}),
            'aria-selected': String(this.selected === node.id),
            tabindex: this.treeFocusedId === node.id ? 0 : -1,
          },
        }) as HTMLLIElement;

        li.addEventListener('focus', () => { this.treeFocusedId = node.id; });

        li.addEventListener('keydown', (e: KeyboardEvent) => {
          const i = flat.findIndex((f) => f.node.id === node.id);
          const fn = flat[i];
          if (!fn) return;
          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault();
              if (i < flat.length - 1) {
                this.treeFocusedId = flat[i + 1]!.node.id;
                this.treeRefs.get(flat[i + 1]!.node.id)?.focus();
              }
              break;
            case 'ArrowUp':
              e.preventDefault();
              if (i > 0) {
                this.treeFocusedId = flat[i - 1]!.node.id;
                this.treeRefs.get(flat[i - 1]!.node.id)?.focus();
              }
              break;
            case 'ArrowRight':
              e.preventDefault();
              if (fn.hasChildren && !this.treeExpanded.has(node.id)) {
                this.treeExpanded.add(node.id);
                // Refocus the freshly built node after the rerender (Tree's
                // `rerender(); focusId(...)` pattern) — the old li is detached.
                this.rerender();
                this.treeFocusedId = node.id;
                this.treeRefs.get(node.id)?.focus();
              } else if (fn.hasChildren && node.children?.[0]) {
                this.treeFocusedId = node.children[0].id;
                this.treeRefs.get(node.children[0].id)?.focus();
              }
              break;
            case 'ArrowLeft':
              e.preventDefault();
              if (fn.hasChildren && this.treeExpanded.has(node.id)) {
                this.treeExpanded.delete(node.id);
                this.rerender();
                this.treeFocusedId = node.id;
                this.treeRefs.get(node.id)?.focus();
              } else if (fn.parentId) {
                this.treeFocusedId = fn.parentId;
                this.treeRefs.get(fn.parentId)?.focus();
              }
              break;
            case 'Home':
              e.preventDefault();
              if (flat[0]) { this.treeFocusedId = flat[0].node.id; this.treeRefs.get(flat[0].node.id)?.focus(); }
              break;
            case 'End':
              e.preventDefault();
              if (flat[flat.length - 1]) {
                this.treeFocusedId = flat[flat.length - 1]!.node.id;
                this.treeRefs.get(flat[flat.length - 1]!.node.id)?.focus();
              }
              break;
            case 'Enter':
            case ' ':
              e.preventDefault();
              this.selectNode(node.id);
              break;
          }
        });

        const labelDiv = h('div', { class: 'lily-tree__label' });
        labelDiv.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectNode(node.id);
          if (hasChildren) {
            if (isExpanded) this.treeExpanded.delete(node.id);
            else this.treeExpanded.add(node.id);
            this.rerender();
          }
        });

        labelDiv.appendChild(
          hasChildren
            ? h('span', { class: 'lily-tree__toggle', attrs: { 'aria-hidden': 'true' }, text: '▸' })
            : h('span', { class: 'lily-tree__spacer', attrs: { 'aria-hidden': 'true' } }),
        );
        labelDiv.appendChild(h('span', { text: node.label }));
        li.appendChild(labelDiv);

        if (hasChildren && isExpanded) li.appendChild(renderList(node.children!, level + 1));

        this.treeRefs.set(node.id, li);
        ul.appendChild(li);
      }
      return ul;
    };

    if (nodes.length > 0) panel.appendChild(renderList(nodes, 0));
    root.appendChild(panel);

    // Wire dismiss after DOM is in place.
    if (this.isOpen) {
      this.dismissCleanup = listenDismiss(root, () => this.setOpen(false));
    }

    return { root, slot: null };
  }
}
