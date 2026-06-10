<script lang="ts">
export type StatTrend = 'up' | 'down' | 'neutral';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Stat — a KPI tile (label, value, optional trend delta). The delta pairs an
 * arrow with a status color and visually-hidden text, so the trend is not
 * conveyed by color alone.
 *
 * @example
 * ```vue
 * <Stat label="売上" value="¥1.2M" delta="+12%" trend="up" help="前月比" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    delta?: string;
    trend?: StatTrend;
    help?: string;
    trendLabels?: { up: string; down: string };
  }>(),
  { trend: 'neutral', trendLabels: () => ({ up: 'increase', down: 'decrease' }) },
);

const arrow = computed(() => (props.trend === 'up' ? '▲' : props.trend === 'down' ? '▼' : ''));
</script>

<template>
  <div class="lily-stat">
    <span class="lily-stat__label">{{ label }}</span>
    <span class="lily-stat__value">{{ value }}</span>
    <span v-if="delta != null" :class="cx('lily-stat__delta', trend !== 'neutral' && `lily-stat__delta--${trend}`)">
      <span v-if="arrow" aria-hidden="true" class="lily-stat__arrow">{{ arrow }}</span>
      <span v-if="trend !== 'neutral'" class="lily-visually-hidden"
        >{{ trend === 'up' ? trendLabels.up : trendLabels.down }}: </span
      >
      {{ delta }}
    </span>
    <span v-if="help != null" class="lily-stat__help">{{ help }}</span>
  </div>
</template>
