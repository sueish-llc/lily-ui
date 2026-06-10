<script lang="ts">
export type MeterStatus = 'primary' | 'success' | 'warning' | 'danger' | 'info';
</script>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * Meter — a static scalar measurement within a known range (`role="meter"`).
 * Distinct from Progress (task completion).
 *
 * @example
 * ```vue
 * <Meter label="ストレージ" :value="75" value-text="100GB中75GB" status="warning" show-value />
 * ```
 */
const props = withDefaults(
  defineProps<{
    value: number;
    min?: number;
    max?: number;
    label?: string;
    status?: MeterStatus;
    valueText?: string;
    showValue?: boolean;
  }>(),
  { min: 0, max: 100, status: 'primary', showValue: false },
);

const pct = computed(() => Math.max(0, Math.min(100, ((props.value - props.min) / (props.max - props.min)) * 100)));
</script>

<template>
  <div class="lily-meter">
    <div v-if="label != null || showValue" class="lily-meter__header">
      <span v-if="label != null">{{ label }}</span>
      <span v-else />
      <span v-if="showValue" class="lily-meter__value">{{ valueText ?? value }}</span>
    </div>
    <div
      class="lily-meter__track"
      role="meter"
      :aria-valuenow="value"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuetext="valueText"
      :aria-label="label"
    >
      <div
        class="lily-meter__fill"
        :data-status="status !== 'primary' ? status : undefined"
        :style="{ width: `${pct}%` }"
      />
    </div>
  </div>
</template>
