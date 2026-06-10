<script lang="ts">
export interface SegmentedOption {
  value: string;
  label: string;
  disabled?: boolean;
}
</script>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { cx } from '../../utils/cx';

/**
 * SegmentedControl — a single-select toggle group built on native radios.
 * Bind the value with `v-model`; provide `label` for the group's accessible name.
 *
 * @example
 * ```vue
 * <SegmentedControl
 *   label="表示"
 *   v-model="view"
 *   :options="[{ value: 'list', label: 'リスト' }, { value: 'grid', label: 'グリッド' }]"
 * />
 * ```
 */
const props = withDefaults(
  defineProps<{
    options: SegmentedOption[];
    name?: string;
    size?: 'sm' | 'md' | 'lg';
    block?: boolean;
    label?: string;
  }>(),
  { size: 'md', block: false },
);

const model = defineModel<string>();
const autoName = useId();
const name = computed(() => props.name ?? autoName);
const active = computed(() => model.value ?? props.options[0]?.value ?? '');
const classes = computed(() =>
  cx('lily-segmented', props.size !== 'md' && `lily-segmented--${props.size}`, props.block && 'lily-segmented--block'),
);
</script>

<template>
  <div :class="classes" role="radiogroup" :aria-label="label">
    <label v-for="opt in options" :key="opt.value" class="lily-segmented__option">
      <input
        type="radio"
        class="lily-visually-hidden"
        :name="name"
        :value="opt.value"
        :checked="active === opt.value"
        :disabled="opt.disabled"
        @change="model = opt.value"
      />
      <span>{{ opt.label }}</span>
    </label>
  </div>
</template>
