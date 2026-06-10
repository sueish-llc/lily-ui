<script lang="ts">
/** Semantic intent, mapped to theme color tokens. */
export type BadgeStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'neutral';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Badge — a small count or label.
 *
 * For a standalone status conveyed only by color, include descriptive text
 * (e.g. a visually-hidden suffix) so it isn't color-only.
 *
 * @example
 * ```vue
 * <Badge status="danger" pill>9</Badge>
 * <Badge status="success" subtle>Active</Badge>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Element/component to render as. */
    as?: string | object;
    /** Semantic color. */
    status?: BadgeStatus;
    /** Soft/subtle appearance. */
    subtle?: boolean;
    /** Fully rounded pill shape. */
    pill?: boolean;
  }>(),
  { status: 'primary', subtle: false, pill: false },
);

const classes = computed(() =>
  cx('lily-badge', props.subtle && 'lily-badge--subtle', props.pill && 'lily-badge--pill'),
);
</script>

<template>
  <component :is="as ?? 'span'" :class="classes" :data-status="status">
    <slot />
  </component>
</template>
