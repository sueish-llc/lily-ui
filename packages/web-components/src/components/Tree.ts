import { LilyElement, h, type BuildResult } from '../base/LilyElement';

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

/**
 * `<lily-tree>` — a hierarchical, keyboard-navigable list (WAI-ARIA tree).
 * Nodes are a JSON `nodes` attribute (`{ id, label, children? }`). Dispatches a
 * `select` event whose `detail` is the selected id.
 *
 * Attributes: `nodes`, `default-expanded` (comma-joined ids), `selected`, `label`.
 */
export class LilyTree extends LilyElement {
  private expanded = new Set<string>();
  private selected: string | null = null;
  private focusedId: string | null = null;
  private initialized = false;
  private refs = new Map<string, HTMLLIElement>();

  static get observedAttributes(): string[] {
    return ['nodes', 'default-expanded', 'selected', 'label'];
  }

  private parse(): TreeNode[] {
    const raw = this.attr('nodes');
    if (!raw) return [];
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? (p as TreeNode[]) : [];
    } catch {
      return [];
    }
  }

  private flatten(nodes: TreeNode[]): FlatNode[] {
    const out: FlatNode[] = [];
    const walk = (list: TreeNode[], level: number, parentId: string | null) => {
      for (const node of list) {
        const hasChildren = !!node.children?.length;
        out.push({ node, level, parentId, hasChildren });
        if (hasChildren && this.expanded.has(node.id)) walk(node.children!, level + 1, node.id);
      }
    };
    walk(nodes, 0, null);
    return out;
  }

  protected build(): BuildResult {
    const nodes = this.parse();
    if (!this.initialized) {
      for (const id of (this.attr('default-expanded') ?? '').split(',').map((s) => s.trim()).filter(Boolean)) {
        this.expanded.add(id);
      }
      this.selected = this.attr('selected') ?? null;
      this.focusedId = nodes[0]?.id ?? null;
      this.initialized = true;
    }
    this.refs.clear();

    const rerender = () => this.rerender();
    const focusId = (id: string) => {
      this.focusedId = id;
      this.refs.get(id)?.focus();
    };

    const onKeydown = (e: KeyboardEvent, node: TreeNode) => {
      const list = this.flatten(nodes);
      const i = list.findIndex((f) => f.node.id === node.id);
      const fn = list[i];
      if (!fn) return;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (i < list.length - 1) focusId(list[i + 1]!.node.id);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (i > 0) focusId(list[i - 1]!.node.id);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (fn.hasChildren && !this.expanded.has(node.id)) {
            this.expanded.add(node.id);
            rerender();
            focusId(node.id);
          } else if (fn.hasChildren) focusId(node.children![0]!.id);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (fn.hasChildren && this.expanded.has(node.id)) {
            this.expanded.delete(node.id);
            rerender();
            focusId(node.id);
          } else if (fn.parentId) focusId(fn.parentId);
          break;
        case 'Home':
          e.preventDefault();
          focusId(list[0]!.node.id);
          break;
        case 'End':
          e.preventDefault();
          focusId(list[list.length - 1]!.node.id);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          this.selected = node.id;
          this.dispatchEvent(new CustomEvent('select', { bubbles: true, detail: node.id }));
          rerender();
          focusId(node.id);
          break;
      }
    };

    const renderList = (list: TreeNode[], level: number): HTMLElement => {
      const ul = h('ul', {
        class: level === 0 ? 'lily-tree' : 'lily-tree__group',
        attrs: { role: level === 0 ? 'tree' : 'group', 'aria-label': level === 0 ? this.attr('label') ?? null : null },
      });
      for (const node of list) {
        const hasChildren = !!node.children?.length;
        const isExpanded = this.expanded.has(node.id);
        const li = h('li', {
          class: 'lily-tree__node',
          attrs: {
            role: 'treeitem',
            'aria-level': level + 1,
            'aria-expanded': hasChildren ? String(isExpanded) : null,
            'aria-selected': String(this.selected === node.id),
            tabindex: this.focusedId === node.id ? 0 : -1,
          },
        }) as HTMLLIElement;
        li.addEventListener('keydown', (e) => onKeydown(e, node));
        li.addEventListener('focus', () => {
          this.focusedId = node.id;
        });

        const label = h('div', { class: 'lily-tree__label' });
        label.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selected = node.id;
          this.dispatchEvent(new CustomEvent('select', { bubbles: true, detail: node.id }));
          if (hasChildren) {
            if (isExpanded) this.expanded.delete(node.id);
            else this.expanded.add(node.id);
          }
          rerender();
        });
        label.appendChild(
          hasChildren
            ? h('span', { class: 'lily-tree__toggle', attrs: { 'aria-hidden': 'true' }, text: '▸' })
            : h('span', { class: 'lily-tree__spacer', attrs: { 'aria-hidden': 'true' } }),
        );
        label.appendChild(h('span', { text: node.label }));
        li.appendChild(label);

        if (hasChildren && isExpanded) li.appendChild(renderList(node.children!, level + 1));
        this.refs.set(node.id, li);
        ul.appendChild(li);
      }
      return ul;
    };

    return { root: renderList(nodes, 0), slot: null };
  }
}
