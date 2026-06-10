import type { Preview } from '@storybook/react';
import { useEffect } from 'react';
// Install the Temporal API global for the in-browser preview. Native support is
// still rolling out across browsers, so the polyfill guarantees components like
// DatePicker work everywhere Storybook is viewed (it also supplies the global
// `Temporal` types used by the stories' TypeScript).
import 'temporal-polyfill/global';
import { ThemeProvider, useTheme } from '@lily-ui/react';
// Register the Lily custom elements so the Web Components variant of the
// cross-framework stories works (see ../src/multiframework.tsx).
import { defineLilyElements } from '@lily-ui/web-components';
import { FRAMEWORKS } from '../src/multiframework';
import { STORY_LOCALES, DEFAULT_STORY_LOCALE } from '../../../packages/react/src/storybook/i18n';
import { pickLilyTheme, prefersDark } from './theme';
// Load the full design-system stylesheet from the CSS package (SCSS source so
// changes show up live during development).
import '@lily-ui/css/scss';

defineLilyElements();

/** Bridges the Storybook toolbar theme control to <html data-theme>. */
function ThemeSync({ theme }: { theme: 'light' | 'dark' }) {
  const { setMode } = useTheme();
  useEffect(() => setMode(theme), [theme, setMode]);
  return null;
}

/** Bridges the Storybook toolbar locale control to <html lang> (affects JA line-breaking). */
function LocaleSync({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}

/** Bridges the Storybook toolbar motion control to <html data-motion> (the tier axis). */
function MotionSync({ motion }: { motion: string }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-motion', motion);
  }, [motion]);
  return null;
}

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // Order the sidebar by what a component is, matching the docs catalog, with
    // the Introduction cover first and anything uncategorised last.
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          'Layout',
          'Typography',
          'Actions',
          'Data Display',
          'Media',
          'Forms',
          'Navigation',
          'Disclosure',
          'Feedback',
          'Overlay',
          'Cross-framework',
          '*',
        ],
      },
    },
    // Enforce WCAG 2.1 AAA in the a11y panel: enable axe's enhanced (7:1)
    // contrast rule, which is off by default (it only checks AA / 4.5:1).
    a11y: {
      test: 'error',
      config: {
        rules: [
          { id: 'color-contrast-enhanced', enabled: true },
          // The base AA contrast rule is redundant once enhanced is on.
          { id: 'color-contrast', enabled: false },
        ],
      },
    },
    backgrounds: { disable: true },
    // Brand the Autodocs pages with the 彩 theme matching the viewer's OS scheme.
    docs: { theme: pickLilyTheme() },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      // Open in the viewer's OS scheme so a dark-mode user isn't blinded; they
      // can still switch from the toolbar.
      defaultValue: prefersDark() ? 'dark' : 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    framework: {
      description: 'Implementation (cross-framework stories)',
      defaultValue: 'react',
      toolbar: {
        title: 'Framework',
        icon: 'beaker',
        items: FRAMEWORKS,
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Demo language',
      defaultValue: DEFAULT_STORY_LOCALE,
      toolbar: {
        title: 'Language',
        icon: 'globe',
        items: STORY_LOCALES.map(({ value, title, right }) => ({ value, title, right })),
        dynamicTitle: true,
      },
    },
    motion: {
      description: '動きの強さ',
      defaultValue: 'full',
      toolbar: {
        title: 'Motion',
        icon: 'lightning',
        items: [
          { value: 'full', title: 'Full（なめらか）' },
          { value: 'minimal', title: 'Minimal（控えめ）' },
          { value: 'none', title: 'None（無効）' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider defaultMode={context.globals.theme} enablePersistence={false}>
        <ThemeSync theme={context.globals.theme} />
        <LocaleSync locale={context.globals.locale} />
        <MotionSync motion={context.globals.motion} />
        <div
          className="lily-p-8"
          style={{
            background: 'var(--lily-color-bg-canvas)',
            color: 'var(--lily-color-fg-default)',
            minHeight: '100vh',
          }}
        >
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
