<script lang="ts">
function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function clampField(n: number, max: number): number {
  return Math.max(0, Math.min(max, Math.floor(n)));
}
</script>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { cx } from '../../utils/cx';

/**
 * DurationInput — numeric fields (hours, minutes, optional seconds) backed by
 * `Temporal.Duration`. Bind with `v-model`. Each field is a real
 * `<input type="number">` with stepper buttons; meaning is not color-only.
 *
 * @example
 * ```vue
 * <DurationInput v-model="dur" />
 * <DurationInput v-model="dur" with-seconds disabled />
 * ```
 */
const props = withDefaults(
  defineProps<{
    withSeconds?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    status?: 'primary' | 'danger' | 'warning' | 'success' | 'info' | 'neutral';
    name?: string;
    id?: string;
    hoursLabel?: string;
    minutesLabel?: string;
    secondsLabel?: string;
    class?: string;
  }>(),
  {
    withSeconds: false,
    disabled: false,
    size: 'md',
    hoursLabel: 'Hours',
    minutesLabel: 'Minutes',
    secondsLabel: 'Seconds',
  },
);

const model = defineModel<Temporal.Duration | null>({ default: null });

const uid = useId();
const hourId = computed(() => `${uid}-h`);
const minId = computed(() => `${uid}-m`);
const secId = computed(() => `${uid}-s`);

const h = computed(() => (model.value ? model.value.hours : null));
const m = computed(() => (model.value ? model.value.minutes : null));
const s = computed(() => (model.value ? model.value.seconds : null));

function fromParts(
  hours: number | null,
  minutes: number | null,
  seconds: number | null,
): Temporal.Duration | null {
  if (hours === null && minutes === null && seconds === null) return null;
  return Temporal.Duration.from({ hours: hours ?? 0, minutes: minutes ?? 0, seconds: seconds ?? 0 });
}

function setH(v: number | null) { model.value = fromParts(v, m.value, props.withSeconds ? s.value : null); }
function setM(v: number | null) { model.value = fromParts(h.value, v, props.withSeconds ? s.value : null); }
function setS(v: number | null) { model.value = fromParts(h.value, m.value, v); }

function onHour(e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  setH(raw === '' ? null : clampField(Number(raw), 999));
}
function onMinute(e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  setM(raw === '' ? null : clampField(Number(raw), 59));
}
function onSecond(e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  setS(raw === '' ? null : clampField(Number(raw), 59));
}

const rootClass = computed(() =>
  cx(
    'lily-duration-input',
    props.size !== 'md' && `lily-duration-input--${props.size}`,
    props.status && `lily-duration-input--${props.status}`,
    props.class,
  ),
);

const fieldClass = computed(() =>
  cx('lily-number-input', props.size !== 'md' && `lily-number-input--${props.size}`),
);

const hiddenValue = computed(() =>
  model.value
    ? `PT${model.value.hours}H${model.value.minutes}M${model.value.seconds}S`
    : '',
);
</script>

<template>
  <div :id="id" :class="rootClass">
    <input v-if="name" type="hidden" :name="name" :value="hiddenValue" />

    <!-- Hours -->
    <div class="lily-duration-input__field-group">
      <label :for="hourId" class="lily-duration-input__label">{{ hoursLabel }}</label>
      <div :class="fieldClass">
        <button
          type="button"
          class="lily-number-input__btn"
          aria-label="Decrease hours"
          :disabled="disabled || h === 0"
          @click="setH(clampField((h ?? 0) - 1, 999))"
        >
          <span aria-hidden="true">−</span>
        </button>
        <input
          :id="hourId"
          type="number"
          class="lily-number-input__field"
          inputmode="numeric"
          :min="0"
          :max="999"
          :disabled="disabled"
          :value="h !== null ? pad2(h) : ''"
          :aria-label="hoursLabel"
          @input="onHour"
        />
        <button
          type="button"
          class="lily-number-input__btn"
          aria-label="Increase hours"
          :disabled="disabled || h === 999"
          @click="setH(clampField((h ?? 0) + 1, 999))"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>

    <span class="lily-duration-input__sep" aria-hidden="true">:</span>

    <!-- Minutes -->
    <div class="lily-duration-input__field-group">
      <label :for="minId" class="lily-duration-input__label">{{ minutesLabel }}</label>
      <div :class="fieldClass">
        <button
          type="button"
          class="lily-number-input__btn"
          aria-label="Decrease minutes"
          :disabled="disabled || m === 0"
          @click="setM(clampField((m ?? 0) - 1, 59))"
        >
          <span aria-hidden="true">−</span>
        </button>
        <input
          :id="minId"
          type="number"
          class="lily-number-input__field"
          inputmode="numeric"
          :min="0"
          :max="59"
          :disabled="disabled"
          :value="m !== null ? pad2(m) : ''"
          :aria-label="minutesLabel"
          @input="onMinute"
        />
        <button
          type="button"
          class="lily-number-input__btn"
          aria-label="Increase minutes"
          :disabled="disabled || m === 59"
          @click="setM(clampField((m ?? 0) + 1, 59))"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>

    <!-- Seconds -->
    <template v-if="withSeconds">
      <span class="lily-duration-input__sep" aria-hidden="true">:</span>
      <div class="lily-duration-input__field-group">
        <label :for="secId" class="lily-duration-input__label">{{ secondsLabel }}</label>
        <div :class="fieldClass">
          <button
            type="button"
            class="lily-number-input__btn"
            aria-label="Decrease seconds"
            :disabled="disabled || s === 0"
            @click="setS(clampField((s ?? 0) - 1, 59))"
          >
            <span aria-hidden="true">−</span>
          </button>
          <input
            :id="secId"
            type="number"
            class="lily-number-input__field"
            inputmode="numeric"
            :min="0"
            :max="59"
            :disabled="disabled"
            :value="s !== null ? pad2(s) : ''"
            :aria-label="secondsLabel"
            @input="onSecond"
          />
          <button
            type="button"
            class="lily-number-input__btn"
            aria-label="Increase seconds"
            :disabled="disabled || s === 59"
            @click="setS(clampField((s ?? 0) + 1, 59))"
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
