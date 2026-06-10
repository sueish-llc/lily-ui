<script setup lang="ts">
import { cx } from '../../utils/cx';

/**
 * InputGroup — joins a control with leading/trailing addons.
 *
 * Decorative text addons should be associated with the control via
 * `aria-describedby` or a visible `FormField` label.
 *
 * @example
 * ```vue
 * <InputGroup>
 *   <InputGroupAddon>@</InputGroupAddon>
 *   <Input aria-label="Username" />
 * </InputGroup>
 * ```
 */
// No additional props beyond fallthrough (class, attrs).
</script>

<template>
  <div :class="cx('lily-input-group')">
    <slot />
  </div>
</template>
