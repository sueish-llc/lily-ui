<script lang="ts">
// no type exports needed for ContextMenuItem
</script>

<script setup lang="ts">
import { cx } from '../../utils/cx';

/**
 * ContextMenuItem — a single actionable menu item (`role="menuitem"`). Use
 * inside a {@link ContextMenu}. Emits `select` when activated; unknown
 * attributes fall through to the inner `<button>`.
 */
defineOptions({ inheritAttrs: false });

const props = defineProps<{ disabled?: boolean }>();
const emit = defineEmits<{ select: [] }>();

const CLASS = 'lily-context-menu';
</script>

<template>
  <button
    type="button"
    role="menuitem"
    :tabindex="-1"
    :class="cx(`${CLASS}__item`)"
    :aria-disabled="props.disabled || undefined"
    :disabled="props.disabled"
    v-bind="$attrs"
    @click="emit('select')"
  >
    <slot />
  </button>
</template>
