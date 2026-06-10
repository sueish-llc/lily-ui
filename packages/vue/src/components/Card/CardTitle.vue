<script setup lang="ts">
/** Card title heading. */
defineProps<{ as?: string | object }>();
</script>

<template>
  <component :is="as ?? 'h3'" class="lily-card__title">
    <slot />
  </component>
</template>
