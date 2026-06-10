/**
 * Shared axe options for component a11y tests.
 *
 * jsdom can't lay out or paint, so axe's `color-contrast` rule (which needs
 * canvas/getComputedStyle pixel data) can't run in unit tests. Contrast is
 * instead verified against the token palette in docs/accessibility.md and via
 * the Storybook a11y addon in a real browser.
 */
export const axeOptions = {
  rules: { 'color-contrast': { enabled: false } },
} as const;
