<script setup lang="ts">
import { cx } from '../../utils/cx';

/**
 * ListGroup — a series of content items. Compose with `ListGroupItem`.
 *
 * @example
 * ```vue
 * <ListGroup>
 *   <ListGroupItem active>One</ListGroupItem>
 *   <ListGroupItem>Two</ListGroupItem>
 *   <ListGroupItem disabled>Three</ListGroupItem>
 * </ListGroup>
 * ```
 */
// No additional props beyond fallthrough (class, attrs).
</script>

<template>
  <ul :class="cx('lily-list-group')">
    <slot />
  </ul>
</template>
