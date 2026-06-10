<script lang="ts">
// no type exports needed for ContextMenu
</script>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { cx } from '../../utils/cx';
import { useDismiss } from '../../composables/interactions';

/**
 * ContextMenu — a menu that opens at the pointer on right-click over its trigger
 * area, and from the keyboard (Shift+F10 or the ContextMenu key).
 *
 * The menu uses `role="menu"` with `role="menuitem"` children (use
 * `ContextMenuItem` / `ContextMenuDivider`) and the standard roving-focus key
 * model (Arrow keys, Home/End, Enter to activate, Escape to close). The trigger
 * area is the default slot; the menu items go in the `#menu` slot. Bind open
 * state with `v-model:open`.
 *
 * @example
 * ```vue
 * <ContextMenu>
 *   <div>右クリックで操作</div>
 *   <template #menu>
 *     <ContextMenuItem @select="remove">削除</ContextMenuItem>
 *   </template>
 * </ContextMenu>
 * ```
 */
const open = defineModel<boolean>('open', { default: false });

const rootRef = ref<HTMLDivElement | null>(null);
const menuRef = ref<HTMLDivElement | null>(null);
const x = ref(0);
const y = ref(0);
const CLASS = 'lily-context-menu';
const ITEM_SELECTOR = `.${CLASS}__item:not([aria-disabled="true"])`;

function items(): HTMLElement[] {
  return Array.from(menuRef.value?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);
}

function openAt(px: number, py: number): void {
  x.value = px;
  y.value = py;
  open.value = true;
}

function onContextMenu(e: MouseEvent): void {
  e.preventDefault();
  openAt(e.clientX, e.clientY);
}

function onTriggerKeydown(e: KeyboardEvent): void {
  if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    openAt(rect.left, rect.bottom);
  }
}

function onMenuKeydown(e: KeyboardEvent): void {
  const list = items();
  if (list.length === 0) return;
  const active = (typeof document !== 'undefined' ? document.activeElement : null) as HTMLElement | null;
  const current = active ? list.indexOf(active) : -1;
  const focusAt = (i: number) => list[(i + list.length) % list.length]?.focus();

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    focusAt(current + 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    focusAt(current - 1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    focusAt(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    focusAt(list.length - 1);
  } else if (e.key === 'Tab') {
    e.preventDefault();
    open.value = false;
  }
}

// Move focus to the first item when the menu opens so roving focus works.
watch(open, (v) => {
  if (v) nextTick(() => items()[0]?.focus());
});

useDismiss(rootRef, open, () => (open.value = false));
</script>

<template>
  <div ref="rootRef" :class="cx(CLASS)">
    <div :class="`${CLASS}__trigger`" @contextmenu="onContextMenu" @keydown="onTriggerKeydown">
      <slot />
    </div>
    <div
      ref="menuRef"
      role="menu"
      :class="cx(`${CLASS}__menu`, 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy')"
      :hidden="!open"
      :style="{ position: 'fixed', left: `${x}px`, top: `${y}px` }"
      @keydown="onMenuKeydown"
      @click="open = false"
    >
      <slot name="menu" />
    </div>
  </div>
</template>
