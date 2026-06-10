<script setup lang="ts">
import { computed, ref } from 'vue';
import { cx } from '../../utils/cx';

/**
 * Image — a media wrapper with lazy-loading, fade-in, optional fixed aspect
 * ratio, and a graceful fallback when the source fails.
 *
 * @example
 * ```vue
 * <Image src="/p.jpg" alt="製品" :ratio="16 / 9" rounded />
 * ```
 */
const props = withDefaults(
  defineProps<{
    src: string;
    alt: string;
    fallback?: string;
    ratio?: number | [number, number];
    rounded?: boolean;
    loading?: 'lazy' | 'eager';
  }>(),
  { rounded: false, loading: 'lazy' },
);

const loaded = ref(false);
const errored = ref(false);
const aspect = computed(() => (Array.isArray(props.ratio) ? props.ratio[0] / props.ratio[1] : props.ratio));
</script>

<template>
  <div
    :class="cx('lily-image', rounded && 'lily-image--rounded', !loaded && !errored && 'lily-image--loading')"
    :style="{ aspectRatio: aspect }"
  >
    <div v-if="errored" class="lily-image__fallback">{{ fallback ?? alt }}</div>
    <img
      v-else
      class="lily-image__img"
      :src="src"
      :alt="alt"
      :loading="loading"
      @load="loaded = true"
      @error="errored = true"
    />
  </div>
</template>
