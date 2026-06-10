<!-- English | [日本語](README.ja.md) -->

# @lily-ui/css

The framework-agnostic **CSS design library** of Lily UI: design tokens, themes
(light / dark / custom), an atomic utility-class layer, and component styles.
Use it on its own (plain HTML, Vue, Svelte, …) or together with
[`@lily-ui/react`](../react).

## Install

```bash
pnpm add @lily-ui/css
```

```ts
// Once, at your app entry:
import '@lily-ui/css/styles';
```

## What you get

- **Design tokens** as `--lily-*` CSS custom properties (color, spacing,
  typography, radius, shadow, motion, z-index, breakpoints).
- **Theming** via `data-theme` (`light` / `dark`) with automatic
  `prefers-color-scheme` fallback. Override any token to re-skin.
- **Utility classes** (`.lily-p-4`, `.lily-flex`, `.lily-text-muted`, …) with
  mobile-first responsive variants (`.lily-md\:flex`).
- **Component styles** (`.lily-button`, …) — markup-agnostic.

## Using the SCSS source

If you build SCSS, consume the tokens/mixins directly:

```scss
@use '@lily-ui/css/scss' as lily;

.my-card {
  padding: lily.var-ref('space-4');
  background: lily.var-ref('color-bg-surface');
  border-radius: lily.var-ref('radius-lg');
}
```

## Build

```bash
pnpm --filter @lily-ui/css build   # -> dist/lily-ui.css + dist/fonts.css
```

See the repo root docs for [theming](../../docs/theming.md),
[tokens](../../docs/tokens.md), [accessibility](../../docs/accessibility.md),
and [typography](../../docs/typography.md).
