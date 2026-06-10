<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId } from 'vue';
import { cx } from '../../utils/cx';
import Tree from '../Tree/Tree.vue';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

/**
 * TreeSelect — a trigger button that opens a tree panel for node selection.
 * Mirrors the Dropdown key model (Escape closes) combined with the Tree
 * navigation (Arrow keys, Home/End, Enter/Space selects).
 *
 * @example
 * ```vue
 * <TreeSelect :nodes="categories" placeholder="カテゴリを選択" aria-label="カテゴリ" @change="setCategory" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    nodes: TreeNode[];
    modelValue?: string | null;
    placeholder?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    multiple?: boolean;
    ariaLabel?: string;
  }>(),
  { disabled: false, size: 'md', multiple: false },
);

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
  change: [value: string | null];
}>();

const reactId = useId();
const popupId = `${reactId}-popup`;

const isOpen = ref(false);
const internalValue = ref<string | null>(props.modelValue ?? null);

const selected = computed(() => (props.modelValue !== undefined ? props.modelValue : internalValue.value));

function findLabel(nodes: TreeNode[], id: string): string | undefined {
  for (const n of nodes) {
    if (n.id === id) return n.label;
    if (n.children) {
      const found = findLabel(n.children, id);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

const displayLabel = computed(() => (selected.value ? (findLabel(props.nodes, selected.value) ?? selected.value) : null));

function handleSelect(id: string) {
  internalValue.value = id;
  emit('update:modelValue', id);
  emit('change', id);
  if (!props.multiple) isOpen.value = false;
}

function onTriggerKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    if (!props.disabled) isOpen.value = true;
  } else if (e.key === 'Escape') {
    isOpen.value = false;
  }
}

function onPanelKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation();
    isOpen.value = false;
  }
}

function handleTriggerClick() {
  if (!props.disabled) isOpen.value = !isOpen.value;
}

// Close on outside click
const rootEl = ref<HTMLElement | null>(null);
function onDocumentPointerDown(e: PointerEvent) {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
}
onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown, true));
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown, true));
</script>

<template>
  <div ref="rootEl" :class="cx('lily-tree-select')">
    <button
      type="button"
      :class="cx(
        'lily-tree-select__trigger',
        size !== 'md' && `lily-tree-select__trigger--${size}`,
        disabled && 'lily-tree-select__trigger--disabled',
      )"
      aria-haspopup="tree"
      :aria-expanded="isOpen"
      :aria-controls="popupId"
      :aria-label="ariaLabel"
      :disabled="disabled"
      @keydown="onTriggerKeyDown"
      @click="handleTriggerClick"
    >
      <span :class="cx('lily-tree-select__value', !displayLabel && 'lily-tree-select__value--placeholder')">
        {{ displayLabel ?? placeholder ?? '' }}
      </span>
      <svg
        class="lily-tree-select__chevron"
        viewBox="0 0 16 16"
        width="1em"
        height="1em"
        fill="none"
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div
      :id="popupId"
      role="dialog"
      :aria-label="ariaLabel"
      :class="cx('lily-tree-select__panel', 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy')"
      :hidden="!isOpen"
      @keydown="onPanelKeyDown"
    >
      <Tree
        :nodes="nodes"
        :default-selected="selected"
        :label="ariaLabel"
        class="lily-tree-select__tree"
        @select="handleSelect"
      />
    </div>
  </div>
</template>
