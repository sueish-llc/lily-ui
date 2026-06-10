<script lang="ts">
/** Edge the panel slides in from. */
export type OffcanvasPlacement = 'start' | 'end' | 'top' | 'bottom';
</script>

<script setup lang="ts">
import { computed, ref, useId, type ComponentPublicInstance } from 'vue';
import { cx } from '../../utils/cx';
import { useFocusTrap, useDismiss, useScrollLock } from '../../composables/interactions';
import { usePresence } from '../../composables/presence';
import type { AnimationName } from '../../composables/animations';
import CloseButton from '../CloseButton/CloseButton.vue';

/** Slide animation per edge — enter slides in from the edge, exit reverses. */
const ENTER_ANIM: Record<OffcanvasPlacement, AnimationName> = {
  start: 'slide-in-left',
  end: 'slide-in-right',
  top: 'slide-in-down',
  bottom: 'slide-in-up',
};
const EXIT_ANIM: Record<OffcanvasPlacement, AnimationName> = {
  start: 'slide-out-left',
  end: 'slide-out-right',
  top: 'slide-out-up',
  bottom: 'slide-out-down',
};

/**
 * Offcanvas — a panel that slides in from a screen edge, over a backdrop.
 *
 * Same accessibility model as {@link Modal}: dialog semantics, focus trap,
 * scroll lock, Escape/backdrop dismissal. Bind visibility with the `open` prop
 * and listen to `close`. Provide the title via the `title` prop or `#title`
 * slot and the body via the default slot.
 *
 * @example
 * ```vue
 * <Offcanvas :open="open" placement="end" title="Menu" @close="open = false">…</Offcanvas>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Whether the panel is open. */
    open: boolean;
    /** Edge to slide in from. */
    placement?: OffcanvasPlacement;
    /** Panel title (accessible name). */
    title?: string;
  }>(),
  { placement: 'start' },
);

const emit = defineEmits<{ close: [] }>();
const slots = defineSlots<{
  default?: () => unknown;
  title?: () => unknown;
}>();

const CLASS = 'lily-offcanvas';
const titleId = useId();
const panelRef = ref<HTMLDivElement | null>(null);
const isOpen = computed(() => props.open);
const hasTitle = computed(() => !!props.title || !!slots.title);

const onClose = () => emit('close');

// Keep the panel mounted through its slide-out; the panel's animation end drives
// unmount (honors the motion tier automatically).
const { isPresent, state, node: presenceRef } = usePresence(isOpen);
const panelAnim = computed(() => (props.open ? ENTER_ANIM[props.placement] : EXIT_ANIM[props.placement]));
const backdropAnim = computed(() => (props.open ? 'fade-in' : 'fade-out'));

useFocusTrap(panelRef, isOpen);
useScrollLock(isOpen);
// Escape + backdrop (outside) click both dismiss, handled in one hook.
useDismiss(panelRef, isOpen, onClose, { outsideClick: true });

/** Bind both the panel template ref and the presence ref to the panel node. */
const setPanel = (el: Element | ComponentPublicInstance | null) => {
  panelRef.value = el instanceof HTMLDivElement ? el : null;
  presenceRef(el);
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isPresent"
      :class="cx('lily-backdrop', 'lily-animate', `lily-animate--${backdropAnim}`, 'lily-animate--snappy')"
      :data-state="state"
    >
      <div
        :ref="setPanel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="hasTitle ? titleId : undefined"
        :data-state="state"
        :class="cx(CLASS, `${CLASS}--${placement}`, 'lily-animate', `lily-animate--${panelAnim}`, 'lily-animate--snappy')"
      >
        <div :class="`${CLASS}__header`">
          <h2 v-if="hasTitle" :id="titleId" :class="`${CLASS}__title`">
            <slot name="title">{{ title }}</slot>
          </h2>
          <CloseButton @click="onClose" />
        </div>
        <div :class="`${CLASS}__body`"><slot /></div>
      </div>
    </div>
  </Teleport>
</template>
