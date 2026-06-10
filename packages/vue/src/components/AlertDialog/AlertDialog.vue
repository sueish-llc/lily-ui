<script lang="ts">
/** Semantic intent of the alert dialog. */
export type AlertDialogStatus = 'primary' | 'danger' | 'warning' | 'success' | 'info' | 'neutral';
</script>

<script setup lang="ts">
import { computed, ref, useId, type ComponentPublicInstance } from 'vue';
import { cx } from '../../utils/cx';
import { useFocusTrap, useDismiss, useScrollLock } from '../../composables/interactions';
import { usePresence } from '../../composables/presence';

/**
 * AlertDialog — a confirmation dialog for consequential, irreversible actions.
 *
 * Implements `role="alertdialog"` + `aria-modal`, labelled by its title and
 * described by its body. Focus is trapped within and restored on close; Escape
 * closes the dialog. Unlike Modal, clicking the backdrop does NOT dismiss it —
 * the user must take an explicit action via the `#actions` slot.
 *
 * @example
 * ```vue
 * <AlertDialog :open="open" title="Delete item?" status="danger" @close="open = false">
 *   This action cannot be undone.
 *   <template #actions>
 *     <Button variant="ghost" @click="open = false">Cancel</Button>
 *     <Button status="danger" @click="confirm">Delete</Button>
 *   </template>
 * </AlertDialog>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Whether the dialog is open. */
    open: boolean;
    /** Dialog title, announced as the accessible name. */
    title: string;
    /** Semantic intent. */
    status?: AlertDialogStatus;
  }>(),
  { status: 'primary' },
);

const emit = defineEmits<{ close: [] }>();
defineSlots<{
  default?: () => unknown;
  actions?: () => unknown;
}>();

const CLASS = 'lily-alert-dialog';
const titleId = useId();
const descId = useId();
const dialogRef = ref<HTMLDivElement | null>(null);
const isOpen = computed(() => props.open);

const onClose = () => emit('close');

const { isPresent, state, node: presenceRef } = usePresence(isOpen);
const backdropAnim = computed(() => (props.open ? 'fade-in' : 'fade-out'));
const dialogAnim = computed(() => (props.open ? 'zoom-in' : 'zoom-out'));

useFocusTrap(dialogRef, isOpen);
useScrollLock(isOpen);
// Escape closes; backdrop clicks do NOT (outsideClick: false).
useDismiss(dialogRef, isOpen, onClose, { outsideClick: false });

const setDialog = (el: Element | ComponentPublicInstance | null) => {
  dialogRef.value = el instanceof HTMLDivElement ? el : null;
  presenceRef(el);
};

const dialogClass = computed(() =>
  cx(
    CLASS,
    props.status !== 'neutral' && `${CLASS}--${props.status}`,
    'lily-animate',
    `lily-animate--${dialogAnim.value}`,
    'lily-animate--snappy',
  ),
);
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
        role="alertdialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="descId"
        :data-state="state"
        :class="dialogClass"
      >
        <div :class="`${CLASS}__header`">
          <h2 :id="titleId" :class="`${CLASS}__title`">{{ title }}</h2>
        </div>
        <div :id="descId" :class="`${CLASS}__body`"><slot /></div>
        <div v-if="$slots.actions" :class="`${CLASS}__footer`"><slot name="actions" /></div>
      </div>
    </div>
  </Teleport>
</template>
