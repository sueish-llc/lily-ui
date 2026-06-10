<script lang="ts">
/** Avatar size, mapped to the control-height tokens. */
export type AvatarSize = 'sm' | 'md' | 'lg';
/** Presence/status conveyed by the corner dot. */
export type AvatarStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/** Derive up to two uppercase initials from a display name. */
function initialsOf(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0]!.charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : '';
  return (first + last).toUpperCase();
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Avatar — a user/entity thumbnail with image, initials fallback, and an
 * optional presence dot. The accessible name combines `name`/`alt` with the
 * status label so meaning is never color-only.
 *
 * @example
 * ```vue
 * <Avatar name="Ada Lovelace" src="/ada.jpg" status="success" status-label="online" />
 * <Avatar name="Grace Hopper" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Image URL. When set, shows the photo; otherwise initials/slot render. */
    src?: string;
    /** Display name — provides the accessible label and derives the initials. */
    name?: string;
    /** Alternative accessible name when `name` is not the photo subject. */
    alt?: string;
    /** Size token. */
    size?: AvatarSize;
    /** Rounded-square instead of a circle. */
    square?: boolean;
    /** Presence dot. */
    status?: AvatarStatus;
    /** Text describing the status dot, so the meaning is not color-only. */
    statusLabel?: string;
  }>(),
  { size: 'md', square: false },
);

const classes = computed(() =>
  cx('lily-avatar', props.size !== 'md' && `lily-avatar--${props.size}`, props.square && 'lily-avatar--square'),
);

const label = computed(() => {
  const parts = [props.name ?? props.alt, props.status ? (props.statusLabel ?? props.status) : null].filter(
    Boolean,
  ) as string[];
  return parts.length > 0 ? parts.join(', ') : undefined;
});

const initials = computed(() => initialsOf(props.name ?? props.alt));
</script>

<template>
  <span :class="classes" :role="label ? 'img' : undefined" :aria-label="label">
    <img v-if="src" class="lily-avatar__img" :src="src" alt="" aria-hidden="true" />
    <span v-else aria-hidden="true"><slot>{{ initials }}</slot></span>
    <span v-if="status" class="lily-avatar__status" :data-status="status" aria-hidden="true" />
  </span>
</template>
