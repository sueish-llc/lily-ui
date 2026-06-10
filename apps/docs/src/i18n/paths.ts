import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Locale } from './ui';

/** Base-aware, locale-prefixed URL for a path like 'components/button/'. */
export function localePath(locale: Locale, path = ''): string {
  return getRelativeLocaleUrl(locale, path);
}
