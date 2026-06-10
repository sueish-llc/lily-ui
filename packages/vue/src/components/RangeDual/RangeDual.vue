<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * RangeDual — a two-thumb range slider for selecting a span. Each thumb is a
 * native range input (keyboard support built in); the thumbs cannot cross.
 * Bind the `[low, high]` tuple with `v-model`.
 *
 * @example
 * ```vue
 * <RangeDual v-model="price" :min="0" :max="1000" :step="10" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    minLabel?: string;
    maxLabel?: string;
    id?: string;
  }>(),
  { min: 0, max: 100, step: 1, disabled: false, minLabel: 'Minimum', maxLabel: 'Maximum' },
);

const model = defineModel<[number, number]>();
const lo = computed(() => model.value?.[0] ?? props.min);
const hi = computed(() => model.value?.[1] ?? props.max);
const pct = (v: number) => ((v - props.min) / (props.max - props.min)) * 100;
const style = computed<Record<string, string>>(() => ({
  '--lily-range-min': `${pct(lo.value)}%`,
  '--lily-range-max': `${pct(hi.value)}%`,
}));

function setLow(e: Event): void {
  const v = Number((e.target as HTMLInputElement).value);
  model.value = [Math.min(v, hi.value), hi.value];
}
function setHigh(e: Event): void {
  const v = Number((e.target as HTMLInputElement).value);
  model.value = [lo.value, Math.max(v, lo.value)];
}
</script>

<template>
  <div :class="cx('lily-range-dual')" :style="style">
    <span class="lily-range-dual__track" aria-hidden="true" />
    <span class="lily-range-dual__fill" aria-hidden="true" />
    <input
      :id="id"
      class="lily-range-dual__input"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="lo"
      :disabled="disabled"
      :aria-label="minLabel"
      @input="setLow"
    />
    <input
      class="lily-range-dual__input"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="hi"
      :disabled="disabled"
      :aria-label="maxLabel"
      @input="setHigh"
    />
  </div>
</template>
