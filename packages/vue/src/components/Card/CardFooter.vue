<script setup lang="ts">
/** Card footer region. */
defineProps<{ as?: string | object }>();
</script>

<template>
  <component :is="as ?? 'div'" class="lily-card__footer">
    <slot />
  </component>
</template>
