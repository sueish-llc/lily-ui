// Supplies the global `Temporal` types to the Storybook TypeScript program, so
// stories (and the component source they import) typecheck. The matching
// runtime polyfill is installed in `.storybook/preview.tsx`.
//
// Note: this lives in the app root rather than `.storybook/` because TypeScript
// excludes dotted directories from `include` glob expansion.
import 'temporal-polyfill/global';
