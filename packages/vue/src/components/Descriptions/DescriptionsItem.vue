<script setup lang="ts">
/**
 * DescriptionsItem — a single key/value pair inside `Descriptions`.
 *
 * @example
 * ```vue
 * <DescriptionsItem term="Version">1.0.0</DescriptionsItem>
 * ```
 */
defineProps<{
  /** The label (term) for this item. */
  term: string;
}>();
</script>

<template>
  <div class="lily-descriptions__item">
    <dt class="lily-descriptions__term">{{ term }}</dt>
    <dd class="lily-descriptions__detail"><slot /></dd>
  </div>
</template>
