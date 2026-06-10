<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Card — a flexible content container. Compose with `CardHeader`, `CardBody`,
 * `CardFooter`, and `CardTitle`.
 *
 * @example
 * ```vue
 * <Card>
 *   <CardHeader>Header</CardHeader>
 *   <CardBody><CardTitle>Title</CardTitle>Body text</CardBody>
 *   <CardFooter>Footer</CardFooter>
 * </Card>
 * ```
 */
const props = defineProps<{
  /** Use a shadow instead of a border. */
  elevated?: boolean;
}>();

const classes = computed(() => cx('lily-card', props.elevated && 'lily-card--elevated'));
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
