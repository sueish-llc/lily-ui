#!/usr/bin/env node
// Scaffold a new Lily UI component with the project's conventions baked in,
// across all three runtime packages (framework parity is required — see
// CLAUDE.md): React component + barrel + unit test + a11y test + Storybook
// story, a Vue SFC, a Web Components custom element (wired into the element
// registry), plus a matching CSS partial wired into the stylesheet entry and
// each package's barrel.
//
// Usage:  pnpm new <PascalName>        e.g.  pnpm new Avatar
//
// Why this exists: consistency is what makes the design system feel unified and
// makes it easy for both humans and AI to add components without guessing the
// layout, prop names, or class-name scheme.
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const raw = process.argv[2];
if (!raw || !/^[A-Z][A-Za-z0-9]+$/.test(raw)) {
  console.error('Usage: pnpm new <PascalName>   (e.g. pnpm new Avatar)');
  process.exit(1);
}
const Name = raw;
const kebab = Name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const cls = `lily-${kebab}`;

const exists = async (p) => access(p).then(() => true).catch(() => false);

const compDir = join(root, 'packages/react/src/components', Name);
if (await exists(compDir)) {
  console.error(`✗ Component already exists: ${compDir}`);
  process.exit(1);
}

// --- File templates --------------------------------------------------------
// Prop naming mirrors every other component (status / size / variant) so the
// API is predictable. See docs/ai-usage.md.
const component = `import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * ${Name} — TODO: one-line description.
 *
 * Styling comes entirely from \`@lily-ui/css\` (\`.${cls}*\` classes); this
 * component owns markup, accessibility wiring, and types.
 */
export interface ${Name}Props extends HTMLAttributes<HTMLDivElement> {
  /** Semantic color/intent. */
  status?: 'primary' | 'danger' | 'warning' | 'success' | 'info' | 'neutral';
  /** Control size. */
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

export const ${Name} = forwardRef<HTMLDivElement, ${Name}Props>(function ${Name}(
  { status = 'neutral', size = 'md', className, children, ...rest },
  ref,
) {
  const classes = ['${cls}', \`${cls}--\${size}\`, className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} data-status={status} {...rest}>
      {children}
    </div>
  );
});
`;

const barrel = `export { ${Name} } from './${Name}';
export type { ${Name}Props } from './${Name}';
`;

const unitTest = `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ${Name} } from './${Name}';

describe('${Name}', () => {
  it('renders its children', () => {
    render(<${Name}>内容</${Name}>);
    expect(screen.getByText('内容')).toBeInTheDocument();
  });
});
`;

const a11yTest = `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ${Name} } from './${Name}';

// jsdom can't lay out or paint, so axe's color-contrast rule can't run here.
const axeOptions = { rules: { 'color-contrast': { enabled: false } } } as const;

describe('${Name} a11y', () => {
  it('has no violations', async () => {
    const { container } = render(<${Name}>内容</${Name}>);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});
`;

const story = `import type { Meta, StoryObj } from '@storybook/react';
import { ${Name} } from './${Name}';

const meta: Meta<typeof ${Name}> = {
  // TODO: pick the right category (Foundations / Layout / Typography / Actions /
  // Data Display / Media / Forms / Navigation / Disclosure / Feedback / Overlay).
  title: 'Data Display/${Name}',
  component: ${Name},
  tags: ['autodocs'],
  args: { children: '${Name}' },
};
export default meta;

type Story = StoryObj<typeof ${Name}>;

export const Default: Story = {};
`;

// Vue SFC mirroring the React markup one-for-one (React is the source of truth).
const vueComponent = `<script setup lang="ts">
import { computed } from 'vue';
import { cx } from '../../utils/cx';

/**
 * ${Name} — TODO: one-line description. Mirrors the React ${Name}.
 */
const props = withDefaults(
  defineProps<{
    /** Semantic color/intent. */
    status?: 'primary' | 'danger' | 'warning' | 'success' | 'info' | 'neutral';
    /** Control size. */
    size?: 'sm' | 'md' | 'lg';
  }>(),
  { status: 'neutral', size: 'md' },
);

const classes = computed(() => cx('${cls}', \`${cls}--\${props.size}\`));
</script>

<template>
  <div :class="classes" :data-status="status">
    <slot />
  </div>
</template>
`;

// Behavior test mirroring the markup contract (class scheme + data-status).
const vueTest = `import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import ${Name} from './${Name}.vue';

describe('${Name}', () => {
  it('renders its children with the documented class scheme', () => {
    render(${Name}, { slots: { default: '内容' } });
    const el = screen.getByText('内容');
    expect(el.className).toBe('${cls} ${cls}--md');
    expect(el).toHaveAttribute('data-status', 'neutral');
  });
});
`;

// Custom element rendering the same light-DOM markup and classes.
const wcComponent = `import { LilyElement, h, type BuildResult } from '../base/LilyElement';

/**
 * \`<lily-${kebab}>\` — TODO: one-line description. Mirrors the React ${Name}.
 *
 * Attributes: \`status\`, \`size\`.
 */
export class Lily${Name} extends LilyElement {
  static get observedAttributes(): string[] {
    return ['status', 'size'];
  }

  protected build(): BuildResult {
    const root = h('div', {
      class: ['${cls}', \`${cls}--\${this.attr('size', 'md')}\`],
      attrs: { 'data-status': this.attr('status', 'neutral') },
    });
    return { root };
  }
}
`;

