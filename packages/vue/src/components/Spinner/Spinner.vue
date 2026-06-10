<script lang="ts">
export type SpinnerVariant = 'border' | 'grow';
export type SpinnerSize = 'sm' | 'md' | 'lg';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Spinner — a loading indicator. Inherits color from `currentColor`.
 *
 * Exposes `role="status"` with a visually-hidden label so screen readers
 * announce the loading state.
 *
 * @example
 * ```vue
 * <Spinner /> <Spinner variant="grow" size="sm" label="送信中" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Animation style. */
    variant?: SpinnerVariant;
    /** Size. */
    size?: SpinnerSize;
    /** Accessible status label. */
    label?: string;
  }>(),
  { variant: 'border', size: 'md', label: 'Loading' },
);

const classes = computed(() =>
  cx('lily-spinner', `lily-spinner--${props.variant}`, `lily-spinner--${props.size}`),
);
</script>

<template>
  <span role="status" :class="classes">
    <span class="lily-visually-hidden">{{ label }}</span>
  </span>
</template>
