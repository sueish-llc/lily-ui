<script setup lang="ts">
import { computed, useId } from 'vue';
import { cx } from '../../utils/cx';

const STAR = '★';

/**
 * Rating — a star rating. Interactive by default (native radios → arrow keys);
 * `read-only` renders a labeled, non-interactive display. Bind with `v-model`.
 *
 * @example
 * ```vue
 * <Rating v-model="score" label="評価" />
 * <Rating :model-value="4" read-only />
 * ```
 */
const props = withDefaults(
  defineProps<{
    max?: number;
    name?: string;
    size?: 'sm' | 'md' | 'lg';
    readOnly?: boolean;
    disabled?: boolean;
    label?: string;
    starLabel?: (n: number, max: number) => string;
  }>(),
  {
    max: 5,
    size: 'md',
    readOnly: false,
    disabled: false,
    label: 'Rating',
    starLabel: (n: number, m: number) => `${n} / ${m}`,
  },
);

const model = defineModel<number>({ default: 0 });
const autoName = useId();
const name = computed(() => props.name ?? autoName);
const classes = computed(() => cx('lily-rating', props.size !== 'md' && `lily-rating--${props.size}`));
const stars = computed(() => Array.from({ length: props.max }, (_, i) => i + 1));
</script>

<template>
  <span v-if="readOnly" :class="classes" role="img" :aria-label="starLabel(model, max)">
    <span
      v-for="n in stars"
      :key="n"
      :class="cx('lily-rating__star', n <= model && 'lily-rating__star--on')"
      aria-hidden="true"
      >{{ STAR }}</span
    >
  </span>
  <div v-else :class="classes" role="radiogroup" :aria-label="label">
    <label v-for="n in stars" :key="n" class="lily-rating__label">
      <input
        type="radio"
        class="lily-visually-hidden"
        :name="name"
        :value="n"
        :checked="model === n"
        :disabled="disabled"
        :aria-label="starLabel(n, max)"
        @change="model = n"
      />
      <span :class="cx('lily-rating__star', n <= model && 'lily-rating__star--on')" aria-hidden="true">{{ STAR }}</span>
    </label>
  </div>
</template>
