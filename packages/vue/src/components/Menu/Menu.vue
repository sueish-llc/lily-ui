<script lang="ts">
export interface MenuItemDef {
  label?: string;
  value?: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  divider?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Menu — a standalone command menu (WAI-ARIA menu) with roving tabindex and
 * arrow-key navigation. Has no trigger; drop it into a popover or context menu.
 *
 * @example
 * ```vue
 * <Menu label="操作" :items="[{ label: '編集', value: 'edit' }]" @select="run" />
 * ```
 */
const props = defineProps<{ items: MenuItemDef[]; label?: string }>();
const emit = defineEmits<{ select: [value: string | undefined, index: number] }>();

const itemRefs = ref<HTMLButtonElement[]>([]);
function setItem(i: number, el: unknown): void {
  if (el) itemRefs.value[i] = el as HTMLButtonElement;
}

const enabled = computed(() =>
  props.items.map((it, i) => (!it.divider && !it.disabled ? i : -1)).filter((i) => i >= 0),
);
const focused = ref(-1);
const current = computed(() => (focused.value >= 0 ? focused.value : enabled.value[0] ?? -1));

function move(to: number): void {
  focused.value = to;
  itemRefs.value[to]?.focus();
}
function onKeydown(e: KeyboardEvent, index: number): void {
  const list = enabled.value;
  const pos = list.indexOf(index);
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    move(list[(pos + 1) % list.length]!);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    move(list[(pos - 1 + list.length) % list.length]!);
  } else if (e.key === 'Home') {
    e.preventDefault();
    move(list[0]!);
  } else if (e.key === 'End') {
    e.preventDefault();
    move(list[list.length - 1]!);
  }
}
</script>

<template>
  <div :class="cx('lily-menu')" role="menu" :aria-label="label">
    <template v-for="(item, i) in items" :key="i">
      <div v-if="item.divider" class="lily-menu__divider" role="separator" />
      <button
        v-else
        :ref="(el) => setItem(i, el)"
        type="button"
        class="lily-menu__item"
        role="menuitem"
        :tabindex="i === current ? 0 : -1"
        :aria-disabled="item.disabled || undefined"
        :disabled="item.disabled"
        @click="emit('select', item.value, i)"
        @keydown="onKeydown($event, i)"
        @focus="focused = i"
      >
        <span v-if="item.icon" class="lily-menu__icon" aria-hidden="true">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
        <span v-if="item.shortcut" class="lily-menu__shortcut">{{ item.shortcut }}</span>
      </button>
    </template>
  </div>
</template>
