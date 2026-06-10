<script setup lang="ts">
import { ref } from 'vue';
import { cx } from '../../utils/cx';
import Chip from '../Chip/Chip.vue';

/**
 * TagInput — collect multiple tokens. Type and press Enter (or a delimiter) to
 * add; Backspace on an empty field removes the last tag. Bind with `v-model`.
 *
 * @example
 * ```vue
 * <TagInput v-model="emails" label="宛先" placeholder="メールを入力" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    placeholder?: string;
    delimiters?: string[];
    unique?: boolean;
    disabled?: boolean;
    label?: string;
    removeLabel?: (tag: string) => string;
    id?: string;
  }>(),
  { unique: true, disabled: false, delimiters: () => [','], removeLabel: (t: string) => `Remove ${t}` },
);

const model = defineModel<string[]>({ default: () => [] });
const draft = ref('');
const inputEl = ref<HTMLInputElement>();

function addTag(raw: string): void {
  const t = raw.trim();
  if (!t) return;
  if (props.unique && model.value.includes(t)) {
    draft.value = '';
    return;
  }
  model.value = [...model.value, t];
  draft.value = '';
}
function removeAt(i: number): void {
  model.value = model.value.filter((_, idx) => idx !== i);
}
function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter' || props.delimiters.includes(e.key)) {
    e.preventDefault();
    addTag(draft.value);
  } else if (e.key === 'Backspace' && draft.value === '' && model.value.length > 0) {
    removeAt(model.value.length - 1);
  }
}
</script>

<template>
  <div
    :class="cx('lily-tag-input', disabled && 'lily-tag-input--disabled')"
    role="group"
    :aria-label="label"
    @click="inputEl?.focus()"
  >
    <Chip
      v-for="(tag, i) in model"
      :key="`${tag}-${i}`"
      removable
      :remove-label="removeLabel(tag)"
      @remove="removeAt(i)"
      >
{{ tag }}
</Chip
    >
    <input
      :id="id"
      ref="inputEl"
      class="lily-tag-input__field"
      :value="draft"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="draft = ($event.target as HTMLInputElement).value"
      @keydown="onKeydown"
      @blur="addTag(draft)"
    />
  </div>
</template>
