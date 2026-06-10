<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';
import { useFieldControl } from '../../composables/field';

/**
 * Textarea — a multi-line text control. Supports `v-model`.
 *
 * Inside a {@link FormField} it inherits `id`, `aria-describedby`,
 * `aria-invalid`, and `required` automatically.
 *
 * @example
 * ```vue
 * <FormField label="Bio"><Textarea rows={4} /></FormField>
 * <Textarea aria-label="Notes" v-model="notes" />
 * ```
 */
defineProps<{
  /** Bound value (`v-model`). */
  modelValue?: string;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const fieldAttrs = useFieldControl(() => ({}));

const classes = computed(() => cx('lily-textarea'));
</script>

<template>
  <textarea
    :class="classes"
    v-bind="fieldAttrs"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  ><slot /></textarea>
</template>
