import { create } from '@storybook/theming/create';

// Brand the Storybook chrome with the same 彩 worldview as the docs site:
// 笹百合 (rose) as the primary, 藤 (fuji) as the accent, on the warm neutral
// canvas. A light and a dark variant are provided so the manager UI, Autodocs,
// and the preview can follow the viewer's OS color scheme instead of always
// rendering bright. Values mirror the semantic tokens in
// packages/css/src/styles/themes/_schemes.scss.
const palette = {
  light: {
    primary: '#871d5e', // brand-700
    secondary: '#8442c6', // fuji-500
    appBg: '#faf9f7', // neutral-50
    appContentBg: '#ffffff', // neutral-0
    border: '#e6e2db', // neutral-200
    text: '#14110e', // neutral-900
    textInverse: '#faf9f7',
    textMuted: '#5c554d',
  },
  dark: {
    primary: '#ef88c1', // brand-300
    secondary: '#ba94e4', // fuji-300
    appBg: '#0b0908', // neutral-950
    appContentBg: '#14110e', // neutral-900
    border: '#38332d', // neutral-700
    text: '#faf9f7', // neutral-50
    textInverse: '#14110e',
    textMuted: '#d3cdc4', // neutral-300
  },
} as const;

const fontBase = "'LINE Seed JP', system-ui, -apple-system, sans-serif";
const fontCode =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

// A small 笹百合 (lily) bloom + "Lily UI" wordmark, inlined as a data URI so it
// needs no static-file hosting and works under any base path. Two variants keep
// the wordmark legible on the light and dark manager backgrounds; the petals
// use each theme's primary→accent gradient.
function brandLogo(mode: 'light' | 'dark'): string {
  const stop1 = mode === 'light' ? '#e6549f' : '#ef88c1';
  const stop2 = mode === 'light' ? '#8442c6' : '#ba94e4';
  const heart = mode === 'light' ? '#ffffff' : '#14110e';
  const text = palette[mode].text;
  const petal = (deg: number) =>
    `<ellipse cx="0" cy="-5.4" rx="2.5" ry="5.4" transform="rotate(${deg})"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="28" viewBox="0 0 120 28" fill="none">
<defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${stop1}"/><stop offset="1" stop-color="${stop2}"/></linearGradient></defs>
<g transform="translate(14 14)" fill="url(#p)">${[0, 72, 144, 216, 288].map(petal).join('')}</g>
<circle cx="14" cy="14" r="2.1" fill="${heart}"/>
<text x="32" y="19.5" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="15.5" font-weight="700" fill="${text}">Lily UI</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function makeTheme(mode: 'light' | 'dark') {
  const c = palette[mode];
  return create({
    base: mode,

    brandTitle: 'Lily UI',
    brandImage: brandLogo(mode),
    // Storybook lives one level under the brand site (…/storybook/), so a
    // relative parent link returns to the brand root on both GitHub Pages and
    // any other host without hard-coding the base path.
    brandUrl: '../',
    brandTarget: '_self',

    colorPrimary: c.primary,
    colorSecondary: c.secondary,

    appBg: c.appBg,
    appContentBg: c.appContentBg,
    appPreviewBg: c.appBg,
    appBorderColor: c.border,
    appBorderRadius: 12,

    textColor: c.text,
    textInverseColor: c.textInverse,
    textMutedColor: c.textMuted,

    barBg: c.appContentBg,
    barTextColor: c.textMuted,
    barSelectedColor: c.primary,
    barHoverColor: c.primary,

    inputBg: c.appContentBg,
    inputBorder: c.border,
    inputTextColor: c.text,
    inputBorderRadius: 8,

    fontBase,
    fontCode,
  });
}

export const lilyThemeLight = makeTheme('light');
export const lilyThemeDark = makeTheme('dark');

/** True when the viewer's OS asks for a dark color scheme. */
export function prefersDark(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

/** The brand theme matching the viewer's OS color scheme (light fallback). */
export function pickLilyTheme() {
  return prefersDark() ? lilyThemeDark : lilyThemeLight;
}
