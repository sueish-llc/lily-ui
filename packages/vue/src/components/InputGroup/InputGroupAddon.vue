<script setup lang="ts">
import { cx } from '../../utils/cx';

/**
 * InputGroupAddon — a text/icon/button decoration attached to an `InputGroup`.
 *
 * @example
 * ```vue
 * <InputGroupAddon>@</InputGroupAddon>
 * ```
 */
// No additional props beyond fallthrough (class, attrs).
</script>

<template>
  <span :class="cx('lily-input-group__addon')">
    <slot />
  </span>
</template>
