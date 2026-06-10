<script lang="ts">
/** How the drawer relates to the rest of the page. */
export type DrawerVariant = 'temporary' | 'persistent' | 'permanent';
/** Edge the drawer is anchored to. */
export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';
</script>

<script setup lang="ts">
import { computed, ref, useId, type ComponentPublicInstance } from 'vue';
import { cx } from '../../utils/cx';
import { useFocusTrap, useDismiss, useScrollLock } from '../../composables/interactions';
import { usePresence } from '../../composables/presence';
import type { AnimationName } from '../../composables/animations';
import CloseButton from '../CloseButton/CloseButton.vue';

/** Slide animation per edge (temporary only) — enter slides in, exit reverses. */
const ENTER_ANIM: Record<DrawerAnchor, AnimationName> = {
  left: 'slide-in-left',
  right: 'slide-in-right',
  top: 'slide-in-down',
  bottom: 'slide-in-up',
};
const EXIT_ANIM: Record<DrawerAnchor, AnimationName> = {
  left: 'slide-out-left',
  right: 'slide-out-right',
  top: 'slide-out-up',
  bottom: 'slide-out-down',
};

/**
 * Drawer — a panel anchored to a screen edge, in one of three variants:
 * `temporary` (overlay on a backdrop, the Modal a11y model), `persistent` (in
 * the flow, collapses open/closed), and `permanent` (always visible, in flow).
 *
 * @example
 * ```vue
 * <Drawer :open="open" anchor="left" title="Menu" @close="open = false">…</Drawer>
 * <Drawer variant="permanent" anchor="left" aria-label="Sections">…</Drawer>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Whether the drawer is open (temporary/persistent; ignored for permanent). */
    open?: boolean;
    /** Relationship to the page. */
    variant?: DrawerVariant;
    /** Edge to anchor to. */
    anchor?: DrawerAnchor;
    /** Visible title; also the accessible name (temporary). */
    title?: string;
    /** Accessible name when there is no visible title (e.g. a nav drawer). */
    ariaLabel?: string;
  }>(),
  { open: false, variant: 'temporary', anchor: 'left' },
);

const emit = defineEmits<{ close: [] }>();
const slots = defineSlots<{ default?: () => unknown; title?: () => unknown }>();

const CLASS = 'lily-drawer';
const titleId = useId();
const panelRef = ref<HTMLDivElement | null>(null);

const isOverlay = computed(() => props.variant === 'temporary');
const overlayOpen = computed(() => isOverlay.value && props.open);
const hasTitle = computed(() => !!props.title || !!slots.title);

const onClose = () => emit('close');

const { isPresent, state, node: presenceRef } = usePresence(overlayOpen);
const panelAnim = computed(() => (props.open ? ENTER_ANIM[props.anchor] : EXIT_ANIM[props.anchor]));
const backdropAnim = computed(() => (props.open ? 'fade-in' : 'fade-out'));

useFocusTrap(panelRef, overlayOpen);
useScrollLock(overlayOpen);
useDismiss(panelRef, overlayOpen, onClose, { outsideClick: true });

const setPanel = (el: Element | ComponentPublicInstance | null) => {
  panelRef.value = el instanceof HTMLDivElement ? el : null;
  presenceRef(el);
};
</script>

<template>
  <Teleport v-if="isOverlay" to="body">
    <div
      v-if="isPresent"
      :class="cx('lily-backdrop', 'lily-animate', `lily-animate--${backdropAnim}`, 'lily-animate--snappy')"
      :data-state="state"
    >
      <div
        :ref="setPanel"
        role="dialog"
        aria-modal="true"
        :aria-label="!hasTitle ? ariaLabel : undefined"
        :aria-labelledby="hasTitle ? titleId : undefined"
        :data-state="state"
        :class="
          cx(
            CLASS,
            `${CLASS}--temporary`,
            `${CLASS}--${anchor}`,
            'lily-animate',
            `lily-animate--${panelAnim}`,
            'lily-animate--snappy',
          )
        "
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

  <div
    v-else
    :aria-label="ariaLabel"
    :aria-labelledby="hasTitle ? titleId : undefined"
    :data-open="variant === 'persistent' ? String(open) : undefined"
    :class="cx(CLASS, `${CLASS}--${variant}`, `${CLASS}--${anchor}`)"
  >
    <div v-if="hasTitle" :class="`${CLASS}__header`">
      <h2 :id="titleId" :class="`${CLASS}__title`">
        <slot name="title">{{ title }}</slot>
      </h2>
      <CloseButton v-if="variant === 'persistent'" @click="onClose" />
    </div>
    <div :class="`${CLASS}__body`"><slot /></div>
  </div>
</template>