// Style partial follows the 彩 (Sai) design language: tokens only, no raw px.
const scss = `@use '../abstracts/functions' as fn;
@use '../abstracts/mixins' as mx;

// ${Name} — TODO: description.
.${cls} {
  display: block;
  padding: fn.var-ref('space-3') fn.var-ref('space-4');
  color: fn.var-ref('color-fg-default');
  background-color: fn.var-ref('color-bg-surface');
  border: fn.var-ref('border-thin') solid fn.var-ref('color-border-default');
  border-radius: fn.var-ref('radius-lg');
}
`;

// --- Write component files -------------------------------------------------
await mkdir(compDir, { recursive: true });
await Promise.all([
  writeFile(join(compDir, `${Name}.tsx`), component),
  writeFile(join(compDir, 'index.ts'), barrel),
  writeFile(join(compDir, `${Name}.test.tsx`), unitTest),
  writeFile(join(compDir, `${Name}.a11y.test.tsx`), a11yTest),
  writeFile(join(compDir, `${Name}.stories.tsx`), story),
]);

// --- Write style partial ---------------------------------------------------
const scssPath = join(root, 'packages/css/src/styles/components', `_${kebab}.scss`);
await writeFile(scssPath, scss);

// --- Wire into the CSS entry (index.scss) ----------------------------------
const indexScssPath = join(root, 'packages/css/src/styles/index.scss');
let indexScss = await readFile(indexScssPath, 'utf8');
if (!indexScss.includes(`components/${kebab}'`)) {
  indexScss = indexScss.replace(/\n$/, '') + `\n@use 'components/${kebab}';\n`;
  await writeFile(indexScssPath, indexScss);
}

// --- Wire into the React barrel (src/index.ts) -----------------------------
const reactIndexPath = join(root, 'packages/react/src/index.ts');
let reactIndex = await readFile(reactIndexPath, 'utf8');
if (!reactIndex.includes(`./components/${Name}'`)) {
  reactIndex = reactIndex.replace(/\n$/, '') + `\nexport * from './components/${Name}';\n`;
  await writeFile(reactIndexPath, reactIndex);
}

// --- Write the Vue port & wire its barrel -----------------------------------
const vueDir = join(root, 'packages/vue/src/components', Name);
await mkdir(vueDir, { recursive: true });
await writeFile(join(vueDir, `${Name}.vue`), vueComponent);
await writeFile(join(vueDir, `${Name}.test.ts`), vueTest);
const vueIndexPath = join(root, 'packages/vue/src/index.ts');
let vueIndex = await readFile(vueIndexPath, 'utf8');
if (!vueIndex.includes(`./components/${Name}/${Name}.vue'`)) {
  vueIndex =
    vueIndex.replace(/\n$/, '') +
    `\nexport { default as ${Name} } from './components/${Name}/${Name}.vue';\n`;
  await writeFile(vueIndexPath, vueIndex);
}

// --- Write the custom element & wire barrel + registry ----------------------
await writeFile(join(root, 'packages/web-components/src/components', `${Name}.ts`), wcComponent);
const wcIndexPath = join(root, 'packages/web-components/src/index.ts');
let wcIndex = await readFile(wcIndexPath, 'utf8');
if (!wcIndex.includes(`./components/${Name}'`)) {
  wcIndex = wcIndex.replace(/\n$/, '') + `\nexport { Lily${Name} } from './components/${Name}';\n`;
  await writeFile(wcIndexPath, wcIndex);
}
const elementsPath = join(root, 'packages/web-components/src/elements.ts');
let elements = await readFile(elementsPath, 'utf8');
if (!elements.includes(`'lily-${kebab}'`)) {
  const lastImport = elements.lastIndexOf("\nimport ");
  const importEnd = elements.indexOf('\n', lastImport + 1);
  elements =
    elements.slice(0, importEnd) +
    `\nimport { Lily${Name} } from './components/${Name}';` +
    elements.slice(importEnd);
  // Append the [tag, ctor] entry at the end of the `elements` array.
  const arrayStart = elements.indexOf('export const elements');
  const arrayClose = elements.indexOf('\n];', arrayStart);
  elements =
    elements.slice(0, arrayClose) +
    `\n  ['lily-${kebab}', Lily${Name}],` +
    elements.slice(arrayClose);
  await writeFile(elementsPath, elements);
}

console.log(`✓ Created component "${Name}" (class .${cls}, tag <lily-${kebab}>)

  packages/react/src/components/${Name}/
    ${Name}.tsx  index.ts  ${Name}.test.tsx  ${Name}.a11y.test.tsx  ${Name}.stories.tsx
  packages/vue/src/components/${Name}/${Name}.vue
  packages/web-components/src/components/${Name}.ts
  packages/css/src/styles/components/_${kebab}.scss

  wired into index.scss + the react/vue/web-components barrels + the element registry.

Next:
  - flesh out the component & styles (follow docs/design-language.md)
  - keep the Vue & Web Components ports identical to the React markup
  - pick the Storybook category in ${Name}.stories.tsx
  - pnpm --filter @lily-ui/css build
  - pnpm test`);
