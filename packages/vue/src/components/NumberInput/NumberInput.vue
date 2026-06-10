<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * NumberInput — a numeric field with stepper buttons. Bind with `v-model`
 * (value is `null` when empty). The native input keeps spinbutton semantics.
 *
 * @example
 * ```vue
 * <NumberInput v-model="qty" :min="0" :max="99" aria-label="数量" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    id?: string;
    ariaLabel?: string;
    decrementLabel?: string;
    incrementLabel?: string;
  }>(),
  { step: 1, size: 'md', disabled: false, decrementLabel: 'Decrease', incrementLabel: 'Increase' },
);

const model = defineModel<number | null>({ default: null });

function clamp(n: number): number {
  if (props.min != null && n < props.min) return props.min;
  if (props.max != null && n > props.max) return props.max;
  return n;
}

const base = computed(() => model.value ?? props.min ?? 0);
const atMin = computed(() => props.min != null && model.value != null && model.value <= props.min);
const atMax = computed(() => props.max != null && model.value != null && model.value >= props.max);
const classes = computed(() => cx('lily-number-input', props.size !== 'md' && `lily-number-input--${props.size}`));

function onInput(e: Event): void {
  const raw = (e.target as HTMLInputElement).value;
  model.value = raw === '' ? null : clamp(Number(raw));
}
</script>

<template>
  <div :class="classes">
    <button
      type="button"
      class="lily-number-input__btn"
      :aria-label="decrementLabel"
      :disabled="disabled || atMin"
      @click="model = clamp(base - step)"
    >
      <span aria-hidden="true">−</span>
    </button>
    <input
      :id="id"
      type="number"
      class="lily-number-input__field"
      inputmode="decimal"
      :aria-label="ariaLabel"
      :value="model ?? ''"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      @input="onInput"
    />
    <button
      type="button"
      class="lily-number-input__btn"
      :aria-label="incrementLabel"
      :disabled="disabled || atMax"
      @click="model = clamp(base + step)"
    >
      <span aria-hidden="true">+</span>
    </button>
  </div>
</template>
