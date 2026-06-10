<script setup lang="ts">
import { ref, computed, useId } from 'vue';
import { cx } from '../../utils/cx';

const CLASS = 'lily-navbar';

/**
 * Navbar — responsive top navigation. Collapses to a toggle on small screens.
 *
 * Renders a `<nav>` landmark; the toggle exposes `aria-expanded` +
 * `aria-controls` for the collapsible region. Brand can be supplied via the
 * `brand` prop (string) or via the `#brand` slot.
 *
 * @example
 * ```vue
 * <Navbar brand="Lily">
 *   <a href="/docs">Docs</a>
 *   <a href="/about">About</a>
 * </Navbar>
 * ```
 */
withDefaults(
  defineProps<{
    /** Brand/logo text or link text (use the `#brand` slot for rich content). */
    brand?: string;
    /** href for the brand. */
    brandHref?: string;
    /** Accessible label for the nav landmark. */
    label?: string;
    /** Label for the mobile toggle button. */
    toggleLabel?: string;
  }>(),
  {
    brandHref: '#',
    label: 'Main',
    toggleLabel: 'Toggle navigation',
  },
);

/** Internal open state for the collapsible region. */
const open = ref(false);

/** Stable id linking the toggle to the collapsible region. */
const collapseId = useId();

const collapseClass = computed(() =>
  cx(`${CLASS}__collapse`, open.value && `${CLASS}__collapse--open`),
);
</script>

<template>
  <nav :aria-label="label" :class="cx(CLASS)">
    <a v-if="brand || $slots.brand" :class="`${CLASS}__brand`" :href="brandHref">
      <slot name="brand">{{ brand }}</slot>
    </a>
    <button
      type="button"
      :class="`${CLASS}__toggle`"
      :aria-expanded="open"
      :aria-controls="collapseId"
      :aria-label="toggleLabel"
      @click="open = !open"
    >
      <span aria-hidden="true">&#9776;</span>
    </button>
    <div :id="collapseId" :class="collapseClass">
      <slot />
    </div>
  </nav>
</template>
