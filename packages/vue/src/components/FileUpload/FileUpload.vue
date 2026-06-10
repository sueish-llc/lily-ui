<script lang="ts">
/** Human-readable byte size. */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { cx } from '../../utils/cx';

/**
 * FileUpload — a drag-and-drop dropzone with a selected-file list. The dropzone
 * is a real button (keyboard operable) for a hidden file input. Bind the file
 * list with `v-model`.
 *
 * @example
 * ```vue
 * <FileUpload v-model="files" multiple accept="image/*" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    label?: string;
    hint?: string;
    removeLabel?: (name: string) => string;
    inputLabel?: string;
    id?: string;
    name?: string;
  }>(),
  {
    multiple: false,
    disabled: false,
    label: 'ファイルをドラッグ、またはクリックして選択',
    removeLabel: (n: string) => `Remove ${n}`,
    inputLabel: 'ファイルを選択',
  },
);

const model = defineModel<File[]>({ default: () => [] });
const dragging = ref(false);
const inputEl = ref<HTMLInputElement>();
const hintId = computed(() => (props.hint && props.id ? `${props.id}-hint` : undefined));

function accept_(incoming: File[]): void {
  model.value = props.multiple ? [...model.value, ...incoming] : incoming.slice(0, 1);
}
function onDrop(e: DragEvent): void {
  e.preventDefault();
  dragging.value = false;
  if (props.disabled) return;
  accept_(Array.from(e.dataTransfer?.files ?? []));
}
function onInput(e: Event): void {
  accept_(Array.from((e.target as HTMLInputElement).files ?? []));
}
function removeAt(i: number): void {
  model.value = model.value.filter((_, idx) => idx !== i);
}
</script>

<template>
  <div class="lily-file-upload">
    <button
      type="button"
      :class="cx('lily-file-upload__dropzone', dragging && 'lily-file-upload__dropzone--dragging')"
      :disabled="disabled"
      :aria-describedby="hintId"
      @click="inputEl?.click()"
      @dragover.prevent="!disabled && (dragging = true)"
      @dragleave="dragging = false"
      @drop="onDrop"
    >
      <span>{{ label }}</span>
      <span v-if="hint" :id="hintId" class="lily-file-upload__hint">{{ hint }}</span>
    </button>
    <input
      :id="id"
      ref="inputEl"
      class="lily-file-upload__input"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      :tabindex="-1"
      :aria-label="inputLabel"
      @change="onInput"
    />
    <ul v-if="model.length > 0" class="lily-file-upload__list">
      <li v-for="(file, i) in model" :key="`${file.name}-${i}`" class="lily-file-upload__item">
        <span>{{ file.name }}</span>
        <span class="lily-file-upload__size">{{ formatBytes(file.size) }}</span>
        <button type="button" class="lily-chip__remove" :aria-label="removeLabel(file.name)" @click="removeAt(i)">
          <span aria-hidden="true">×</span>
        </button>
      </li>
    </ul>
  </div>
</template>
