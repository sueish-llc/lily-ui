<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { cx } from '../../utils/cx';
import { prefersReducedMotion } from '../../composables/motion';

/**
 * BackTop — a floating button that appears after scrolling past
 * `visibilityHeight` and smoothly returns to the top. Respects reduced motion.
 *
 * @example
 * ```vue
 * <BackTop label="トップへ戻る" />
 * ```
 */
const props = withDefaults(defineProps<{ visibilityHeight?: number; label?: string }>(), {
  visibilityHeight: 400,
  label: 'Back to top',
});

const visible = ref(false);
function onScroll(): void {
  visible.value = window.scrollY > props.visibilityHeight;
}
onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});
onUnmounted(() => window.removeEventListener('scroll', onScroll));

function toTop(): void {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
</script>

<template>
  <button type="button" :class="cx('lily-back-top')" :aria-label="label" :hidden="!visible" @click="toTop">
    <slot><span aria-hidden="true">↑</span></slot>
  </button>
</template>
