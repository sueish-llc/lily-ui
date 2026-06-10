<!-- [日本語（正）](../typography.md) | English (translation) -->

# Typography & LINE Seed setup

Lily UI recommends LINE Seed as its primary typeface, with a robust system-font
fallback so the UI is fully usable before/without the web font. LINE Seed is
distributed under the SIL Open Font License, Version 1.1; "LINE Seed" is a font
name owned by its respective rights holders.

## Why the fonts are not bundled

Referencing a typeface by name in `font-family` does not redistribute it, so it
carries no obligations. Bundling the actual font files would, under the OFL,
require shipping the license text and copyright notice alongside them. To keep
things simple, `@lily-ui/css` ships only the `font-family` stack and an
**opt-in** stylesheet of `@font-face` rules (built to `dist/fonts.css`). You host
the files yourself, under the font's own license.

## Setup

1. Download LINE Seed JP from <https://seed.line.me/index_jp.html>.
2. Place the `.woff2` files where your app serves static assets (e.g.
   `public/fonts/`).
3. Load the faces. Either:

   **a) Import the opt-in stylesheet** (expects files at `/fonts`):

   ```ts
   import '@lily-ui/css/styles/fonts';
   ```

   **b) Or compile the SCSS with a custom path:**

   ```scss
   @use '@lily-ui/css/scss/fonts' with ($font-path: '/assets/fonts');
   ```

   **c) Or copy the `@font-face` rules** from
   `packages/css/src/styles/fonts.scss` into your own global CSS.

4. Preload the main weight for performance:

   ```html
   <link rel="preload" href="/fonts/LINESeedJP_A_Rg.woff2" as="font" type="font/woff2" crossorigin />
   ```

## Type scale

Font sizes, weights, line-heights, and letter-spacing are tokens
(`--lily-text-*`, `--lily-weight-*`, `--lily-leading-*`, `--lily-tracking-*`)
and utility classes (`.lily-text-lg`, `.lily-font-bold`, …). The root font size
is never hard-coded — it honors the user's browser setting, so zoom and
"large text" accessibility settings work as expected.

## Japanese typography (和文組版)

Lily UI is **Japanese-first**: the `reset` applies sensible CJK defaults so text
reads well out of the box.

- **Leading (行間):** Japanese needs more breathing room than Latin. Body text
  defaults to `--lily-leading-relaxed` (1.7); long reading passages can use
  `--lily-leading-ja` (1.85). Headings tighten to `--lily-leading-snug`.
- **Tracking (字間):** body text opens up slightly via `--lily-tracking-ja`.
- **Punctuation/kana spacing:** `font-feature-settings: 'palt'` lets the font
  set natural fullwidth punctuation/kana widths instead of manual kerning.
- **Line breaking (禁則 / 文節):** `line-break: strict` keeps punctuation off the
  start of a line; `word-break: auto-phrase` breaks body copy at natural phrase
  boundaries (where supported); `overflow-wrap: anywhere` stops long Latin
  strings/URLs from overflowing on narrow screens.
- **Wrapping balance:** headings use `text-wrap: balance`, body copy uses
  `text-wrap: pretty`, to avoid lonely trailing characters (禁則の泣き別れ).

These are progressive enhancements — browsers that don't support a given
property simply fall back to the previous behavior, never breaking layout.
