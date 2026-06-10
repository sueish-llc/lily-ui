<!-- [日本語（正）](../tokens.md) | English (translation) -->

# Design tokens

Tokens are organized in three layers; components only ever reference the
**semantic** layer (or utility classes derived from it).

```
primitives  →  semantic (theme)  →  components / utilities
  raw scales     intent + theme        consumption
```

## Layers

1. **Primitives** (`packages/css/src/styles/tokens/_primitives.scss`)
   Raw, theme-agnostic Sass maps: color ramps, the 4px spacing grid, type
   scale, radii, shadows, motion, z-index, breakpoints. The single source of
   truth for literal values — there are **no magic numbers** elsewhere.

2. **Semantic** (`packages/css/src/styles/themes/_schemes.scss`)
   Intent-named tokens (`color-fg-default`, `color-primary`, …) mapped onto
   primitives, defined once per theme (`$light`, `$dark`). Emitted as CSS
   custom properties by `themes/_root.scss`.

3. **Consumption**
   - SCSS: `fn.var-ref('color-primary')` → `var(--lily-color-primary)`
   - CSS: `var(--lily-space-4)`
   - Utility classes: `.lily-p-4`, `.lily-text-muted`, `.lily-bg-surface`
   - TypeScript: `cssVar('color-primary')` + typed keys (`@lily-ui/react/tokens`)

## Naming

| Group | Pattern | Example |
| --- | --- | --- |
| Spacing | `--lily-space-{key}` | `--lily-space-4` |
| Radius | `--lily-radius-{key}` | `--lily-radius-md` |
| Font size | `--lily-text-{key}` | `--lily-text-lg` |
| Font weight | `--lily-weight-{key}` | `--lily-weight-bold` |
| Shadow | `--lily-shadow-{key}` | `--lily-shadow-md` |
| Color (semantic) | `--lily-color-{role}` | `--lily-color-primary` |
| Color (palette scale) | `--lily-color-{role}-{step}` | `--lily-color-primary-100` |
| Motion | `--lily-duration-{key}`, `--lily-ease-{key}` | `--lily-duration-fast` |
| Z-index | `--lily-z-{layer}` | `--lily-z-modal` |
| Control height | `--lily-control-h-{key}` | `--lily-control-h-md` |
| Size (component dimensions) | `--lily-size-{key}` | `--lily-size-md` |

### Palette scale tokens

The ramps behind the semantic tokens (笹百合 / 藤 / 桜 plus the status hues
scarlet / amber / green / indigo) are also exposed as `--lily-color-{role}-{step}`,
where `step` runs 50 (lightest) to 900 (darkest) and `role` is `primary`,
`accent`, `danger`, `warning`, `success`, `info`, `neutral`, or `sakura` — e.g.
`--lily-color-primary-100`. These are theme-agnostic (the same value in light and
dark).

Still prefer the semantic tokens (`--lily-color-primary`, …) in everyday work.
The scale tokens are an escape hatch for diagrams, tooling, and one-off
adjustments that genuinely need a specific step; hard-coding a step inside a
component opts it out of theming.

> **Spacing vs. size:** `--lily-space-*` is the 4px spacing scale for padding,
> margins, and gaps. `--lily-size-*` is a separate scale for component
> *dimensions* (modal/offcanvas/toast widths, dropdown/tooltip caps). Never size
> a panel with a spacing token — pair a size token with `100%`/viewport caps so
> it stays responsive (e.g. `min(var(--lily-size-sm), calc(100vw - …))`).

## Adding or changing a token

1. Add/adjust the value in `_primitives.scss` (primitives) or `_schemes.scss`
   (semantic) in `@lily-ui/css`.
2. If JS/TS consumers need the key, mirror it in
   `packages/react/src/tokens/index.ts`.
3. Utilities and components pick it up automatically — no per-component edits.

## TypeScript usage

```ts
import { cssVar, type SemanticColorToken } from '@lily-ui/react/tokens';

const style = { color: cssVar('color-primary') }; // "var(--lily-color-primary)"
```
