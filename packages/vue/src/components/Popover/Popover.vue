<script lang="ts">
// no type exports needed for Popover
</script>

<script setup lang="ts">
import { ref, useId } from 'vue';
import { cx } from '../../utils/cx';
import { useDismiss } from '../../composables/interactions';

/**
 * Popover — a click-triggered overlay with optional title and rich content.
 *
 * Uses `role="dialog"` (non-modal) and closes on Escape/outside click. The
 * trigger is the default slot; it receives `aria-expanded` + `aria-haspopup`
 * and a click toggle via a wrapping element. Bind open state with
 * `v-model:open`.
 *
 * @example
 * ```vue
 * <Popover title="Info" content="Details…">
 *   <button>More</button>
 * </Popover>
 * ```
 */
const props = defineProps<{
  /** Optional header shown above the body (or use the `#title` slot). */
  title?: string;
  /** Popover body content (or use the `#content` slot). */
  content?: string;
}>();

/** Open state; bind with `v-model:open`. */
const open = defineModel<boolean>('open', { default: false });

const id = useId();
const rootRef = ref<HTMLSpanElement | null>(null);
const CLASS = 'lily-popover';

useDismiss(rootRef, open, () => (open.value = false));
</script>

<template>
  <span
    ref="rootRef"
    style="position: relative; display: inline-flex"
    :aria-expanded="open"
    aria-haspopup="dialog"
    @click="open = !open"
  >
    <slot />
    <div
      :id="id"
      role="dialog"
      :aria-label="props.title || undefined"
      :class="cx(CLASS, 'lily-animate', 'lily-animate--zoom-in', 'lily-animate--snappy')"
      :hidden="!open"
    >
      <div v-if="$slots.title || title" :class="`${CLASS}__header`">
        <slot name="title">{{ title }}</slot>
      </div>
      <div :class="`${CLASS}__body`">
        <slot name="content">{{ content }}</slot>
      </div>
    </div>
  </span>
</template>
