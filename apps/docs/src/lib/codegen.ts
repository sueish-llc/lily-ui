// Turn a playground prop state into idiomatic source for each framework.
// All three packages emit identical markup, so the same prop set maps cleanly:
// only props that differ from their default are emitted, keeping output tidy.

import type { Component, PropControl } from '../registry';

export type PropValue = string | number | boolean;
export type PropValues = Record<string, PropValue>;
export type Framework = 'react' | 'vue' | 'wc';

export interface CodegenInput {
  component: Pick<Component, 'name' | 'tag' | 'controls'>;
  values: PropValues;
  children?: string;
}

function kebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Props whose current value differs from the control default (→ worth emitting). */
function activeProps(controls: PropControl[], values: PropValues): [string, PropValue][] {
  const out: [string, PropValue][] = [];
  for (const c of controls) {
    if (!(c.name in values)) continue;
    const v = values[c.name];
    if (v === undefined || v === '') continue;
    if (v === c.default) continue;
    // a false boolean that defaults to false/undefined is noise — skip it
    if (typeof v === 'boolean' && v === false && !c.default) continue;
    out.push([c.name, v]);
  }
  return out;
}

const indentLines = (s: string, pad: string) =>
  s
    .split('\n')
    .map((l) => (l ? pad + l : l))
    .join('\n');

// ---------------------------------------------------------------------------
// React
// ---------------------------------------------------------------------------

function reactAttr([name, value]: [string, PropValue]): string {
  if (typeof value === 'boolean') return value ? name : `${name}={false}`;
  if (typeof value === 'number') return `${name}={${value}}`;
  return `${name}="${value}"`;
}

export function reactCode({ component, values, children }: CodegenInput): string {
  const { name } = component;
  const props = activeProps(component.controls, values);
  const attrs = props.map(reactAttr);
  const tag = name;

  let open: string;
  if (attrs.length <= 1) {
    open = `<${tag}${attrs.length ? ' ' + attrs[0] : ''}`;
  } else {
    open = `<${tag}\n${attrs.map((a) => '  ' + a).join('\n')}\n`;
  }

  const importLine = `import { ${name} } from '@lily-ui/react';`;
  if (!children) {
    const selfClose = attrs.length <= 1 ? `${open} />` : `${open}/>`;
    return `${importLine}\n\n${selfClose}`;
  }
  const close = attrs.length <= 1 ? `${open}>` : `${open}>`;
  return `${importLine}\n\n${close}\n${indentLines(children, '  ')}\n</${tag}>`;
}

// ---------------------------------------------------------------------------
// Vue
// ---------------------------------------------------------------------------

function vueAttr([name, value]: [string, PropValue]): string {
  if (typeof value === 'boolean') return value ? name : `:${name}="false"`;
  if (typeof value === 'number') return `:${name}="${value}"`;
  return `${name}="${value}"`;
}

export function vueCode({ component, values, children }: CodegenInput): string {
  const { name } = component;
  const props = activeProps(component.controls, values);
  const attrs = props.map(vueAttr);

  let el: string;
  const inner = children ? children : '';
  if (attrs.length <= 1) {
    const a = attrs.length ? ' ' + attrs[0] : '';
    el = children ? `<${name}${a}>${inner}</${name}>` : `<${name}${a} />`;
  } else {
    const attrBlock = attrs.map((x) => '    ' + x).join('\n');
    el = children
      ? `<${name}\n${attrBlock}\n  >${inner}</${name}>`
      : `<${name}\n${attrBlock}\n  />`;
  }

  return [
    `<script setup lang="ts">`,
    `import { ${name} } from '@lily-ui/vue';`,
    `</script>`,
    ``,
    `<template>`,
    `  ${el}`,
    `</template>`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Web Components
// ---------------------------------------------------------------------------

function wcAttr([name, value]: [string, PropValue]): string {
  const attr = kebab(name);
  if (typeof value === 'boolean') return value ? attr : '';
  return `${attr}="${value}"`;
}

export function wcCode({ component, values, children }: CodegenInput): string {
  const { tag } = component;
  const props = activeProps(component.controls, values);
  const attrs = props.map(wcAttr).filter(Boolean);
  const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
  const inner = children ?? '';
  const el = children ? `<${tag}${attrStr}>${inner}</${tag}>` : `<${tag}${attrStr}></${tag}>`;
  return [`<!-- once per app: import '@lily-ui/web-components'; -->`, el].join('\n');
}

export const generators: Record<Framework, (input: CodegenInput) => string> = {
  react: reactCode,
  vue: vueCode,
  wc: wcCode,
};

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: 'React',
  vue: 'Vue',
  wc: 'Web Components',
};
