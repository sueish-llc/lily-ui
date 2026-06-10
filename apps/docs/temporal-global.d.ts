// Supplies the global `Temporal` type to the docs TypeScript program, so the
// Lily component source pulled in via tsconfig `paths` typechecks without a
// build. The matching runtime polyfill is imported in the playground island.
import 'temporal-polyfill/global';
