<script lang="ts">
export type ChipStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Chip / Tag — a compact token. Can be a selectable toggle (`clickable`) or
 * removable (`removable` + `@remove`); these modes are mutually exclusive to
 * avoid nested interactive elements (removable wins if both are set).
 *
 * @example
 * ```vue
 * <Chip status="info">React</Chip>
 * <Chip clickable :selected="on" @click="toggle">絞り込み</Chip>
 * <Chip removable @remove="remove(id)">ada@example.com</Chip>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Semantic color. */
    status?: ChipStatus;
    /** Smaller size. */
    small?: boolean;
    /** Selected/active (e.g. a filter chip). */
    selected?: boolean;
    /** Make the whole chip a toggle button. Ignored when `removable`. */
    clickable?: boolean;
    /** Render a trailing remove button that emits `remove`. */
    removable?: boolean;
    /** Accessible label for the remove button. */
    removeLabel?: string;
  }>(),
  { status: 'neutral', small: false, selected: false, clickable: false, removable: false, removeLabel: 'Remove' },
);

const emit = defineEmits<{ (e: 'remove'): void }>();

const asButton = computed(() => props.clickable && !props.removable);
const classes = computed(() =>
  cx(
    'lily-chip',
    props.small && 'lily-chip--sm',
    props.selected && 'lily-chip--selected',
    asButton.value && 'lily-chip--clickable',
  ),
);
const dataStatus = computed(() =>
  props.status !== 'neutral' && !props.selected ? props.status : undefined,
);
</script>

<template>
  <button
    v-if="asButton"
    type="button"
    :class="classes"
    :data-status="dataStatus"
    :aria-pressed="selected"
  >
    <slot />
  </button>
  <span v-else :class="classes" :data-status="dataStatus">
    <span><slot /></span>
    <button
      v-if="removable"
      type="button"
      class="lily-chip__remove"
      :aria-label="removeLabel"
      @click="emit('remove')"
    >
      <span aria-hidden="true">×</span>
    </button>
  </span>
</template>
