// Shared navigation model for the docs (used by both the header hamburger and
// the desktop sidebar). Built server-side in .astro frontmatter; islands only
// receive the resulting plain data as props.

import { categoryGroups, foundationComponents, localizedSummary } from '../registry';
import { foundations } from '../registry/foundations';
import { localePath } from '../i18n/paths';
import { useTranslations, type Locale } from '../i18n/ui';

export interface NavItem {
  label: string;
  href: string;
  /**
   * Lowercased free-text the sidebar search also matches against (id + summary),
   * so a Japanese user can find "Watermark" by typing「透かし」. Not displayed.
   */
  keywords?: string;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Foundations group first, then the component categories. */
export function buildNavGroups(locale: Locale): NavGroup[] {
  // `useTranslations` is a plain factory (not a React hook) despite the name;
  // alias it so the rules-of-hooks lint doesn't misfire in this server helper.
  const translate = useTranslations;
  const t = translate(locale);
  return [
    {
      label: t('nav.foundations'),
      items: [
        ...foundations.map((f) => ({
          label: f.title[locale],
          href: localePath(locale, `foundations/${f.id}/`),
          keywords: `${f.id} ${f.title[locale]} ${f.summary[locale]}`.toLowerCase(),
        })),
        // Foundations-category components (e.g. ThemeOverride) live in the same
        // group as the foundation pages.
        ...foundationComponents.map((c) => ({
          label: c.displayName,
          href: localePath(locale, `components/${c.id}/`),
          keywords:
            `${c.id} ${c.name} ${c.displayName} ${localizedSummary(c, locale).text}`.toLowerCase(),
        })),
      ],
    },
    ...categoryGroups(locale).map((group) => ({
      label: group.label,
      items: group.components.map((c) => ({
        label: c.displayName,
        href: localePath(locale, `components/${c.id}/`),
        keywords:
          `${c.id} ${c.name} ${c.displayName} ${localizedSummary(c, locale).text}`.toLowerCase(),
      })),
    })),
  ];
}
