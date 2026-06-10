<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * ButtonGroup — segments multiple {@link Button}s into a single control.
 *
 * Renders `role="group"`; provide a `label` so the group's purpose is announced.
 *
 * @example
 * ```vue
 * <ButtonGroup label="Text alignment">
 *   <Button>Left</Button>
 *   <Button>Center</Button>
 *   <Button>Right</Button>
 * </ButtonGroup>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Layout orientation. */
    orientation?: 'horizontal' | 'vertical';
    /** Accessible label describing the group. */
    label?: string;
  }>(),
  { orientation: 'horizontal' },
);

const classes = computed(() =>
  cx('lily-btn-group', props.orientation === 'vertical' && 'lily-btn-group--vertical'),
);
</script>

<template>
  <div role="group" :aria-label="label" :class="classes">
    <slot />
  </div>
</template>
