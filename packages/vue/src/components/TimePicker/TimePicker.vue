<script lang="ts">
const pad2 = (n: number) => String(n).padStart(2, '0');
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * TimePicker — pick a time from hour/minute (and optional AM/PM) native selects.
 * The value is a **`Temporal.PlainTime`** (this library models all date/time
 * with the Temporal API). Bind with `v-model`.
 *
 * @example
 * ```vue
 * <TimePicker v-model="time" :minute-step="15" />
 * <TimePicker v-model="time" hour12 />
 * ```
 */
const props = withDefaults(
  defineProps<{
    minuteStep?: number;
    hour12?: boolean;
    disabled?: boolean;
    hourLabel?: string;
    minuteLabel?: string;
    meridiemLabel?: string;
    id?: string;
  }>(),
  { minuteStep: 5, hour12: false, disabled: false, hourLabel: 'Hour', minuteLabel: 'Minute', meridiemLabel: 'AM/PM' },
);

const model = defineModel<Temporal.PlainTime | null>({ default: null });

const h = computed(() => (model.value ? model.value.hour : null));
const m = computed(() => (model.value ? model.value.minute : null));
const minutes = computed(() => Array.from({ length: Math.ceil(60 / props.minuteStep) }, (_, i) => i * props.minuteStep));
const meridiem = computed(() => (h.value == null ? '' : h.value < 12 ? 'AM' : 'PM'));
const dispHours = computed(() =>
  props.hour12 ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : Array.from({ length: 24 }, (_, i) => i),
);
const dispHour = computed<number | ''>(() =>
  h.value == null ? '' : props.hour12 ? (h.value % 12 === 0 ? 12 : h.value % 12) : h.value,
);

function compose(nextH: number | null, nextM: number | null, nextMer: string): void {
  if (nextH == null && nextM == null) {
    model.value = null;
    return;
  }
  let h24 = nextH ?? 0;
  if (props.hour12) {
    h24 = (nextH ?? 12) % 12;
    if (nextMer === 'PM') h24 += 12;
  }
  model.value = Temporal.PlainTime.from({ hour: h24, minute: nextM ?? 0 });
}

function onHour(e: Event): void {
  const v = (e.target as HTMLSelectElement).value;
  compose(v === '' ? null : Number(v), m.value, meridiem.value);
}
function onMinute(e: Event): void {
  const v = (e.target as HTMLSelectElement).value;
  const hourArg = props.hour12 ? (dispHour.value === '' ? null : Number(dispHour.value)) : h.value;
  compose(hourArg, v === '' ? null : Number(v), meridiem.value);
}
function onMeridiem(e: Event): void {
  compose(dispHour.value === '' ? 12 : Number(dispHour.value), m.value, (e.target as HTMLSelectElement).value);
}
</script>

<template>
  <div :id="id" :class="cx('lily-time-picker')">
    <select class="lily-select" :aria-label="hourLabel" :disabled="disabled" :value="dispHour" @change="onHour">
      <option value="">--</option>
      <option v-for="hr in dispHours" :key="hr" :value="hr">{{ pad2(hr) }}</option>
    </select>
    <span class="lily-time-picker__sep" aria-hidden="true">:</span>
    <select class="lily-select" :aria-label="minuteLabel" :disabled="disabled" :value="m ?? ''" @change="onMinute">
      <option value="">--</option>
      <option v-for="mn in minutes" :key="mn" :value="mn">{{ pad2(mn) }}</option>
    </select>
    <select v-if="hour12" class="lily-select" :aria-label="meridiemLabel" :disabled="disabled" :value="meridiem" @change="onMeridiem">
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
  </div>
</template>
