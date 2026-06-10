<!-- English | [日本語](README.ja.md) -->

# @lily-ui/react

Accessible (WCAG 2.1 AAA), SSR/SSG-ready **React component library** for Lily UI.
It provides markup, behavior, ARIA wiring, and types; the visual styling comes
from [`@lily-ui/css`](../css).

## Install

```bash
pnpm add @lily-ui/react @lily-ui/css
```

```tsx
// App entry (once):
import '@lily-ui/css/styles';

import { ThemeProvider, Button } from '@lily-ui/react';

export function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Button status="primary" onClick={() => alert('こんにちは')}>
        こんにちは
      </Button>
    </ThemeProvider>
  );
}
```

For dark mode without a flash, render `<ThemeScript />` in your document
`<head>`. See [theming docs](../../docs/theming.md).

## Type-safe tokens

```ts
import { cssVar } from '@lily-ui/react/tokens';

const style = { color: cssVar('color-primary') }; // "var(--lily-color-primary)"
```

## Develop

```bash
pnpm --filter @lily-ui/react test        # unit + a11y
pnpm --filter @lily-ui/react build       # ESM + CJS + d.ts
```
