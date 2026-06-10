<script setup lang="ts">
import { cx } from '../../utils/cx';

/**
 * CloseButton — a standard dismiss control (×).
 *
 * Renders a native `<button>` with an accessible label and a decorative glyph.
 * A user-supplied `class` is merged automatically by Vue.
 *
 * @example
 * ```vue
 * <CloseButton @click="dismiss" label="Dismiss notification" />
 * ```
 */
withDefaults(
  defineProps<{
    /** Accessible label for the dismiss action. */
    label?: string;
    /** Native button type. */
    type?: 'button' | 'submit' | 'reset';
  }>(),
  { label: 'Close', type: 'button' },
);
</script>

<template>
  <button :type="type" :class="cx('lily-close')" :aria-label="label">
    <span aria-hidden="true">&times;</span>
  </button>
</template>
