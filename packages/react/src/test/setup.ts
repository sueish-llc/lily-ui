import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

// Register the jest-axe style matcher (`toHaveNoViolations`) for a11y tests.
expect.extend(axeMatchers);

// Ensure the Temporal API global exists. Node 26 (the project's target) ships
// it natively; only fall back to the polyfill when it's absent (older Node,
// browsers, some CI runners) so tests exercise the native implementation when
// it is available rather than masking it.
if (typeof globalThis.Temporal === 'undefined') {
  await import('temporal-polyfill/global');
}

// jsdom lacks matchMedia; provide a no-op so ThemeProvider can mount in tests.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}
