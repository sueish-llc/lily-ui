<script lang="ts">
import type { InjectionKey } from 'vue';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeCtx {
  expandedSet: () => Set<string>;
  selected: () => string | null;
  focusedId: () => string | null;
  label?: string;
  toggle: (id: string) => void;
  select: (id: string) => void;
  setFocused: (id: string) => void;
  onKeydown: (e: KeyboardEvent, node: TreeNode) => void;
  register: (id: string, el: HTMLElement | null) => void;
}

export const TreeKey: InjectionKey<TreeCtx> = Symbol('lily-tree');
</script>

<script setup lang="ts">
import { inject } from 'vue';
import { cx } from '../../utils/cx';

/** Recursive branch renderer for {@link Tree}; not exported on the public API. */
defineProps<{ nodes: TreeNode[]; level: number }>();
const ctx = inject(TreeKey)!;
</script>

<template>
  <ul
    :role="level === 0 ? 'tree' : 'group'"
    :class="level === 0 ? cx('lily-tree') : 'lily-tree__group'"
    :aria-label="level === 0 ? ctx.label : undefined"
  >
    <li
      v-for="node in nodes"
      :key="node.id"
      :ref="(el) => ctx.register(node.id, (el as HTMLElement | null))"
      class="lily-tree__node"
      role="treeitem"
      :aria-level="level + 1"
      :aria-expanded="node.children && node.children.length ? ctx.expandedSet().has(node.id) : undefined"
      :aria-selected="ctx.selected() === node.id"
      :tabindex="ctx.focusedId() === node.id ? 0 : -1"
      @keydown="ctx.onKeydown($event, node)"
      @focus="ctx.setFocused(node.id)"
    >
      <div
        class="lily-tree__label"
        @click.stop="
          ctx.select(node.id);
          node.children && node.children.length && ctx.toggle(node.id);
        "
      >
        <span v-if="node.children && node.children.length" class="lily-tree__toggle" aria-hidden="true">▸</span>
        <span v-else class="lily-tree__spacer" aria-hidden="true" />
        <span>{{ node.label }}</span>
      </div>
      <TreeBranch
        v-if="node.children && node.children.length && ctx.expandedSet().has(node.id)"
        :nodes="node.children"
        :level="level + 1"
      />
    </li>
  </ul>
</template>
