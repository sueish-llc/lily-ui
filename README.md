<!-- English | [日本語](README.ja.md) -->

# Lily UI

> A token-driven, accessible design system — a framework-agnostic **CSS library**
> plus matching component libraries for **React**, **Vue**, and
> **Web Components**, in a pnpm monorepo.

Lily UI provides both a low-level styling system (design tokens + utility
classes, usable anywhere) and a high-level component set covering the full range
of common UI components — the same set in React, Vue, and framework-agnostic
custom elements — built around **accessibility (WCAG 2.1 AAA)**,
**SSR/SSG safety**, **dark mode / custom themes**, and a Japanese-first type
system (recommended face: LINE Seed, SIL Open Font License 1.1).

## Packages

| Package                                | What it is                                                                             | Published  |
| -------------------------------------- | -------------------------------------------------------------------------------------- | ---------- |
| [`@lily-ui/css`](packages/css)         | Design tokens, themes, utility classes, component styles. Framework-agnostic CSS/SCSS. | ✅         |
| [`@lily-ui/react`](packages/react)     | React components: markup, behavior, ARIA, types. Styling via `@lily-ui/css`.           | ✅         |
| [`@lily-ui/vue`](packages/vue)         | Vue 3 components — the React set mirrored one-for-one. Styling via `@lily-ui/css`.      | ✅         |
| [`@lily-ui/web-components`](packages/web-components) | Framework-agnostic custom elements (`<lily-*>`, light-DOM). Styling via `@lily-ui/css`. | ✅         |
| [`@lily-ui/storybook`](apps/storybook) | Storybook docs / preview site.                                                         | 🚫 private |
| [`@lily-ui/docs`](apps/docs)           | Brand / documentation site (Astro), deployed to GitHub Pages.                          | 🚫 private |

## Quick start

```bash
pnpm add @lily-ui/react @lily-ui/css
```

```tsx
import '@lily-ui/css/styles';
import { ThemeProvider, Button } from '@lily-ui/react';

export function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Button status="primary">こんにちは</Button>
    </ThemeProvider>
  );
}
```

## Develop (monorepo)

```bash
pnpm install
pnpm dev              # Storybook (apps/storybook) on :6006
pnpm test             # unit + a11y across packages
pnpm build            # build every publishable package (css, react, vue, web-components)
pnpm lint             # eslint + stylelint
```

Requires **pnpm** (`corepack enable`) and **Node 26+** — the project targets
Node 26, whose runtime ships the [Temporal API](https://tc39.es/proposal-temporal/docs/)
natively. Date helpers in `@lily-ui/react` are built on Temporal; runtimes
without native support (older Node, most browsers) should load a polyfill such
as [`temporal-polyfill`](https://www.npmjs.com/package/temporal-polyfill) at app
startup (`import 'temporal-polyfill/global';`).

## Documentation

Docs are bilingual. Japanese is the source of truth (in `docs/`); English
translations live in [`docs/en/`](docs/en/). Each page links to the other
language at the top.

- [Design language — 彩 (Sai)](docs/design-language.md) — the worldview behind every token
- [AI usage guide](CLAUDE.md) — conventions for humans & AI agents
- [Architecture](docs/architecture.md)
- [Theming & dark mode](docs/theming.md)
- [Typography & LINE Seed setup](docs/typography.md)
- [Accessibility](docs/accessibility.md)
- [Design tokens](docs/tokens.md)
- [Motion](docs/motion.md)
- [Framework ports (Vue & Web Components)](docs/framework-ports.md)
- [Component catalog & plans](docs/roadmap.md)
- [Contributing](CONTRIBUTING.md)

## License

MIT for this project's own code and styles.

The recommended typeface, LINE Seed, is distributed separately under the SIL
Open Font License 1.1 and is owned by its respective rights holders. This project
references the family by name only and does not bundle or redistribute the font
files; you host them yourself under the font's own license.
