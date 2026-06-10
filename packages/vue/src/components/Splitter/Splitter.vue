<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Splitter — two resizable panes with a draggable, keyboard-operable divider
 * (`role="separator"`). Bind the start-pane percent with `v-model`. Use the
 * `#start` / `#end` slots for the panes.
 *
 * @example
 * ```vue
 * <Splitter v-model="size"><template #start>…</template><template #end>…</template></Splitter>
 * ```
 */
const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical';
    min?: number;
    max?: number;
    step?: number;
    handleLabel?: string;
  }>(),
  { orientation: 'horizontal', min: 10, max: 90, step: 5, handleLabel: 'Resize panels' },
);

const model = defineModel<number>({ default: 50 });
const containerRef = ref<HTMLElement>();
const vertical = computed(() => props.orientation === 'vertical');
const clamp = (n: number) => Math.max(props.min, Math.min(props.max, n));

let rafId: number | null = null;
let pendingMove: PointerEvent | null = null;
let stopDrag: (() => void) | null = null;

function applyMove(ev: PointerEvent): void {
  const rect = containerRef.value?.getBoundingClientRect();
  if (!rect) return;
  const pct = vertical.value
    ? ((ev.clientY - rect.top) / rect.height) * 100
    : ((ev.clientX - rect.left) / rect.width) * 100;
  model.value = clamp(Math.round(pct));
}

function onPointerDown(e: PointerEvent): void {
  e.preventDefault();
  stopDrag?.();
  // Batch pointermove bursts into at most one model update per animation frame.
  const move = (ev: PointerEvent) => {
    pendingMove = ev;
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (pendingMove) applyMove(pendingMove);
    });
  };
  const end = () => stopDrag?.();
  stopDrag = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', end);
    window.removeEventListener('pointercancel', end);
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
      // Flush the last move that was still waiting on its frame.
      if (pendingMove) applyMove(pendingMove);
    }
    pendingMove = null;
    stopDrag = null;
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
}

// A drag can outlive the component (e.g. a pane unmounted mid-drag); make sure
// the window listeners and any pending frame don't leak.
onUnmounted(() => stopDrag?.());

function onKeydown(e: KeyboardEvent): void {
  const dec = vertical.value ? 'ArrowUp' : 'ArrowLeft';
  const inc = vertical.value ? 'ArrowDown' : 'ArrowRight';
  if (e.key === dec) {
    e.preventDefault();
    model.value = clamp(model.value - props.step);
  } else if (e.key === inc) {
    e.preventDefault();
    model.value = clamp(model.value + props.step);
  } else if (e.key === 'Home') {
    e.preventDefault();
    model.value = props.min;
  } else if (e.key === 'End') {
    e.preventDefault();
    model.value = props.max;
  }
}
</script>

<template>
  <div
    ref="containerRef"
    :class="cx('lily-splitter', vertical && 'lily-splitter--vertical')"
    :style="{ '--lily-splitter-size': `${model}%` }"
  >
    <div class="lily-splitter__panel lily-splitter__panel--start"><slot name="start" /></div>
    <!-- Focusable window-splitter (WAI-ARIA): a separator operable by pointer + arrow keys.
         Kept as a div with tabindex, matching the React source of truth. -->
    <div
      class="lily-splitter__handle"
      role="separator"
      tabindex="0"
      :aria-orientation="vertical ? 'horizontal' : 'vertical'"
      :aria-label="handleLabel"
      :aria-valuenow="Math.round(model)"
      :aria-valuemin="min"
      :aria-valuemax="max"
      @pointerdown="onPointerDown"
      @keydown="onKeydown"
    />
    <div class="lily-splitter__panel lily-splitter__panel--end"><slot name="end" /></div>
  </div>
</template>
