<script lang="ts">
export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import { cx } from '../../utils/cx';
import { useDismiss } from '../../composables/interactions';

/**
 * Combobox — a text field with a filtered listbox popup (WAI-ARIA combobox).
 * Type to filter; Down/Up move the active option, Enter selects, Escape closes.
 * Bind the value with `v-model`.
 *
 * @example
 * ```vue
 * <Combobox v-model="country" :options="countries" label="国" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    options: ComboboxOption[];
    placeholder?: string;
    disabled?: boolean;
    emptyText?: string;
    size?: 'sm' | 'md' | 'lg';
    filter?: (option: ComboboxOption, query: string) => boolean;
    label?: string;
    id?: string;
    name?: string;
  }>(),
  {
    emptyText: 'No matches',
    size: 'md',
    filter: (o: ComboboxOption, q: string) => o.label.toLowerCase().includes(q.toLowerCase()),
  },
);

const model = defineModel<string | null>({ default: null });
const reactId = useId();
const listboxId = `${reactId}-listbox`;
const inputId = computed(() => props.id ?? `${reactId}-input`);
const selected = computed(() => props.options.find((o) => o.value === model.value) ?? null);
const query = ref(selected.value?.label ?? '');
const open = ref(false);
const activeIdx = ref(0);
const rootRef = ref<HTMLElement | null>(null);

useDismiss(rootRef, open, () => (open.value = false));

const matches = computed(() =>
  query.value === (selected.value?.label ?? '') && !open.value
    ? props.options
    : props.options.filter((o) => props.filter(o, query.value)),
);

function choose(opt: ComboboxOption): void {
  if (opt.disabled) return;
  model.value = opt.value;
  query.value = opt.label;
  open.value = false;
}
function onInput(e: Event): void {
  query.value = (e.target as HTMLInputElement).value;
  open.value = true;
  activeIdx.value = 0;
}
function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (!open.value) open.value = true;
    activeIdx.value = Math.min(matches.value.length - 1, activeIdx.value + 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIdx.value = Math.max(0, activeIdx.value - 1);
  } else if (e.key === 'Enter' && open.value && matches.value[activeIdx.value]) {
    e.preventDefault();
    choose(matches.value[activeIdx.value]!);
  } else if (e.key === 'Escape') {
    open.value = false;
  }
}
</script>

<template>
  <div ref="rootRef" :class="cx('lily-combobox')">
    <input
      :id="inputId"
      :name="name"
      :class="cx('lily-input', size !== 'md' && `lily-input--${size}`)"
      role="combobox"
      :aria-expanded="open"
      :aria-controls="listboxId"
      aria-autocomplete="list"
      :aria-activedescendant="open && matches[activeIdx] ? `${listboxId}-${activeIdx}` : undefined"
      :aria-label="label"
      autocomplete="off"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="query"
      @input="onInput"
      @focus="open = true"
      @keydown="onKeydown"
    />
    <ul :id="listboxId" class="lily-combobox__listbox" role="listbox" :hidden="!open">
      <li v-if="matches.length === 0" class="lily-combobox__empty" role="presentation">{{ emptyText }}</li>
      <template v-else>
        <li
          v-for="(opt, i) in matches"
          :id="`${listboxId}-${i}`"
          :key="opt.value"
          :class="cx('lily-combobox__option', i === activeIdx && 'lily-combobox__option--active')"
          role="option"
          :aria-selected="opt.value === model"
          :aria-disabled="opt.disabled || undefined"
          @pointerdown.prevent="choose(opt)"
          @pointerenter="activeIdx = i"
        >
          {{ opt.label }}
        </li>
      </template>
    </ul>
  </div>
</template>
