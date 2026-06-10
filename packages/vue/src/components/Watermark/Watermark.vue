<script setup lang="ts">
import { computed } from 'vue';

/**
 * Watermark — tiles a low-opacity text (or image) overlay across its children.
 * The overlay is `pointer-events: none` and `aria-hidden`; children render
 * normally beneath it.
 *
 * @example
 * ```vue
 * <Watermark text="Confidential" :opacity="0.1">
 *   <p>Protected content</p>
 * </Watermark>
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Text to tile as the watermark. */
    text?: string;
    /** Image URL to tile instead of text. */
    image?: string;
    /** Rotation in degrees. */
    rotate?: number;
    /** Gap between repeated tiles as `[x, y]` in pixels. */
    gap?: [number, number];
    /** Opacity of the overlay (0–1). */
    opacity?: number;
  }>(),
  { rotate: -22, gap: () => [100, 60] as [number, number], opacity: 0.12 },
);

const dataUrl = computed(() => {
  const TILE_W = 200;
  const TILE_H = 120;
  let inner: string;
  if (props.image) {
    const safeHref = props.image.replace(/"/g, '&quot;');
    inner = `<image href="${safeHref}" x="0" y="0" width="${TILE_W}" height="${TILE_H}" preserveAspectRatio="xMidYMid meet" />`;
  } else {
    const safeText = (props.text ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    inner = `<text x="${TILE_W / 2}" y="${TILE_H / 2}" font-size="14" font-family="sans-serif" fill="currentColor" text-anchor="middle" dominant-baseline="middle" transform="rotate(${props.rotate}, ${TILE_W / 2}, ${TILE_H / 2})">${safeText}</text>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}">${inner}</svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
});

const overlayStyle = computed(() => {
  const [gapX, gapY] = props.gap ?? [100, 60];
  return {
    backgroundImage: dataUrl.value,
    backgroundRepeat: 'repeat',
    backgroundSize: `${200 + gapX}px ${120 + gapY}px`,
    opacity: props.opacity,
  };
});
</script>

<template>
  <div class="lily-watermark">
    <slot />
    <div class="lily-watermark__overlay" :style="overlayStyle" aria-hidden="true" />
  </div>
</template>
