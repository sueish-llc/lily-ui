<!-- [日本語（正）](../architecture.md) | English (translation) -->

# Architecture

## Monorepo layout

```
.
├── packages/
│   ├── css/            @lily-ui/css   — CSS/SCSS design library (tokens, themes,
│   │   └── src/styles/                  utilities, component styles)
│   └── react/          @lily-ui/react — React components (markup, behavior, ARIA,
│       └── src/                         types). No styles of its own.
├── apps/
│   └── storybook/      @lily-ui/storybook — docs site (private)
├── docs/               human docs
└── .changeset/         versioning/release
```

Managed with **pnpm workspaces**. `@lily-ui/css` and `@lily-ui/react` are
version-linked via Changesets so they always release together.

## Why two packages

| Concern | Lives in |
| --- | --- |
| Visual design (color, spacing, type, component looks) | `@lily-ui/css` |
| Behavior, accessibility wiring, React types | `@lily-ui/react` |

- The CSS library is **framework-agnostic** — use it with plain HTML or any
  framework, like any plain CSS library.
- The React library renders the right **class names + ARIA** and owns
  interaction logic. It declares `@lily-ui/css` as a peer dependency, so there's
  a single copy of the styles and no duplication.

This keeps the React bundle minimal and lets the design language evolve in one
place.

## Token pipeline

```
primitives (raw scales)
   ↓  map onto intent
semantic tokens (per theme: light / dark / custom)
   ↓  emitted as CSS custom properties (--lily-*)
utilities (.lily-*)  +  component styles (.lily-button …)
   ↓  consumed by
@lily-ui/react components (class names) and your app
```

See [tokens.md](tokens.md) for details. The TypeScript token surface
(`@lily-ui/react/tokens`) mirrors the SCSS keys for type-safe, AI-friendly use.

## Build

- `@lily-ui/css`: `sass` compiles `src/styles/index.scss → dist/lily-ui.css`
  and `fonts.scss → dist/fonts.css`. Raw SCSS is also published for SCSS
  consumers (`@lily-ui/css/scss`).
- `@lily-ui/react`: Vite library build emits ESM + CJS; `tsc` emits `.d.ts`.
  `react`, `react-dom`, and `@lily-ui/css` are externalized.

## SSR / SSG

- Default styles live on `:root` (light scheme), so server-rendered HTML is
  correct with zero JS.
- `ThemeProvider` only touches `window`/`document` inside effects.
- `ThemeScript` applies the stored theme before hydration to avoid FOUC.
