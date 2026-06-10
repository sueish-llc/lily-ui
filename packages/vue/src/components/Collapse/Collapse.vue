<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { cx } from '../../utils/cx';

const CLASS = 'lily-collapse';

/**
 * Collapse — animates showing/hiding content by height.
 *
 * Pair the toggling control with `aria-expanded` and `aria-controls` pointing
 * at this element's `id`.
 *
 * @example
 * ```vue
 * <button :aria-expanded="open" aria-controls="c1" @click="open = !open">
 *   Toggle
 * </button>
 * <Collapse id="c1" :open="open">content</Collapse>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Whether the content is expanded. */
    open: boolean;
  }>(),
  {},
);

/** Reference to the wrapper element (also the inner element for scrollHeight). */
const innerRef = ref<HTMLDivElement | null>(null);

/** Animated height: `undefined` = auto (fully open), `0` = closed. */
const height = ref<number | undefined>(props.open ? undefined : 0);

const isHidden = computed(() => !props.open && height.value === 0);

watch(
  () => props.open,
  (open) => {
    const el = innerRef.value;
    if (!el) return;
    if (open) {
      // Expand to content height, then release to auto for responsiveness.
      height.value = el.scrollHeight;
      const t = setTimeout(() => {
        height.value = undefined;
      }, 220);
      // Return value of watch callback is ignored; cleanup is handled below.
      // Store the timeout id for cleanup:
      _pendingTimer = t;
    } else {
      // Collapse: set explicit height first so the transition has a start value.
      height.value = el.scrollHeight;
      requestAnimationFrame(() => {
        height.value = 0;
      });
    }
  },
);

// Track pending timer for cleanup (Vue watch callbacks can't return cleanup directly).
let _pendingTimer: ReturnType<typeof setTimeout> | null = null;

// Clean up on unmount.
import { onUnmounted } from 'vue';
onUnmounted(() => {
  if (_pendingTimer !== null) clearTimeout(_pendingTimer);
});

const style = computed<Record<string, string | number | undefined>>(() =>
  height.value !== undefined ? { height: `${height.value}px` } : {},
);

const classes = computed(() => cx(CLASS));
</script>

<template>
  <div
    ref="innerRef"
    :class="classes"
    :style="style"
    :hidden="isHidden || undefined"
  >
    <slot />
  </div>
</template>
