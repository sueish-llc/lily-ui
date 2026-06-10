<script lang="ts">
import type { Weekday } from '../DatePicker/DatePicker.vue';

/** A `[start, end]` date range (either side may be `null`). */
export type DateRange = [Temporal.PlainDate | null, Temporal.PlainDate | null];
export type { Weekday };
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';
import DatePicker from '../DatePicker/DatePicker.vue';
import type { PlainDateInput } from '../../utils/datetime';

/**
 * DateRangePicker — pick a start and end date with two coordinated DatePickers.
 * The start field caps the end's minimum and vice-versa. Bind with `v-model`.
 *
 * @example
 * ```vue
 * <DateRangePicker v-model="range" start-label="開始日" end-label="終了日" />
 * ```
 */
withDefaults(
  defineProps<{
    min?: PlainDateInput;
    max?: PlainDateInput;
    locale?: Intl.LocalesArgument;
    weekStartsOn?: Weekday;
    disabled?: boolean;
    startLabel?: string;
    endLabel?: string;
    separator?: string;
  }>(),
  { weekStartsOn: 1, disabled: false, startLabel: 'Start date', endLabel: 'End date', separator: '–' },
);

const model = defineModel<DateRange>({ default: () => [null, null] });
const start = computed(() => model.value[0]);
const end = computed(() => model.value[1]);

function setStart(d: Temporal.PlainDate | null): void {
  model.value = [d, end.value];
}
function setEnd(d: Temporal.PlainDate | null): void {
  model.value = [start.value, d];
}
</script>

<template>
  <div :class="cx('lily-date-range-picker')">
    <DatePicker
      :model-value="start"
      :max="end ?? max"
      :min="min"
      :locale="locale"
      :week-starts-on="weekStartsOn"
      :disabled="disabled"
      :input-props="{ 'aria-label': startLabel }"
      @update:model-value="setStart"
    />
    <span class="lily-date-range-picker__sep" aria-hidden="true">{{ separator }}</span>
    <DatePicker
      :model-value="end"
      :min="start ?? min"
      :max="max"
      :locale="locale"
      :week-starts-on="weekStartsOn"
      :disabled="disabled"
      :input-props="{ 'aria-label': endLabel }"
      @update:model-value="setEnd"
    />
  </div>
</template>
