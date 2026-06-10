<!-- English | [日本語](README.ja.md) -->

# @lily-ui/web-components

Accessible (WCAG 2.1 AAA), **framework-agnostic Web Components** for Lily UI —
custom elements you can drop into any framework (or none). The component set
mirrors [`@lily-ui/react`](../react) one-for-one — same class names, same DOM,
same accessibility.

## Light-DOM by design

Lily styling lives in the global [`@lily-ui/css`](../css) layer (plain class
names + `data-theme` / `data-density`). To keep that working, Lily elements
render in the **light DOM** rather than a shadow root: each `<lily-*>` host is
`display: contents` and renders a real semantic element (e.g. a `<button>`) with
the correct `lily-*` classes. The result is markup identical to the React/Vue
output — fully themeable, with native semantics and event bubbling intact.

## Install

```bash
pnpm add @lily-ui/web-components @lily-ui/css
```

```ts
// App entry (once):
import '@lily-ui/css/styles';
import '@lily-ui/web-components/define'; // registers all <lily-*> elements
```

```html
<lily-button status="primary" variant="solid">こんにちは</lily-button>

<lily-card>
  <lily-card-header>Header</lily-card-header>
  <lily-card-body><lily-card-title>Title</lily-card-title>Body</lily-card-body>
</lily-card>
```

Prefer to register a subset yourself? Skip the `/define` import and call the
registry:

```ts
import { defineLilyElements } from '@lily-ui/web-components';
defineLilyElements();
```

## Conventions

- Tags are kebab-case `lily-<name>` (parts: `lily-<name>-<part>`,
  e.g. `lily-card-header`).
- Props are attributes (`status`, `size`, `variant`, `block`, …). Boolean props
  are presence-based (`<lily-button block loading>`).
- Components that take arrays/objects in React accept a JSON attribute of the
  same name: `<lily-tabs items='[{"id":"a","label":"A","content":"…"}]'>`.
- Native events bubble out of the host (`click`, `input`, `change`).
  Synthesized events are dispatched as `CustomEvent` (`close`, `change`).
- Overlays portal to `document.body` and manage focus trap, scroll lock, and
  dismissal. Toasts have an imperative API: `toast({ message: 'Saved' })`.

## Theming & tokens

Set `data-theme="light|dark"` (or omit to follow the OS) and
`data-density="compact"` on an ancestor — see the
[theming docs](../../docs/theming.md). Type-safe token references:

```ts
import { cssVar } from '@lily-ui/web-components/tokens';
cssVar('color-primary'); // "var(--lily-color-primary)"
```

## Develop

```bash
pnpm --filter @lily-ui/web-components build       # ESM + CJS + d.ts
pnpm --filter @lily-ui/web-components typecheck
```
