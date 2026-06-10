<!-- English | [日本語](README.ja.md) -->

# @lily-ui/vue

Accessible (WCAG 2.1 AAA), SSR/SSG-ready **Vue 3 component library** for Lily UI.
It provides markup, behavior, ARIA wiring, and types; the visual styling comes
from [`@lily-ui/css`](../css). The component set mirrors
[`@lily-ui/react`](../react) one-for-one — same class names, same DOM, same
accessibility.

## Install

```bash
pnpm add @lily-ui/vue @lily-ui/css vue
```

```vue
<script setup lang="ts">
// App entry (import the CSS once):
import '@lily-ui/css/styles';
import { ThemeProvider, Button } from '@lily-ui/vue';
</script>

<template>
  <ThemeProvider default-mode="system">
    <Button status="primary" @click="$emit('hello')">こんにちは</Button>
  </ThemeProvider>
</template>
```

## Conventions

- Components are named exports: `import { Button, Card, CardHeader } from '@lily-ui/vue'`.
- Shared props match the design system (`status`, `size`, `variant`, `block`),
  and a user-supplied `class` is merged automatically.
- Two-way state uses `v-model`: `<Input v-model="name" />`,
  `<Modal v-model:open="open" />`, `<Tabs v-model="activeId" :items="…" />`.
- Rich content (`title`, `icon`, a Dropdown trigger, …) is provided via named
  slots; simple string props are also accepted where natural.
- Overlays (`Modal`, `Offcanvas`, `ToastProvider`) portal with `<Teleport>` and
  handle focus trapping, scroll lock, and Escape/backdrop dismissal for you.

## Theming

`ThemeProvider` keeps `<html data-theme>` in sync. To avoid a flash of the
wrong theme during SSR hydration, inject `themeScript()` into your document
`<head>` (e.g. via Nuxt `useHead`). See the [theming docs](../../docs/theming.md)
and [framework-ports](../../docs/framework-ports.md).

## Type-safe tokens

```ts
import { cssVar } from '@lily-ui/vue/tokens';

const style = { color: cssVar('color-primary') }; // "var(--lily-color-primary)"
```

## Develop

```bash
pnpm --filter @lily-ui/vue build       # ESM + CJS + d.ts (vue-tsc)
pnpm --filter @lily-ui/vue typecheck
```
