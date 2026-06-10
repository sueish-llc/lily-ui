<script lang="ts">
export type CountdownFormat = 'dhms' | 'hms';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { cx } from '../../utils/cx';
import { remainingDuration, type InstantInput } from '../../utils/datetime';

/**
 * Countdown — displays the remaining time to a target as d/h/m/s segments,
 * ticking each second when `live` (the default). Uses the Temporal API
 * throughout. `role="timer"` with `aria-live="off"` (assertive per-second
 * updates would be noisy for screen readers).
 *
 * @example
 * ```vue
 * <Countdown :to="Temporal.Now.plainDateTimeISO().add({ hours: 24 })" @complete="onDone" />
 * <Countdown to="2027-12-31T23:59:59" format="hms" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    to: Temporal.PlainDateTime | Temporal.ZonedDateTime | string;
    format?: CountdownFormat;
    live?: boolean;
    class?: string;
  }>(),
  { format: 'dhms', live: true },
);

const emit = defineEmits<{ complete: [] }>();

function calcSegments() {
  // An unparseable `to` renders as zeros instead of throwing — same behavior
  // as the web-components port (`Countdown.ts`).
  try {
    const dur = remainingDuration(props.to as InstantInput);
    const d = dur.days;
    const h = dur.hours;
    const m = dur.minutes;
    const s = dur.seconds;
    if (props.format === 'hms') {
      return { days: 0, hours: d * 24 + h, minutes: m, seconds: s };
    }
    return { days: d, hours: h, minutes: m, seconds: s };
  } catch {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
}

const segments = ref(calcSegments());
const completed = ref(false);
let intervalId: ReturnType<typeof setInterval> | null = null;

function clearTimer() {
  if (intervalId !== null) { clearInterval(intervalId); intervalId = null; }
}

function startTimer() {
  clearTimer();
  if (!props.live) return;
  intervalId = setInterval(() => {
    segments.value = calcSegments();
    const { days, hours, minutes, seconds } = segments.value;
    const done = days === 0 && hours === 0 && minutes === 0 && seconds === 0;
    if (done && !completed.value) {
      completed.value = true;
      emit('complete');
      clearTimer();
    }
  }, 1000);
}

watch(() => [props.to, props.format] as const, () => {
  segments.value = calcSegments();
  completed.value = false;
  startTimer();
}, { immediate: false });

// `live` can be toggled after mount; rebuild the timer when it changes (the
// React version includes `live` in its timer-effect deps). `startTimer` is a
// no-op timer-wise when `live` is false, so this both starts and stops.
watch(() => props.live, () => startTimer());

onMounted(() => startTimer());
onUnmounted(() => clearTimer());

const showDays = computed(() => props.format === 'dhms');
const classes = computed(() => cx('lily-countdown', props.class));
</script>

<template>
  <div :class="classes" role="timer" aria-live="off">
    <span v-if="showDays" class="lily-countdown__segment">
      <span class="lily-countdown__value">{{ pad2(segments.days) }}</span>
      <span class="lily-countdown__label">d</span>
    </span>
    <span class="lily-countdown__segment">
      <span class="lily-countdown__value">{{ pad2(segments.hours) }}</span>
      <span class="lily-countdown__label">h</span>
    </span>
    <span class="lily-countdown__segment">
      <span class="lily-countdown__value">{{ pad2(segments.minutes) }}</span>
      <span class="lily-countdown__label">m</span>
    </span>
    <span class="lily-countdown__segment">
      <span class="lily-countdown__value">{{ pad2(segments.seconds) }}</span>
      <span class="lily-countdown__label">s</span>
    </span>
  </div>
</template>
