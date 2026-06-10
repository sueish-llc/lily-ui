<!-- [日本語（正）](../accessibility.md) | English (translation) -->

# Accessibility (WCAG 2.1 AAA)

Lily UI is designed so that an app built with it can reach **WCAG 2.1 AAA**.
Accessibility is a shared responsibility: the library provides accessible
building blocks and guardrails; your composition and content choices complete
the picture.

## What the library guarantees

- **Visible keyboard focus** (2.4.7): a consistent `:focus-visible` ring on all
  interactive components, never removed without a replacement.
- **Reduced motion** (2.3.3): animations honor `prefers-reduced-motion`.
- **Color is not the only signal** (1.4.1): status is conveyed via text/icons,
  not color alone.
- **Resizable text** (1.4.4): all sizing is `rem`-based; the root size follows
  the user's browser preference.
- **Contrast** (1.4.3/1.4.6): in the default theme every text/background pair
  meets AAA (7:1 body, 4.5:1 large text, 3:1 non-text). For body-size colored
  text and links, use `--lily-color-*-text` (`primary-text` / `accent-text` /
  `danger-text` / `warning-text` / `success-text` / `info-text`). The solid
  action/status fills (`primary` / `danger` / `success` / `info`) are deepened so
  their on-fill text (white in light mode, near-black in dark mode) clears 7:1 in
  the default state — **filled controls are AAA**. `warning` keeps its yellow with
  near-black text (8.7:1; its transient hover is ~6.3:1). `accent` (藤 fuji) stays
  vivid for emphasis/decoration — no component renders body text on it.
- **Screen-reader utilities**: `.lily-visually-hidden`, `.lily-skip-link`.
- **Correct roles/states** in components (e.g. `aria-busy` on loading buttons,
  `aria-disabled` for non-native disabled controls).
- **Automated checks**: every component has a `*.a11y.test.tsx` (vitest-axe) and
  is verified by the Storybook a11y addon (CI fails on violations).

## What you are responsible for

- **Contrast of custom themes** (1.4.3/1.4.6/1.4.11): if you override color
  tokens, re-verify contrast (≥ 7:1 body text, ≥ 4.5:1 large text, ≥ 3:1 UI
  boundaries).
- **Meaningful labels/alt text** for your content and icons.
- **Logical heading structure** and landmark regions at the page level.
- **Focus management** across navigation/route changes.

## "Complete AAA compliance" — a note

No component library can _unilaterally_ guarantee full-page AAA conformance,
because some criteria depend on content and composition (contrast of chosen
colors, heading order, page landmarks). Lily UI's goal is to make the accessible
path the **default and the easy one**, and to fail loudly (tests, CI) when a
component regresses.

## Testing

```bash
pnpm test:a11y     # vitest-axe across components
pnpm dev           # Storybook → a11y panel per story
```
