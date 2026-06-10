<!-- [日本語（正）](../theming.md) | English (translation) -->

# Theming & dark mode

## How it works

All themeable values are **CSS custom properties** (`--lily-*`) emitted from the
SCSS in `@lily-ui/css`:

- `:root` carries the **light** scheme + all primitive tokens (correct for SSR).
- `:root[data-theme="dark"]` overrides the semantic color variables.
- When no `data-theme` is set, `prefers-color-scheme` decides automatically.

Switching themes is therefore a single attribute change — no component
re-rendering, no JS required for the default render.

## React usage

```tsx
import { ThemeProvider, useTheme } from '@lily-ui/react';

function ThemeToggle() {
  const { resolvedTheme, toggle } = useTheme();
  return <button onClick={toggle}>{resolvedTheme === 'dark' ? '🌙' : '☀️'}</button>;
}

<ThemeProvider defaultMode="system">{/* ... */}</ThemeProvider>;
```

- `mode`: `'light' | 'dark' | 'system'`
- `resolvedTheme`: the concrete `'light' | 'dark'` currently applied
- `setMode(mode)` / `toggle()`

## Avoiding the flash (FOUC) on SSR/SSG

Render the tiny inline script in `<head>` so the stored theme is applied before
hydration:

```tsx
// app/layout.tsx (Next.js)
import { ThemeScript } from '@lily-ui/react';

export default function RootLayout({ children }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Custom color themes / brand overrides

Because everything is a CSS variable, you can re-skin the system by overriding
semantic tokens — no rebuild required:

```css
:root {
  --lily-color-primary: #7c3aed;
  --lily-color-primary-hover: #6d28d9;
  --lily-color-on-primary: #ffffff;
}
[data-theme='dark'] {
  --lily-color-primary: #a78bfa;
}
```

Or define a brand-specific scope and switch to it:

```css
[data-theme='brand-x'] {
  --lily-color-primary: #ff6f00;
}
```

```tsx
document.documentElement.setAttribute('data-theme', 'brand-x');
```

> **Accessibility:** when overriding colors, keep text/background pairs at
> WCAG AAA contrast (≥ 7:1 body, ≥ 4.5:1 large text, ≥ 3:1 UI). See
> [accessibility.md](accessibility.md).
