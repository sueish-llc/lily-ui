/**
 * Story i18n helper (Storybook only — not part of the public package surface).
 *
 * Stories carry bilingual demo copy and switch language via the Storybook
 * toolbar (the `locale` global). Read the locale from the story `context`
 * (`(args, { globals }) => …`) and build a translator:
 *
 * ```tsx
 * import { makeT, type StoryLocale } from '../../storybook/i18n';
 *
 * export const Demo: Story = {
 *   render: (_args, { globals }) => {
 *     const t = makeT(globals.locale as StoryLocale);
 *     return <FormField label={t('Recipients', '宛先')}>…</FormField>;
 *   },
 * };
 * ```
 *
 * The default language follows the viewer's Accept-Language (browser
 * `navigator.languages`), falling back to **English** for anything else.
 */
export type StoryLocale = 'en' | 'ja';

/** Toolbar items for the Storybook `locale` global. */
export const STORY_LOCALES = [
  { value: 'en', title: 'English', right: '🇬🇧' },
  { value: 'ja', title: '日本語', right: '🇯🇵' },
] as const;

/**
 * Pick the initial locale from the viewer's Accept-Language (the browser
 * exposes it via `navigator.languages`). English is the fallback for any
 * non-Japanese preference (and for non-browser environments).
 */
export function detectStoryLocale(): StoryLocale {
  if (typeof navigator !== 'undefined') {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const lang of langs) {
      const l = (lang ?? '').toLowerCase();
      if (l.startsWith('ja')) return 'ja';
      if (l.startsWith('en')) return 'en';
    }
  }
  return 'en';
}

/** Default toolbar locale: viewer's Accept-Language, or English. */
export const DEFAULT_STORY_LOCALE: StoryLocale = detectStoryLocale();

/**
 * Build a translator for the active locale. Call as `t(english, japanese)` so
 * both languages live together at the call site. Anything other than `'ja'`
 * resolves to English (the fallback language).
 */
export function makeT(locale: StoryLocale | undefined) {
  const l: StoryLocale = locale === 'ja' ? 'ja' : 'en';
  return (en: string, ja: string): string => (l === 'ja' ? ja : en);
}
