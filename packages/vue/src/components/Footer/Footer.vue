<script setup lang="ts">
import { cx } from '../../utils/cx';

/**
 * Footer — the page's `contentinfo` landmark, the counterpart to Navbar. A
 * `<footer>` region with a centered inner row composed via the default slot.
 *
 * @example
 * ```vue
 * <Footer>
 *   <p>© 2026 Lily</p>
 *   <a href="/terms">Terms</a>
 * </Footer>
 * ```
 */
withDefaults(
  defineProps<{
    /** Draw a top border separating the footer from the page. */
    bordered?: boolean;
  }>(),
  { bordered: true },
);
</script>

<template>
  <footer :class="cx('lily-footer', bordered && 'lily-footer--bordered')">
    <div class="lily-footer__inner"><slot /></div>
  </footer>
</template>
