/**
 * Ambient global `Temporal` types.
 *
 * Node 26 — the project's primary target — ships the Temporal API as a native
 * global, so production code references `Temporal` directly. This declaration
 * only supplies the TypeScript types (via temporal-polyfill's spec-compatible
 * definitions); it emits no runtime code.
 *
 * Runtimes without native Temporal (older Node, most browsers, and the
 * Vitest/jsdom test environment) load the polyfill at startup — see
 * `src/test/setup.ts` for tests, and the README for application setup.
 */
import 'temporal-polyfill/global';
