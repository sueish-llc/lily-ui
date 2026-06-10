# Contributing to Lily UI

## Setup

```bash
corepack enable      # ensures pnpm is available
pnpm install
pnpm dev             # Storybook on :6006
```

## Adding a component

A component spans **all four packages** — styles plus the three runtimes
(React is the source of truth; Vue and Web Components must match its DOM,
class names, ARIA, and keyboard behavior). `pnpm new <Name>` scaffolds the
files below.

1. **Styles** → `@lily-ui/css`: `packages/css/src/styles/components/_<name>.scss`,
   then `@use` it from `packages/css/src/styles/index.scss`. Use only semantic
   CSS-variable tokens (`fn.var-ref(...)`).
2. **React** → `@lily-ui/react`: `packages/react/src/components/<Name>/`
   containing:

   ```
   <Name>.tsx          # forwardRef, JSDoc, typed props, class names + ARIA
   <Name>.stories.tsx  # Storybook stories + autodocs
   <Name>.test.tsx     # behavior tests (Testing Library)
   <Name>.a11y.test.tsx# vitest-axe checks
   index.ts            # re-exports
   ```

   Export it from `packages/react/src/index.ts`.
3. **Vue** → `@lily-ui/vue`: `packages/vue/src/components/<Name>/<Name>.vue`
   (+ `<Name>.test.ts`), exported directly from `packages/vue/src/index.ts`
   (no per-component barrel).
4. **Web Components** → `@lily-ui/web-components`:
   `packages/web-components/src/components/<Name>.ts`, exported from
   `packages/web-components/src/index.ts` **and** registered in
   `packages/web-components/src/elements.ts` (the `[tag-name, ctor]` entry).
5. Add it to the catalog in [docs/roadmap.md](docs/roadmap.md).

See [docs/framework-ports.md](docs/framework-ports.md) for the per-framework
authoring conventions. A component is not done until it exists in all three
runtime packages — never land one package alone.

## Rules

- **No magic numbers.** Use tokens (`fn.var-ref(...)` / `var(--lily-*)`).
- **Accessibility is non-negotiable.** Keyboard support, correct ARIA, visible
  focus, and a passing `*.a11y.test.tsx`. The target is WCAG 2.1 **AAA**
  (see [docs/accessibility.md](docs/accessibility.md)).
- **Dates and times use the Temporal API** — never `Date` or hand-parsed
  strings (see the Date & time section in [CLAUDE.md](CLAUDE.md)).
- **Type everything**; document every public prop with JSDoc (this powers
  autodocs and AI-assisted usage).
- Prefer `ref` forwarding and the polymorphic `as` prop where it makes sense.

## Checks

Run the same checks as CI before pushing:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm typecheck
pnpm test
```

## Releasing

We use [Changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset   # describe your change (the four public packages version together)
# on merge to main, CI versions & publishes via npm trusted publishing
```
