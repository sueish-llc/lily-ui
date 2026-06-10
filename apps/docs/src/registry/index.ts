// The merged component catalog: generated metadata + hand-authored overrides.
// This is what pages consume.

import type { Locale } from '../i18n/ui';
import { generatedComponents, type GeneratedComponent, type PropDoc, type PropControl } from './components.generated';
import { overrides, CATEGORY_ORDER, CATEGORY_LABELS } from './overrides';

export type { PropDoc, PropControl, GeneratedComponent };

export type Component = GeneratedComponent;

/** All components, sorted by display name. */
export const components: Component[] = [...generatedComponents].sort((a, b) =>
  a.displayName.localeCompare(b.displayName),
);

export function getComponent(id: string): Component | undefined {
  return components.find((c) => c.id === id);
}

export interface LocalizedText {
  text: string;
  /** True when we fell back to English because no localized copy exists. */
  pending: boolean;
}

/** Resolve a component's summary for a locale, with graceful fallback. */
export function localizedSummary(component: Component, locale: Locale): LocalizedText {
  const ov = overrides[component.name]?.summary;
  const localized = ov?.[locale];
  if (localized) return { text: localized, pending: false };

  if (locale === 'ja') {
    // No Japanese copy yet — fall back to English (override or generated).
    const en = ov?.en ?? component.summary;
    return { text: en ?? '', pending: Boolean(en) };
  }
  // English: prefer override, else the TSDoc-derived summary.
  const en = ov?.en ?? component.summary;
  return { text: en ?? '', pending: false };
}

export interface CategoryGroup {
  id: string;
  label: string;
  components: Component[];
}

/**
 * Components whose story category is Foundations (e.g. ThemeOverride). They are
 * shown inside the hand-authored Foundations section (next to colors, motion,
 * scales) instead of forming a second group with the same label.
 */
export const foundationComponents: Component[] = components.filter(
  (c) => c.category === 'Foundations',
);

/**
 * Components grouped by category in the canonical display order. Foundations
 * is skipped here — its members render with the foundations pages instead.
 */
export function categoryGroups(locale: Locale): CategoryGroup[] {
  const groups: CategoryGroup[] = [];
  for (const id of CATEGORY_ORDER) {
    if (id === 'Foundations') continue;
    const members = components.filter((c) => c.category === id);
    if (!members.length) continue;
    groups.push({ id, label: CATEGORY_LABELS[id]?.[locale] ?? id, components: members });
  }
  // Any category not in CATEGORY_ORDER (defensive) appended alphabetically.
  const known = new Set(CATEGORY_ORDER as readonly string[]);
  const extra = [...new Set(components.map((c) => c.category))].filter((c) => !known.has(c)).sort();
  for (const id of extra) {
    groups.push({
      id,
      label: CATEGORY_LABELS[id]?.[locale] ?? id,
      components: components.filter((c) => c.category === id),
    });
  }
  return groups;
}

export function categoryLabel(category: string, locale: Locale): string {
  return CATEGORY_LABELS[category]?.[locale] ?? category;
}
