<script lang="ts">
export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  shortcut?: string;
  keywords?: string[];
}
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue';
import { cx } from '../../utils/cx';

/**
 * CommandPalette — a ⌘K overlay with a search field and a filtered, grouped
 * command list. Control visibility with `v-model:open`.
 *
 * @example
 * ```vue
 * <CommandPalette v-model:open="open" :items="cmds" @select="run" />
 * ```
 */
const props = withDefaults(
  defineProps<{ items: CommandItem[]; placeholder?: string; emptyText?: string; hotkey?: boolean; label?: string }>(),
  { placeholder: 'コマンドを検索…', emptyText: 'No results', hotkey: true },
);
const open = defineModel<boolean>('open', { default: false });
const emit = defineEmits<{ select: [id: string] }>();

const query = ref('');
const active = ref(0);
const inputRef = ref<HTMLInputElement>();
const reactId = useId();
const listId = `${reactId}-list`;

const filtered = computed(() => {
  const q = query.value.toLowerCase();
  return props.items.filter(
    (it) => !q || it.label.toLowerCase().includes(q) || it.keywords?.some((k) => k.toLowerCase().includes(q)),
  );
});
const rows = computed(() => {
  let last: string | undefined;
  return filtered.value.map((it, i) => {
    const header = it.group && it.group !== last ? it.group : null;
    last = it.group;
    return { it, i, header };
  });
});

watch(open, (v) => {
  if (v) {
    query.value = '';
    active.value = 0;
    nextTick(() => inputRef.value?.focus());
  }
});

function globalKey(e: KeyboardEvent): void {
  if (props.hotkey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    open.value = !open.value;
  }
}
onMounted(() => document.addEventListener('keydown', globalKey));
onUnmounted(() => document.removeEventListener('keydown', globalKey));

function choose(it: CommandItem): void {
  emit('select', it.id);
  open.value = false;
}
function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    active.value = Math.min(filtered.value.length - 1, active.value + 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    active.value = Math.max(0, active.value - 1);
  } else if (e.key === 'Enter' && filtered.value[active.value]) {
    e.preventDefault();
    choose(filtered.value[active.value]!);
  } else if (e.key === 'Escape') {
    e.preventDefault();
    open.value = false;
  }
}
</script>

<template>
  <div v-if="open" class="lily-command-palette" @pointerdown="open = false">
    <div
      class="lily-command-palette__dialog"
      role="dialog"
      aria-modal="true"
      :aria-label="label ?? 'Command palette'"
      @pointerdown.stop
    >
      <input
        ref="inputRef"
        class="lily-command-palette__input"
        role="combobox"
        aria-expanded="true"
        :aria-controls="listId"
        aria-autocomplete="list"
        :aria-activedescendant="filtered[active] ? `${listId}-${active}` : undefined"
        :placeholder="placeholder"
        :value="query"
        @input="
          query = ($event.target as HTMLInputElement).value;
          active = 0;
        "
        @keydown="onKeydown"
      />
      <ul :id="listId" class="lily-command-palette__list" role="listbox">
        <li v-if="filtered.length === 0" class="lily-command-palette__empty" role="presentation">{{ emptyText }}</li>
        <template v-for="row in rows" :key="row.it.id">
          <li v-if="row.header" class="lily-command-palette__group" role="presentation">{{ row.header }}</li>
          <li
            :id="`${listId}-${row.i}`"
            :class="cx('lily-command-palette__item', row.i === active && 'lily-command-palette__item--active')"
            role="option"
            :aria-selected="row.i === active"
            @pointerdown.prevent.stop="choose(row.it)"
            @pointerenter="active = row.i"
          >
            <span>{{ row.it.label }}</span>
            <span v-if="row.it.shortcut" class="lily-command-palette__shortcut">{{ row.it.shortcut }}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
