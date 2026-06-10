<script lang="ts">
/** Where the card sits relative to its trigger. */
export type HoverCardPlacement = 'top' | 'bottom' | 'left' | 'right';
</script>

<script setup lang="ts">
import { ref, useId, onBeforeUnmount } from 'vue';
import { cx } from '../../utils/cx';
import { useDismiss } from '../../composables/interactions';

/**
 * HoverCard — a floating card that reveals supplementary rich content when the
 * trigger is hovered or focused.
 *
 * Unlike Popover it is not a dialog: it opens on hover/focus with an open/close
 * delay and is purely informational. It opens by keyboard focus too, and closes
 * on blur or Escape. Provide the trigger via the default slot and the card via
 * the `#content` slot (or the `content` prop). Bind open state with
 * `v-model:open`.
 *
 * @example
 * ```vue
 * <HoverCard>
 *   <a href="/users/1">@lily</a>
 *   <template #content><UserSummary /></template>
 * </HoverCard>
 * ```
 */
withDefaults(
  defineProps<{
    /** Card body content (or use the `#content` slot). */
    content?: string;
    /** Side the card opens on. */
    placement?: HoverCardPlacement;
    /** Delay before opening, in ms. */
    openDelay?: number;
    /** Delay before closing, in ms. */
    closeDelay?: number;
  }>(),
  { placement: 'bottom', openDelay: 200, closeDelay: 150 },
);

/** Open state; bind with `v-model:open`. */
const open = defineModel<boolean>('open', { default: false });

const id = useId();
const rootRef = ref<HTMLSpanElement | null>(null);
const CLASS = 'lily-hover-card';

let timer: ReturnType<typeof setTimeout> | null = null;
function clear(): void {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}
function schedule(next: boolean, delay: number): void {
  clear();
  timer = setTimeout(() => (open.value = next), delay);
}
function show(): void {
  clear();
  open.value = true;
}
function hide(): void {
  clear();
  open.value = false;
}

useDismiss(rootRef, open, () => (open.value = false));
onBeforeUnmount(clear);
</script>

<template>
  <span
    ref="rootRef"
    style="position: relative; display: inline-flex"
    @mouseenter="schedule(true, openDelay)"
    @mouseleave="schedule(false, closeDelay)"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <div
      :id="id"
      role="tooltip"
      :class="cx(CLASS, `${CLASS}--${placement}`, 'lily-animate', 'lily-animate--zoom-in', 'lily-animate--snappy')"
      :hidden="!open"
    >
      <div :class="`${CLASS}__body`">
        <slot name="content">{{ content }}</slot>
      </div>
    </div>
  </span>
</template>
