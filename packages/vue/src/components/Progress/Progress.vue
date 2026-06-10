<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

const CLASS = 'lily-progress';

/**
 * Progress — a determinate progress bar.
 *
 * Exposes `role="progressbar"` with `aria-valuenow/min/max` for screen readers.
 * Binds `--lily-progress-value` on the inner bar so CSS can animate the fill.
 *
 * @example
 * ```vue
 * <Progress :value="60" label="Upload progress" show-label />
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Current value. */
    value?: number;
    /** Minimum value. */
    min?: number;
    /** Maximum value. */
    max?: number;
    /** Striped fill. */
    striped?: boolean;
    /** Show the percentage as a label inside the bar. */
    showLabel?: boolean;
    /** Accessible label for the progress bar. */
    label?: string;
  }>(),
  {
    value: 0,
    min: 0,
    max: 100,
    striped: false,
    showLabel: false,
  },
);

const clamped = computed(() => Math.min(props.max, Math.max(props.min, props.value)));
const percent = computed(() =>
  props.max === props.min
    ? 0
    : Math.round(((clamped.value - props.min) / (props.max - props.min)) * 100),
);

const rootClass = computed(() => cx(CLASS, props.striped && `${CLASS}--striped`));
</script>

<template>
  <div
    :class="rootClass"
    role="progressbar"
    :aria-valuenow="clamped"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-label="label"
  >
    <div
      :class="`${CLASS}__bar`"
      :style="{ '--lily-progress-value': percent }"
    >
      <template v-if="showLabel">{{ percent }}%</template>
    </div>
  </div>
</template>
