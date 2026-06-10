<script lang="ts">
export type TimelineStatus = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export interface TimelineItem {
  title: string;
  time?: string;
  description?: string;
  status?: TimelineStatus;
}
</script>

<script setup lang="ts">
/**
 * Timeline — a vertical list of events (history / activity feed).
 *
 * @example
 * ```vue
 * <Timeline :items="[{ title: '注文', time: '10:00', status: 'success' }]" />
 * ```
 */
defineProps<{ items: TimelineItem[] }>();
</script>

<template>
  <ol class="lily-timeline">
    <li v-for="(item, i) in items" :key="i" class="lily-timeline__item">
      <span
        class="lily-timeline__dot"
        :data-status="item.status && item.status !== 'neutral' ? item.status : undefined"
        aria-hidden="true"
      />
      <div class="lily-timeline__content">
        <p class="lily-timeline__title">{{ item.title }}</p>
        <span v-if="item.time != null" class="lily-timeline__time">{{ item.time }}</span>
        <p v-if="item.description != null" class="lily-timeline__description">{{ item.description }}</p>
      </div>
    </li>
  </ol>
</template>
