<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

export type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500';

/** Default icons for each status (text glyphs — not color-only). */
const DEFAULT_ICONS: Record<ResultStatus, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
  '404': '?',
  '403': '⊘',
  '500': '☇',
};

const STATUS_LABELS: Record<ResultStatus, string> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  '404': 'not found',
  '403': 'forbidden',
  '500': 'server error',
};

/**
 * Result — a feedback block that reports the outcome of an operation.
 * Use the `#icon` slot to override the default status icon.
 * Use the `#actions` slot or default slot for action buttons.
 *
 * @example
 * ```vue
 * <Result status="success" title="送信完了" description="受け付けました。">
 *   <template #actions><Button>トップへ戻る</Button></template>
 * </Result>
 * ```
 */
const props = defineProps<{
  /** Semantic status. Controls the icon and (via CSS) the icon color. */
  status: ResultStatus;
  /** Short heading. */
  title: string;
  /** Supporting description. */
  description?: string;
}>();

const classes = computed(() => cx('lily-result', `lily-result--${props.status}`));
const defaultIcon = computed(() => DEFAULT_ICONS[props.status]);
const statusLabel = computed(() => STATUS_LABELS[props.status]);
</script>

<template>
  <div :class="classes">
    <span
      v-if="!$slots.icon"
      class="lily-result__icon"
      role="img"
      :aria-label="statusLabel"
    >{{ defaultIcon }}</span>
    <span v-else class="lily-result__icon">
      <slot name="icon" />
    </span>
    <p class="lily-result__title">{{ title }}</p>
    <p v-if="description" class="lily-result__description">{{ description }}</p>
    <div v-if="$slots.actions || $slots.default" class="lily-result__actions">
      <slot name="actions"><slot /></slot>
    </div>
  </div>
</template>
