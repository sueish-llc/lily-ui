<script setup lang="ts">
/** Card header region. */
defineProps<{ as?: string | object }>();
</script>

<template>
  <component :is="as ?? 'div'" class="lily-card__header">
    <slot />
  </component>
</template>
