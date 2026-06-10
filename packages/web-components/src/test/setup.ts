// Ensure the Temporal API global exists. Node 26 (the project's target) ships
// it natively; only fall back to the polyfill when it's absent (older Node,
// browsers, some CI runners) so tests exercise the native implementation when
// it is available rather than masking it.
if (typeof globalThis.Temporal === 'undefined') {
  await import('temporal-polyfill/global');
}

export {};
