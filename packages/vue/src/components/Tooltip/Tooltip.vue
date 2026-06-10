<script lang="ts">
// no type exports needed for Tooltip
</script>

<script setup lang="ts">
import { ref, useId } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Tooltip — a small label shown on hover/focus, associated via
 * `aria-describedby` (WAI-ARIA tooltip pattern).
 *
 * The trigger is the default slot; it should be a focusable element for
 * keyboard accessibility.
 *
 * @example
 * ```vue
 * <Tooltip content="Delete"><button aria-label="Delete">🗑</button></Tooltip>
 * ```
 */
defineProps<{
  /** The tooltip text. */
  content?: string;
}>();

const id = useId();
const open = ref(false);
const CLASS = 'lily-tooltip';
</script>

<template>
  <span
    style="position: relative; display: inline-flex"
    :aria-describedby="open ? id : undefined"
    @mouseenter="open = true"
    @mouseleave="open = false"
    @focusin="open = true"
    @focusout="open = false"
  >
    <slot />
    <span
      :id="id"
      role="tooltip"
      :class="cx(CLASS, 'lily-animate', 'lily-animate--fade-in', 'lily-animate--snappy')"
      :hidden="!open"
    >
      <slot name="content">{{ content }}</slot>
    </span>
  </span>
</template>
