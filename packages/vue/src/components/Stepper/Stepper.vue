<script lang="ts">
export type StepStatus = 'complete' | 'current' | 'upcoming' | 'error';
export interface StepItem {
  label: string;
  description?: string;
  status?: StepStatus;
}
</script>

<script setup lang="ts">
import { cx } from '../../utils/cx';

/**
 * Stepper — a sequence of steps for wizards / checkout. The current step gets
 * `aria-current="step"`; completed/errored steps add visually-hidden status text.
 *
 * @example
 * ```vue
 * <Stepper :active="1" :steps="[{ label: 'カート' }, { label: '配送' }, { label: '確認' }]" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    steps: StepItem[];
    active?: number;
    orientation?: 'horizontal' | 'vertical';
    completeLabel?: string;
    errorLabel?: string;
  }>(),
  { active: 0, orientation: 'horizontal', completeLabel: 'completed', errorLabel: 'error' },
);

function statusOf(i: number, s?: StepStatus): StepStatus {
  return s ?? (i < props.active ? 'complete' : i === props.active ? 'current' : 'upcoming');
}
function marker(i: number, st: StepStatus): string | number {
  return st === 'complete' ? '✓' : st === 'error' ? '!' : i + 1;
}
</script>

<template>
  <div :class="cx('lily-stepper', orientation === 'vertical' && 'lily-stepper--vertical')" role="list">
    <template v-for="(step, i) in steps" :key="i">
      <span
        v-if="i > 0"
        :class="cx('lily-stepper__connector', orientation === 'vertical' && 'lily-stepper__connector--vertical')"
        aria-hidden="true"
      />
      <div
        :class="cx('lily-stepper__step', `lily-stepper__step--${statusOf(i, step.status)}`)"
        role="listitem"
        :aria-current="statusOf(i, step.status) === 'current' ? 'step' : undefined"
      >
        <span class="lily-stepper__marker" aria-hidden="true">{{ marker(i, statusOf(i, step.status)) }}</span>
        <span class="lily-stepper__content">
          <span class="lily-stepper__label"
            >{{ step.label
            }}<span v-if="statusOf(i, step.status) === 'complete'" class="lily-visually-hidden">
              ({{ completeLabel }})</span
            ><span v-else-if="statusOf(i, step.status) === 'error'" class="lily-visually-hidden">
              ({{ errorLabel }})</span
            ></span
          >
          <span v-if="step.description" class="lily-stepper__description">{{ step.description }}</span>
        </span>
      </div>
    </template>
  </div>
</template>
