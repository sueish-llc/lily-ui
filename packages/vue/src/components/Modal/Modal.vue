<script lang="ts">
/** Size of the modal dialog. */
export type ModalSize = 'sm' | 'md' | 'lg';
</script>

<script setup lang="ts">
import { computed, ref, useId, type ComponentPublicInstance } from 'vue';
import { cx } from '../../utils/cx';
import { useFocusTrap, useDismiss, useScrollLock } from '../../composables/interactions';
import { usePresence } from '../../composables/presence';
import CloseButton from '../CloseButton/CloseButton.vue';

/**
 * Modal — an accessible dialog rendered in a portal over a backdrop.
 *
 * Implements the WAI-ARIA dialog pattern: `role="dialog"` + `aria-modal`,
 * focus trapped within, focus restored on close, background scroll locked, and
 * Escape/backdrop dismissal. Bind visibility with the `open` prop and listen to
 * `close`. Provide the title via the `title` prop or `#title` slot, the body via
 * the default slot, and actions via the `#footer` slot.
 *
 * @example
 * ```vue
 * <Modal :open="open" title="Confirm" @close="open = false">
 *   Are you sure?
 *   <template #footer><Button @click="open = false">OK</Button></template>
 * </Modal>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Whether the modal is open. */
    open: boolean;
    /** Dialog title (announced as the accessible name). */
    title?: string;
    /** Size. */
    size?: ModalSize;
    /** Close when the backdrop is clicked. */
    closeOnBackdrop?: boolean;
  }>(),
  { size: 'md', closeOnBackdrop: true },
);

const emit = defineEmits<{ close: [] }>();
const slots = defineSlots<{
  default?: () => unknown;
  title?: () => unknown;
  footer?: () => unknown;
}>();

const CLASS = 'lily-modal';
const titleId = useId();
const dialogRef = ref<HTMLDivElement | null>(null);
const isOpen = computed(() => props.open);
const hasTitle = computed(() => !!props.title || !!slots.title);

const onClose = () => emit('close');

// Keep the portal mounted through the exit animation; `state` drives the
// enter/exit visuals and honors the motion tier automatically.
const { isPresent, state, node: presenceRef } = usePresence(isOpen);
const backdropAnim = computed(() => (props.open ? 'fade-in' : 'fade-out'));
const dialogAnim = computed(() => (props.open ? 'zoom-in' : 'zoom-out'));

// Trap/lock/dismiss track the open prop (not presence), so they release
// immediately while the visual exit finishes.
useFocusTrap(dialogRef, isOpen);
useScrollLock(isOpen);
// Escape always closes; clicking the backdrop (outside the dialog) closes
// only when allowed. This keeps keyboard + pointer dismissal in one place.
useDismiss(dialogRef, isOpen, onClose, { outsideClick: props.closeOnBackdrop });

/** Bind both the dialog template ref and the presence ref to the dialog node. */
const setDialog = (el: Element | ComponentPublicInstance | null) => {
  dialogRef.value = el instanceof HTMLDivElement ? el : null;
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
        :ref="setDialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="hasTitle ? titleId : undefined"
        :data-state="state"
        :class="cx(CLASS, size !== 'md' && `${CLASS}--${size}`, 'lily-animate', `lily-animate--${dialogAnim}`, 'lily-animate--snappy')"
      >
        <div v-if="hasTitle" :class="`${CLASS}__header`">
          <h2 :id="titleId" :class="`${CLASS}__title`">
            <slot name="title">{{ title }}</slot>
          </h2>
          <CloseButton @click="onClose" />
        </div>
        <div :class="`${CLASS}__body`"><slot /></div>
        <div v-if="$slots.footer" :class="`${CLASS}__footer`"><slot name="footer" /></div>
      </div>
    </div>
  </Teleport>
</template>
