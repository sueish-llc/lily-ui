<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Affix — stick its content to the top (or bottom) of the viewport once
 * scrolled into position, using CSS `position: sticky`.
 *
 * @example
 * ```vue
 * <Affix :offset="16"><Toolbar /></Affix>
 * ```
 */
const props = withDefaults(defineProps<{ offset?: number; position?: 'top' | 'bottom' }>(), {
  offset: 0,
  position: 'top',
});

const style = computed<Record<string, string>>(() => ({ '--lily-affix-offset': `${props.offset}px` }));
</script>

<template>
  <div :class="cx('lily-affix', position === 'bottom' && 'lily-affix--bottom')" :style="style">
    <slot />
  </div>
</template>
