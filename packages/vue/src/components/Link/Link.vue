<script lang="ts">
export type LinkStatus = 'primary' | 'danger' | 'success' | 'warning' | 'info';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Link — a styled anchor using the AAA `*-text` color tokens with a visible
 * focus ring.
 *
 * @example
 * ```vue
 * <Link href="/docs">ドキュメント</Link>
 * <Link href="https://example.com" external>外部サイト</Link>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Color role. */
    status?: LinkStatus;
    /** Inherit text color until hover. */
    quiet?: boolean;
    /** Open in a new tab: sets `target`/`rel`, shows an arrow + hidden hint. */
    external?: boolean;
  }>(),
  { status: 'primary', quiet: false, external: false },
);

const classes = computed(() =>
  cx('lily-link', props.quiet && 'lily-link--quiet', props.external && 'lily-link--external'),
);
</script>

<template>
  <a
    :class="classes"
    :data-status="status !== 'primary' ? status : undefined"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <slot />
    <span v-if="external" class="lily-visually-hidden"> (opens in new tab)</span>
  </a>
</template>
