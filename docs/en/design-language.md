<!-- [日本語（正）](../design-language.md) | English (translation) -->

# Design language: 彩 (Sai)

How Lily UI looks is decided by tokens. Color, shape, spacing, type, and motion
are not set per component; follow this page and the design tokens.

## Principles

- Soft: larger radii, wide-blur shadows, restrained motion.
- Warm: a slightly warm base with warm accents.
- Friendly: fixed color meanings, Japanese text set with room to breathe.

## Color

Use color only through the semantic tokens (`--lily-color-*`). Don't call raw
palette values such as `brand-500` from a component. A token's value changes
between light and dark, so refer to tokens by role, not by a fixed color name
(the tables below show both modes).

### Brand colors

| Role    | Token                  | Light     | Dark      |
| ------- | ---------------------- | --------- | --------- |
| primary | `--lily-color-primary` | `#cd2e69` | `#e35f93` |
| accent  | `--lily-color-accent`  | `#f05537` | `#ff9582` |

Use primary for main buttons, links, and the selected state; use accent for
emphasis and decoration. Neither signals state. Keep primary and accent on
separate hues and don't mix them for the same purpose. primary is a sasayuri
pink and accent a fuji (wisteria) violet, hue families that stay the same
across light and dark.

There are two gradients: `--lily-color-accent-gradient` (accent) and
`--lily-color-primary-gradient` (primary). Overusing them dilutes the effect, so
we recommend at most one per screen.

### Surfaces and text

| Role           | Token                     | Light     | Dark      |
| -------------- | ------------------------- | --------- | --------- |
| background     | `--lily-color-bg-canvas`  | `#faf9f7` | `#0b0908` |
| surface        | `--lily-color-bg-surface` | `#ffffff` | `#14110e` |
| text           | `--lily-color-fg-default` | `#14110e` | `#faf9f7` |
| text-secondary | `--lily-color-fg-muted`   | `#38332d` | `#d3cdc4` |
| text-tertiary  | `--lily-color-fg-subtle`  | `#534d45` | `#a49d92` |

### State colors

`danger` / `warning` / `success` / `info`. Use only to signal state, never for
decoration.

### Contrast (WCAG 2.1 AAA)

- Every text/background pair meets AAA (7:1 body text, 4.5:1 large text).
  Non-text such as borders is 3:1.
- For body-size colored text and links, use `--lily-color-*-text`
  (`primary-text` / `accent-text` / `danger-text` / `warning-text` /
  `success-text` / `info-text`). These carry the AAA contrast.
- White text on a colored fill (buttons, etc.) is AA (~5:1) at normal size. For
  AAA, make the label large (18.66px+ bold, or 24px+).
- Dark mode assigns different values to the same token names. Every component
  works in both light and dark.

## Shape

Corners are kept a touch larger.

| Token                | Value | Where it's used              |
| -------------------- | ----- | ---------------------------- |
| `--lily-radius-sm`   | 6px   | Badges, small tags           |
| `--lily-radius-md`   | 10px  | Buttons, inputs              |
| `--lily-radius-lg`   | 14px  | Cards, modals                |
| `--lily-radius-xl`   | 20px  | Large panels, heroes         |
| `--lily-radius-2xl`  | 28px  | Especially large containers  |
| `--lily-radius-pill` | Max   | Tags, chips, rounded buttons |

Keep borders to 1px and express lift with shadow; don't strengthen both at once.
Use `--lily-shadow-md` by default, and `lg` / `xl` only for overlapping things
(modals, popovers).

## Spacing

Use the 4px scale (`--lily-space-*`). No eyeballed px values.

Switch density with `data-density`.

| `data-density`          | Suited for                      | Effect                  |
| ----------------------- | ------------------------------- | ----------------------- |
| `comfortable` (default) | Brand sites, general apps       | Standard control height |
| `compact`               | Business systems, admin screens | Shorter control height  |

```html
<body data-density="compact">
  …
</body>
```

## Type

See [typography.md](typography.md) for details. The essentials:

- Body line height `--lily-leading-relaxed` (1.7); longer passages
  `--lily-leading-ja` (1.85). Tracking `--lily-tracking-ja`.
- Punctuation/kana tightening is left to `font-feature-settings: 'palt'`.
- Kinsoku (`line-break: strict`), phrase breaks (`word-break: auto-phrase`),
  `text-wrap: balance` for headings, and `text-wrap: pretty` for body are
  enabled by default at the reset layer.
- The typeface is LINE Seed JP first, with system fonts stacked behind it.

## Motion

Default is `--lily-duration-base` (200ms) with `--lily-ease-standard`.
`prefers-reduced-motion` is respected globally at the reset layer.

## Checklist

- Is color going through semantic tokens? No raw values inline?
- Is body-size colored text using `--lily-color-*-text` (AAA)?
- Are radius, shadow, and spacing using tokens? No px inline?
- Is the gradient kept to one spot per screen?
- Are line height, kinsoku, and `text-wrap` in effect?
- Does text contrast meet AAA in both light and dark?
- Does excessive motion stop under `prefers-reduced-motion`?

For the full token list see [tokens.md](tokens.md); for AI usage see
[ai-usage.md](ai-usage.md).
