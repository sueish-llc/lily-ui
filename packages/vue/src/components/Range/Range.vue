<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../../composables/field';

/**
 * Range — a slider control (`<input type="range">`). Supports `v-model`.
 *
 * Inside a {@link FormField} it inherits `id`, `aria-describedby`,
 * `aria-invalid`, and `required` automatically. Provide an `aria-label`
 * or a FormField label so the slider is named.
 *
 * @example
 * ```vue
 * <FormField label="Volume"><Range min="0" max="100" v-model="vol" /></FormField>
 * ```
 */
defineProps<{
  /** Bound value (`v-model`). */
  modelValue?: string | number;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const fieldAttrs = useFieldControl(() => ({}));

const classes = computed(() => cx('lily-range'));
</script>

<template>
  <input
    type="range"
    :class="classes"
    v-bind="fieldAttrs"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
