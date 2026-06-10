<script lang="ts">
export type { TreeNode } from './TreeBranch.vue';
</script>

<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import TreeBranch, { TreeKey, type TreeNode } from './TreeBranch.vue';

/**
 * Tree — a hierarchical, keyboard-navigable list (WAI-ARIA tree). Branches
 * expand/collapse; arrow keys move/expand/collapse, Enter/Space selects.
 *
 * @example
 * ```vue
 * <Tree label="ファイル" :nodes="tree" :default-expanded="['src']" @select="open" />
 * ```
 */
const props = withDefaults(
  defineProps<{ nodes: TreeNode[]; defaultExpanded?: string[]; defaultSelected?: string | null; label?: string }>(),
  { defaultExpanded: () => [], defaultSelected: null },
);
const emit = defineEmits<{ select: [id: string]; 'expanded-change': [ids: string[]] }>();

const expanded = ref<string[]>([...props.defaultExpanded]);
const selected = ref<string | null>(props.defaultSelected);
const focusedId = ref<string | null>(props.nodes[0]?.id ?? null);
const refs = new Map<string, HTMLElement>();
const expandedSet = computed(() => new Set(expanded.value));

interface FlatNode {
  node: TreeNode;
  level: number;
  parentId: string | null;
  hasChildren: boolean;
}
const flat = computed<FlatNode[]>(() => {
  const out: FlatNode[] = [];
  const walk = (list: TreeNode[], level: number, parentId: string | null) => {
    for (const node of list) {
      const hasChildren = !!node.children?.length;
      out.push({ node, level, parentId, hasChildren });
      if (hasChildren && expandedSet.value.has(node.id)) walk(node.children!, level + 1, node.id);
    }
  };
  walk(props.nodes, 0, null);
  return out;
});

function toggle(id: string): void {
  expanded.value = expandedSet.value.has(id) ? expanded.value.filter((x) => x !== id) : [...expanded.value, id];
  emit('expanded-change', [...expanded.value]);
}
function select(id: string): void {
  selected.value = id;
  emit('select', id);
}
function focusId(id: string): void {
  focusedId.value = id;
  refs.get(id)?.focus();
}
function setFocused(id: string): void {
  focusedId.value = id;
}
function register(id: string, el: HTMLElement | null): void {
  if (el) refs.set(id, el);
  else refs.delete(id);
}
function onKeydown(e: KeyboardEvent, node: TreeNode): void {
  const list = flat.value;
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
      if (fn.hasChildren && !expandedSet.value.has(node.id)) toggle(node.id);
      else if (fn.hasChildren) focusId(node.children![0]!.id);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      if (fn.hasChildren && expandedSet.value.has(node.id)) toggle(node.id);
      else if (fn.parentId) focusId(fn.parentId);
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
      select(node.id);
      break;
  }
}

provide(TreeKey, {
  expandedSet: () => expandedSet.value,
  selected: () => selected.value,
  focusedId: () => focusedId.value,
  label: props.label,
  toggle,
  select,
  setFocused,
  onKeydown,
  register,
});
</script>

<template>
  <TreeBranch :nodes="nodes" :level="0" />
</template>
