<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../../composables/field';

/**
 * Input — a single-line text control. Supports `v-model`.
 *
 * Inside a {@link FormField} it inherits `id`, `aria-describedby`,
 * `aria-invalid`, and `required` automatically.
 *
 * @example
 * ```vue
 * <FormField label="Name"><Input v-model="name" /></FormField>
 * <Input type="email" aria-label="Email" v-model="email" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Bound value (`v-model`). */
    modelValue?: string | number;
    /** Control size. */
    size?: 'sm' | 'md' | 'lg';
  }>(),
  { size: 'md' },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const fieldAttrs = useFieldControl(() => ({}));

const classes = computed(() =>
  cx('lily-input', props.size !== 'md' && `lily-input--${props.size}`),
);
</script>

<template>
  <input
    :class="classes"
    v-bind="fieldAttrs"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
