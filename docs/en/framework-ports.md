<!-- [日本語（正）](../framework-ports.md) | English (translation) -->

# Framework ports: Vue & Web Components

Lily UI ships its component layer for three runtimes that all render the **same
markup** styled by `@lily-ui/css`:

| Package                     | Runtime                  | Authoring          |
| --------------------------- | ------------------------ | ------------------ |
| `@lily-ui/react`            | React 18+                | `forwardRef` TSX   |
| `@lily-ui/vue`              | Vue 3.5+                 | SFC (`<script setup>`) |
| `@lily-ui/web-components`   | any (custom elements)    | `LilyElement` (light DOM) |

The **React package is the source of truth.** Every Vue/WC component mirrors the
React component's DOM structure, class names, `data-*`/ARIA attributes, and
keyboard behavior exactly. Only the authoring idioms differ.

## Shared rules

- Class names follow the BEM-ish scheme from `CLAUDE.md`
  (`lily-x`, `lily-x--mod`, `lily-x__part`) — copy them verbatim from React.
- Styling lives entirely in `@lily-ui/css`; these packages emit class names only.
- Keep all ARIA roles/states and keyboard interactions identical to React.
- `cx()` (same implementation in every package) builds class strings.

## Vue conventions (`packages/vue/src/components/<Name>/<Name>.vue`)

- SFC with `<script setup lang="ts">`. One SFC per component; multi-part
  components get one SFC per part (`Card.vue`, `CardHeader.vue`, …).
- **Type exports** (`export type FooStatus = …`, prop interfaces) must live in a
  **separate plain `<script lang="ts">` block** — `<script setup>` cannot contain
  `export` statements. The plain block's exports are re-exported from the package
  entry as `export type { FooStatus } from './Foo.vue'`.
- Rely on Vue's single-root **fallthrough** for the user's `class`/attributes;
  bind library classes with `:class="cx(...)"` and let Vue merge.
- Polymorphic `as` → `<component :is="as ?? 'div'">`.
- Defaults via `withDefaults(defineProps<…>(), { … })`.
- Two-way state (`value`/`open`/`index`) uses `defineModel()` so the component is
  controllable **and** works uncontrolled. React callbacks map to events:
  `onChange → update:modelValue` / `change`, `onOpenChange → update:open`,
  `onClose → close`.
- Rich React `ReactNode` props (e.g. `title`, `icon`) become **named slots**
  (`#title`, `#icon`); keep a string prop fallback where the React prop was
  commonly a string.
- Array/data props (Accordion `items`, Carousel `slides`, Breadcrumb `items`,
  Pagination) stay as **props with the same object shape** as React.
- ids: `import { useId } from 'vue'`.
- Field controls: `useFieldControl` from `../../composables/field`; bind the
  returned attrs with `v-bind`.
- Overlays: wrap portalled content in `<Teleport to="body">`; use
  `useFocusTrap` / `useDismiss` / `useScrollLock` from
  `../../composables/interactions`.
- **Do not edit** `src/index.ts` — exports are assembled centrally.

See `Button.vue`, `Alert.vue`, `Input.vue`, `FormField.vue`, the `Card/*` parts,
and `ThemeProvider.vue` for the established patterns.

## Web Components conventions (`packages/web-components/src/components/<Name>.ts`)

- Export a **named** `class Lily<Name> extends LilyElement` (anonymous classes
  break `.d.ts` emit). Multi-part components export several named classes from
  one file.
- Tag names are kebab-case `lily-<name>` (parts: `lily-<name>-<part>`), e.g.
  `lily-button`, `lily-card-header`, `lily-form-field`.
- Implement `static get observedAttributes(): string[]` and
  `protected build(): BuildResult`. Use `h()` and `this.attr/boolAttr/numAttr/cx`.
- The base renders in the **light DOM**: the host is `display: contents`; `build`
  returns `{ root, slot? }` where `root` carries the `lily-*` class and `slot`
  (default `root`) receives the authored children. Do **not** append the authored
  children yourself.
- Avoid class-field names that collide with `HTMLElement` members (`part`,
  `title`, `slot`, `dir`, `lang`…). Prefer `partName`, etc.
- Native events bubble through the host automatically. For synthesized events use
  `this.dispatchEvent(new CustomEvent('name', { bubbles: true, detail }))`
  (mirror React's `onClose` → `close`, `onChange` → `change`, etc.).
- Internal state lives in private fields; call `this.rerender()` after changes.
  If you override `connectedCallback`/`disconnectedCallback`, call
  `super.connectedCallback()` and clean up listeners/timers/portals.
- Array/data props arrive as a **JSON attribute** of the same name
  (`items='[…]'`, `slides='[…]'`), parsed with `JSON.parse` in a `try/catch`.
- **Security:** Carousel's `slides` attribute renders each entry's HTML string
  verbatim (via `innerHTML`). Pass trusted HTML only — feeding it user input is
  an XSS vector.
- Generated ids: `uid()` from `../base/LilyElement`.
- Overlays/portals: create the backdrop/panel and `document.body.append(...)` it
  manually, keyed off an `open` attribute; use `lockScroll` / `trapFocus` /
  `listenDismiss` from `../base/interactions`; remove the portal on close/disconnect.
- Form controls: render the inner native element and
  `this.forwardAttrs(inner, FORM_CONTROL_ATTRS)` (plus size/type handling); native
  `input`/`change` events bubble out of the host already.
- **Do not edit** `src/index.ts` or `src/elements.ts` — registration is assembled
  centrally.

See `Button.ts`, `Badge.ts`, `Alert.ts`, `Card.ts`, `Spinner.ts`,
`base/LilyElement.ts`, and `base/interactions.ts` for the established patterns.

## Exception: Scrollspy

Scrollspy deliberately does **not** keep one shape across the three runtimes.
Each package exposes it in that framework's own idiom: React as a hook
(`useScrollspy`), Vue as a composable (`useScrollspy`), Web Components as a
utility function (`createScrollspy`). This is an intentional design choice —
don't reshape them toward parity.
