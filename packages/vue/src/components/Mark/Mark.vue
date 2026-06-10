<script setup lang="ts">
import { cx } from '../../utils/cx';

/**
 * Mark — highlights a text run with a semantic-color background using the
 * native `<mark>` element. The highlight is purely decorative; the text itself
 * must convey the meaning (WCAG 1.4.1).
 *
 * @example
 * ```vue
 * <p>Please read the <Mark>important notice</Mark> before continuing.</p>
 * <Mark status="success">Approved</Mark>
 * ```
 */
withDefaults(
  defineProps<{
    /**
     * Semantic color intent. The highlight is decorative — meaning must be
     * conveyed in the text itself (AAA 1.4.1).
     */
    status?: 'warning' | 'success' | 'info' | 'danger' | 'primary';
  }>(),
  { status: 'warning' },
);
</script>

<template>
  <mark :class="cx('lily-mark', `lily-mark--${status}`)">
    <slot />
  </mark>
</template>
