<script lang="ts">
import type { Weekday } from '../DatePicker/DatePicker.vue';
export type { Weekday };
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { cx } from '../../utils/cx';
import { getDateTimeFormat, today, toPlainDate, toUtcDate, type PlainDateInput } from '../../utils/datetime';

/**
 * Calendar — an inline month grid for date selection. Bind with `v-model`.
 *
 * @example
 * ```vue
 * <Calendar v-model="date" locale="ja-JP" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    min?: PlainDateInput;
    max?: PlainDateInput;
    isDateDisabled?: (d: Temporal.PlainDate) => boolean;
    locale?: Intl.LocalesArgument;
    weekStartsOn?: Weekday;
    label?: string;
  }>(),
  { weekStartsOn: 1 },
);

const model = defineModel<Temporal.PlainDate | null>({ default: null });
const view = ref((model.value ?? today()).with({ day: 1 }));

// An unparsable bound is treated as "no bound" rather than throwing during render.
const toBound = (input: PlainDateInput | undefined): Temporal.PlainDate | undefined => {
  if (input == null) return undefined;
  try {
    return toPlainDate(input);
  } catch {
    return undefined;
  }
};
const minD = computed(() => toBound(props.min));
const maxD = computed(() => toBound(props.max));
const fmt = (d: Temporal.PlainDate, opts: Intl.DateTimeFormatOptions) =>
  getDateTimeFormat(props.locale, { timeZone: 'UTC', ...opts }).format(toUtcDate(d.year, d.month, d.day));

const gridStart = computed(() => view.value.subtract({ days: (view.value.dayOfWeek - props.weekStartsOn + 7) % 7 }));
const days = computed(() => Array.from({ length: 42 }, (_, i) => gridStart.value.add({ days: i })));
const weekdays = computed(() => Array.from({ length: 7 }, (_, i) => fmt(gridStart.value.add({ days: i }), { weekday: 'short' })));

function disabled(d: Temporal.PlainDate): boolean {
  return (
    (!!minD.value && Temporal.PlainDate.compare(d, minD.value) < 0) ||
    (!!maxD.value && Temporal.PlainDate.compare(d, maxD.value) > 0) ||
    (props.isDateDisabled?.(d) ?? false)
  );
}
function select(d: Temporal.PlainDate): void {
  model.value = d;
  if (d.month !== view.value.month) view.value = d.with({ day: 1 });
}
function isToday(d: Temporal.PlainDate): boolean {
  return d.equals(today());
}
</script>

<template>
  <div :class="cx('lily-calendar')">
    <div class="lily-calendar__header">
      <button type="button" class="lily-calendar__nav" aria-label="前の月" @click="view = view.subtract({ months: 1 })">
        <span aria-hidden="true">‹</span>
      </button>
      <span class="lily-calendar__title" aria-live="polite">{{ fmt(view, { year: 'numeric', month: 'long' }) }}</span>
      <button type="button" class="lily-calendar__nav" aria-label="次の月" @click="view = view.add({ months: 1 })">
        <span aria-hidden="true">›</span>
      </button>
    </div>
    <div class="lily-calendar__grid" role="group" :aria-label="label ?? 'Calendar'">
      <span v-for="(wd, i) in weekdays" :key="i" class="lily-calendar__weekday" aria-hidden="true">{{ wd }}</span>
      <button
        v-for="d in days"
        :key="d.toString()"
        type="button"
        :class="cx('lily-calendar__day', d.month !== view.month && 'lily-calendar__day--outside', isToday(d) && 'lily-calendar__day--today')"
        :aria-pressed="model != null && d.equals(model)"
        :aria-label="fmt(d, { year: 'numeric', month: 'long', day: 'numeric' })"
        :disabled="disabled(d)"
        @click="select(d)"
      >
        {{ d.day }}
      </button>
    </div>
  </div>
</template>
