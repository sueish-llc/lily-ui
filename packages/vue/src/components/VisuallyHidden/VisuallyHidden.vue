<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * VisuallyHidden — hides content visually while keeping it available to
 * assistive technologies (the classic sr-only technique).
 *
 * Renders a `<span>` by default. When `focusable` is set the content reappears
 * on `:focus` — useful for skip-navigation links and similar focusable helpers.
 *
 * @example
 * ```vue
 * <VisuallyHidden>Loading…</VisuallyHidden>
 * <VisuallyHidden as="a" focusable href="#main">Skip to content</VisuallyHidden>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** HTML element to render as. */
    as?: string;
    /**
     * When true, the element becomes visible on focus — useful when it wraps a
     * focusable element (e.g. a skip-navigation link).
     */
    focusable?: boolean;
  }>(),
  { as: 'span', focusable: false },
);

const classes = computed(() =>
  cx('lily-visually-hidden', props.focusable && 'lily-visually-hidden--focusable'),
);
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
