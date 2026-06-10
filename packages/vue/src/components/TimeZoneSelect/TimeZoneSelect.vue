<script lang="ts">
/** Small fallback list used when `Intl.supportedValuesOf` is unavailable. */
const FALLBACK_ZONES = [
  'UTC',
  'Asia/Tokyo',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Australia/Sydney',
];

/** The available IANA time-zone ids, sourced from the runtime when possible. */
export function supportedTimeZones(): readonly string[] {
  const supported = (
    Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] }
  ).supportedValuesOf;
  if (typeof supported === 'function') {
    try {
      const zones = supported('timeZone');
      if (zones.length > 0) return zones;
    } catch {
      // fall through to the static list
    }
  }
  return FALLBACK_ZONES;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * TimeZoneSelect — choose an IANA time-zone id (e.g. `'Asia/Tokyo'`) from a
 * native `<select>`. The option list comes from `Intl.supportedValuesOf`, with a
 * small static fallback for runtimes that lack it. The value is the IANA id
 * string that the `Temporal` API consumes. Supports `v-model`.
 *
 * @example
 * ```vue
 * <TimeZoneSelect v-model="zone" />
 * ```
 */
const props = withDefaults(
  defineProps<{
    /** Restrict the list to a fixed set of IANA ids (defaults to the runtime list). */
    zones?: readonly string[];
    /** Optional placeholder shown as a disabled first option. */
    placeholder?: string;
    disabled?: boolean;
  }>(),
  { disabled: false },
);

const model = defineModel<string>({ default: '' });

const options = computed(() => props.zones ?? supportedTimeZones());

function onChange(e: Event) {
  model.value = (e.target as HTMLSelectElement).value;
}
</script>

<template>
  <span :class="cx('lily-time-zone-select')">
    <select
      class="lily-select"
      :disabled="disabled"
      :value="model"
      @change="onChange"
    >
      <option v-if="placeholder != null" value="" disabled>{{ placeholder }}</option>
      <option v-for="tz in options" :key="tz" :value="tz">{{ tz }}</option>
    </select>
  </span>
</template>
