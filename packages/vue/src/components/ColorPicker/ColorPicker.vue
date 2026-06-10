<script lang="ts">
/** A friendly default palette drawn from the 彩 worldview + neutrals. */
export const DEFAULT_SWATCHES = ['#cd2e69', '#f05537', '#ee4d7a', '#e89c0c', '#2f7a43', '#41549f', '#534d45', '#14110e'];
</script>

<script setup lang="ts">
import { useId } from 'vue';
import { cx } from '../../utils/cx';

/**
 * ColorPicker — a palette of preset swatches plus an optional native custom
 * color input. Bind the hex value with `v-model`.
 *
 * @example
 * ```vue
 * <ColorPicker v-model="color" label="テーマ色" />
 * ```
 */
withDefaults(defineProps<{ swatches?: string[]; custom?: boolean; customLabel?: string; label?: string }>(), {
  swatches: () => DEFAULT_SWATCHES,
  custom: true,
  customLabel: 'Custom',
});

const model = defineModel<string>({ default: '#cd2e69' });
const customId = useId();
</script>

<template>
  <div :class="cx('lily-color-picker')">
    <div class="lily-color-picker__swatches" role="group" :aria-label="label ?? 'Color'">
      <button
        v-for="hex in swatches"
        :key="hex"
        type="button"
        class="lily-color-picker__swatch"
        :style="{ backgroundColor: hex }"
        :aria-label="hex"
        :aria-pressed="model.toLowerCase() === hex.toLowerCase()"
        @click="model = hex"
      />
    </div>
    <span v-if="custom" class="lily-color-picker__custom">
      <label :for="customId">{{ customLabel }}</label>
      <input
        :id="customId"
        type="color"
        class="lily-color-picker__input"
        :value="model"
        @input="model = ($event.target as HTMLInputElement).value"
      />
    </span>
  </div>
</template>
