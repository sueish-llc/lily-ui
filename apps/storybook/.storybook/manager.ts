import { addons } from '@storybook/manager-api';
import { lilyThemeDark, lilyThemeLight, prefersDark } from './theme';

// Match the manager chrome (sidebar, toolbar, addon panel) to the viewer's OS
// color scheme so a dark-mode user isn't hit with a bright UI. The preview
// canvas tracks the toolbar theme control separately (see preview.tsx).
const applyTheme = () => {
  addons.setConfig({ theme: prefersDark() ? lilyThemeDark : lilyThemeLight });
};

applyTheme();

// Follow the OS if it flips while Storybook is open.
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
}
