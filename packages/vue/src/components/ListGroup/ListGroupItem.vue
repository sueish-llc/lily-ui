<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

const CLASS = 'lily-list-group';

/**
 * ListGroupItem — a single item in a `ListGroup`.
 *
 * - `action` adds hover/focus affordances.
 * - `active` sets `aria-current`.
 * - `disabled` sets `aria-disabled`.
 *
 * @example
 * ```vue
 * <ListGroupItem action active>Current item</ListGroupItem>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Render as an interactive item (hover/focus affordances). */
    action?: boolean;
    /** Mark as the current/active item. */
    active?: boolean;
    /** Disable the item. */
    disabled?: boolean;
  }>(),
  {
    action: false,
    active: false,
    disabled: false,
  },
);

const classes = computed(() =>
  cx(`${CLASS}__item`, props.action && `${CLASS}__item--action`),
);
</script>

<template>
  <li
    :class="classes"
    v-bind="{
      ...(active ? { 'aria-current': true } : {}),
      ...(disabled ? { 'aria-disabled': true } : {}),
    }"
  >
    <slot />
  </li>
</template>
