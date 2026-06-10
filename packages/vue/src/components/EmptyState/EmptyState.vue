<script setup lang="ts">
/**
 * EmptyState — a centered placeholder for empty lists / no results / errors.
 * Use the `#icon` and `#actions` slots for the illustration and buttons.
 *
 * @example
 * ```vue
 * <EmptyState title="まだ何もありません" description="最初の項目を追加しましょう。">
 *   <template #actions><Button>追加</Button></template>
 * </EmptyState>
 * ```
 */
defineProps<{ title: string; description?: string }>();
</script>

<template>
  <div class="lily-empty-state">
    <span v-if="$slots.icon" class="lily-empty-state__icon" aria-hidden="true"><slot name="icon" /></span>
    <p class="lily-empty-state__title">{{ title }}</p>
    <p v-if="description" class="lily-empty-state__description">{{ description }}</p>
    <div v-if="$slots.actions" class="lily-empty-state__actions"><slot name="actions" /></div>
  </div>
</template>
